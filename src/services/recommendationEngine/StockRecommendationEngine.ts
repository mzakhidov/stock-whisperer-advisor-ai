
import { StockRecommendation, MetricScore } from "@/types/stock";
import { API_KEYS, API_URLS } from '../apiConfig';
import { toast } from "sonner";

interface ExternalDataCache {
  [key: string]: number;
}

interface IndicatorConfig {
  weight: number;
  buyThreshold: number;
  sellThreshold: number;
  buyBelow: boolean;
  sellAbove: boolean;
}

interface Indicators {
  [key: string]: IndicatorConfig;
}

interface IndicatorResult {
  value: number | null;
  score: number;
  recommendation: string;
}

interface AnalysisResults {
  [key: string]: IndicatorResult;
}

export class StockRecommendationEngine {
  private externalDataCache: ExternalDataCache;
  private externalDataTimestamp: Date | null;
  private indicators: Indicators;

  constructor() {
    this.externalDataCache = {};
    this.externalDataTimestamp = null;
    
    // Initialize the indicators and weights based on the table
    this.indicators = {
      // Internal Indicators (Weight: 1)
      'RSI': { weight: 1, buyThreshold: 30, sellThreshold: 80, buyBelow: true, sellAbove: true },
      'PE_Ratio': { weight: 1, buyThreshold: 25, sellThreshold: 40, buyBelow: true, sellAbove: true },
      'Annual_Growth_Rate': { weight: 1, buyThreshold: 15, sellThreshold: 10, buyBelow: false, sellAbove: false },
      'Analyst_Rating': { weight: 1, buyThreshold: 4, sellThreshold: 2, buyBelow: false, sellAbove: false },
      'Analyst_Price_Projection': { weight: 1, buyThreshold: 50, sellThreshold: 0, buyBelow: false, sellAbove: false },
      'CEO_Strength': { weight: 1, buyThreshold: 4, sellThreshold: 2, buyBelow: false, sellAbove: false },
      'Moving_Average_Cross': { weight: 1, buyThreshold: 1, sellThreshold: -1, buyBelow: false, sellAbove: false },
      'Earnings_Beat_History': { weight: 1, buyThreshold: 3, sellThreshold: 1, buyBelow: false, sellAbove: false },
      'Company_Guidance': { weight: 1, buyThreshold: 1, sellThreshold: -1, buyBelow: false, sellAbove: false },
      'Latest_Company_News': { weight: 1, buyThreshold: 1, sellThreshold: -1, buyBelow: false, sellAbove: false },
      
      // External Indicators (Weight: 0.5)
      'Market_Sentiment': { weight: 0.5, buyThreshold: -20, sellThreshold: 20, buyBelow: true, sellAbove: true },
      'Macroeconomics': { weight: 0.5, buyThreshold: 1, sellThreshold: -1, buyBelow: false, sellAbove: false },
      'Bond_Yield': { weight: 0.5, buyThreshold: 4.2, sellThreshold: 5, buyBelow: true, sellAbove: true },
      'Inflation_Rate': { weight: 0.5, buyThreshold: 3, sellThreshold: 4, buyBelow: true, sellAbove: true },
      'Unemployment_Rate': { weight: 0.5, buyThreshold: 4, sellThreshold: 4, buyBelow: true, sellAbove: true },
      'Consumer_Spending': { weight: 0.5, buyThreshold: 0, sellThreshold: 0, buyBelow: false, sellAbove: false },
      'Consumer_Sentiment': { weight: 0.5, buyThreshold: 100, sellThreshold: 80, buyBelow: false, sellAbove: false },
      'Fed_Funds_Rate': { weight: 0.5, buyThreshold: 4, sellThreshold: 5, buyBelow: true, sellAbove: true },
      'VIX_Rate': { weight: 0.5, buyThreshold: 20, sellThreshold: 40, buyBelow: true, sellAbove: true },
      'GDP_Growth_Rate': { weight: 0.5, buyThreshold: 0, sellThreshold: 0, buyBelow: false, sellAbove: false }
    };
  }

  /**
   * Calculate Relative Strength Index (RSI)
   */
  private calculateRSI(priceData: any[], window = 14): number | null {
    if (!priceData || priceData.length < window + 1) return null;
    
    // Calculate price changes
    const changes = [];
    for (let i = 1; i < priceData.length; i++) {
      changes.push(priceData[i].price - priceData[i-1].price);
    }
    
    // Calculate gains and losses
    let gains = 0;
    let losses = 0;
    
    // Initial average gain and loss
    for (let i = 0; i < window; i++) {
      if (changes[i] > 0) gains += changes[i];
      if (changes[i] < 0) losses += Math.abs(changes[i]);
    }
    
    let avgGain = gains / window;
    let avgLoss = losses / window;
    
    // Calculate RSI using the smoothing method for the remaining periods
    for (let i = window; i < changes.length; i++) {
      const change = changes[i];
      const currentGain = change > 0 ? change : 0;
      const currentLoss = change < 0 ? Math.abs(change) : 0;
      
      // Update average gain and loss using the smoothing formula
      avgGain = (avgGain * (window - 1) + currentGain) / window;
      avgLoss = (avgLoss * (window - 1) + currentLoss) / window;
    }
    
    // Calculate RS and RSI
    if (avgLoss === 0) return 100; // Avoid division by zero
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    
    return rsi;
  }

  /**
   * Check for Golden Cross (Buy) or Death Cross (Sell)
   */
  private getMovingAverageCross(priceData: any[]): number {
    if (!priceData || priceData.length < 200) return 0;
    
    // Calculate 50-day and 200-day moving averages
    const ma50 = this.calculateMovingAverage(priceData, 50);
    const ma200 = this.calculateMovingAverage(priceData, 200);
    
    // Check for recent crosses (last 5 days)
    for (let i = 0; i < Math.min(5, ma50.length - 1); i++) {
      const idx = ma50.length - 1 - i;
      const prevIdx = idx - 1;
      
      // Golden Cross: 50-day crosses above 200-day
      if (ma50[prevIdx] <= ma200[prevIdx] && ma50[idx] > ma200[idx]) {
        return 1;
      }
      
      // Death Cross: 50-day crosses below 200-day
      if (ma50[prevIdx] >= ma200[prevIdx] && ma50[idx] < ma200[idx]) {
        return -1;
      }
    }
    
    // Current relationship
    const lastIdx = ma50.length - 1;
    if (ma50[lastIdx] > ma200[lastIdx]) {
      return 0.5;  // Above but no recent cross
    } else if (ma50[lastIdx] < ma200[lastIdx]) {
      return -0.5;  // Below but no recent cross
    }
    
    return 0;
  }

  /**
   * Calculate moving average for a given period
   */
  private calculateMovingAverage(data: any[], window: number): number[] {
    const result = [];
    
    for (let i = window - 1; i < data.length; i++) {
      let sum = 0;
      for (let j = 0; j < window; j++) {
        sum += data[i - j].price;
      }
      result.push(sum / window);
    }
    
    return result;
  }

  /**
   * Evaluate an indicator against buy/sell thresholds
   */
  private evaluateIndicator(indicatorName: string, value: number | null): [number, string] {
    if (value === null) {
      return [0, "Neutral (No Data)"];
    }
    
    const indicator = this.indicators[indicatorName];
    if (!indicator) return [0, "Neutral (Unknown Indicator)"];
    
    const { weight, buyThreshold, sellThreshold, buyBelow, sellAbove } = indicator;
    
    // Evaluate buy signal
    if (buyBelow && value <= buyThreshold) {
      return [weight, "Buy"];
    } else if (!buyBelow && value >= buyThreshold) {
      return [weight, "Buy"];
    }
    
    // Evaluate sell signal
    if (sellAbove && value >= sellThreshold) {
      return [-weight, "Sell"];
    } else if (!sellAbove && value <= sellThreshold) {
      return [-weight, "Sell"];
    }
    
    return [0, "Neutral"];
  }

  /**
   * Update external market data
   */
  private async updateExternalData(force = false): Promise<void> {
    // Check if we need to update the cache
    if (!force && this.externalDataTimestamp && 
        (new Date().getTime() - this.externalDataTimestamp.getTime()) < 86400000) { // 24 hours
      return;
    }
    
    try {
      // In a real implementation, we would fetch real market data
      // For now, using placeholder values similar to Python version
      this.externalDataCache = {
        'Market_Sentiment': -10,  // Slightly fearful (buy signal)
        'Macroeconomics': 0.5,    // Slightly positive
        'Bond_Yield': 4.3,        // Example value
        'Inflation_Rate': 3.5,    // Example value
        'Unemployment_Rate': 3.8,  // Example value
        'Consumer_Spending': 0.3,  // Slightly positive growth
        'Consumer_Sentiment': 90,  // Neutral to slightly positive
        'Fed_Funds_Rate': 4.5,    // Example value
        'VIX_Rate': 22,           // Example value
        'GDP_Growth_Rate': 2.1    // Example value
      };
      
      this.externalDataTimestamp = new Date();
    } catch (error) {
      console.error("Error updating external data:", error);
      // Use default values if fetch fails
      this.externalDataCache = {
        'Market_Sentiment': 0,
        'Macroeconomics': 0,
        'Bond_Yield': 4.5,
        'Inflation_Rate': 3.5,
        'Unemployment_Rate': 3.8,
        'Consumer_Spending': 0,
        'Consumer_Sentiment': 85,
        'Fed_Funds_Rate': 4.5,
        'VIX_Rate': 25,
        'GDP_Growth_Rate': 2.0
      };
      this.externalDataTimestamp = new Date();
    }
  }

  /**
   * Get news sentiment from the stock data
   */
  private getNewsSentiment(recentNews: any[]): number {
    if (!recentNews || recentNews.length === 0) return 0;
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    recentNews.forEach(news => {
      if (news.sentiment === 'positive') positiveCount++;
      if (news.sentiment === 'negative') negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 1;
    if (negativeCount > positiveCount) return -1;
    return 0;
  }

  /**
   * Analyze a stock to generate recommendation
   */
  public async analyzeStock(stockData: any): Promise<{
    score: number;
    recommendation: StockRecommendation;
    results: AnalysisResults;
    factors: MetricScore[];
  }> {
    // Update external data
    await this.updateExternalData();
    
    // Store all results
    const results: AnalysisResults = {};
    let totalScore = 0;
    const factors: MetricScore[] = [];
    
    // 1. RSI
    let rsiValue = null;
    if (stockData.historicalPrices && stockData.historicalPrices.length > 14) {
      rsiValue = this.calculateRSI(stockData.historicalPrices);
    }
    const [rsiScore, rsiRec] = this.evaluateIndicator('RSI', rsiValue);
    results['RSI'] = { value: rsiValue, score: rsiScore, recommendation: rsiRec };
    totalScore += rsiScore;
    if (rsiValue !== null) {
      factors.push({
        name: 'RSI',
        value: Math.min(100, Math.max(0, 100 - Math.abs(rsiValue - 50))), // Convert to 0-100 scale
        description: `RSI is ${rsiValue?.toFixed(1)}. ${rsiRec === "Buy" ? "Oversold condition" : rsiRec === "Sell" ? "Overbought condition" : "Neutral momentum"}`
      });
    }
    
    // 2. P/E Ratio
    const peValue = stockData.peRatio;
    const [peScore, peRec] = this.evaluateIndicator('PE_Ratio', peValue);
    results['PE_Ratio'] = { value: peValue, score: peScore, recommendation: peRec };
    totalScore += peScore;
    if (peValue !== null) {
      factors.push({
        name: 'P/E',
        value: peValue < 15 ? 80 : peValue < 25 ? 60 : peValue < 40 ? 40 : 20,
        description: `P/E ratio is ${peValue?.toFixed(1)}. ${peValue < 25 ? "Potentially undervalued" : "High valuation"}`
      });
    }
    
    // 3. Moving Average Cross
    let maValue = null;
    if (stockData.historicalPrices && stockData.historicalPrices.length >= 200) {
      maValue = this.getMovingAverageCross(stockData.historicalPrices);
    }
    const [maScore, maRec] = this.evaluateIndicator('Moving_Average_Cross', maValue);
    results['Moving_Average_Cross'] = { value: maValue, score: maScore, recommendation: maRec };
    totalScore += maScore;
    if (maValue !== null) {
      factors.push({
        name: 'MA Cross',
        value: maValue === 1 ? 90 : maValue === 0.5 ? 70 : maValue === 0 ? 50 : maValue === -0.5 ? 30 : 10,
        description: `${maValue === 1 ? "Golden Cross detected" : maValue === -1 ? "Death Cross detected" : maValue > 0 ? "Price above moving averages" : "Price below moving averages"}`
      });
    }
    
    // 4. Analyst Ratings
    if (stockData.analystRatings) {
      const totalRatings = stockData.analystRatings.buy + stockData.analystRatings.hold + stockData.analystRatings.sell;
      if (totalRatings > 0) {
        const buyRatio = stockData.analystRatings.buy / totalRatings;
        const analystValue = buyRatio * 5; // Convert to 1-5 scale
        const [analystScore, analystRec] = this.evaluateIndicator('Analyst_Rating', analystValue);
        results['Analyst_Rating'] = { value: analystValue, score: analystScore, recommendation: analystRec };
        totalScore += analystScore;
        factors.push({
          name: 'Analysts',
          value: buyRatio * 100,
          description: `${Math.round(buyRatio * 100)}% of analyst ratings are Buy`
        });
      }
    }
    
    // 5. News Sentiment
    if (stockData.recentNews) {
      const newsSentiment = this.getNewsSentiment(stockData.recentNews);
      const [newsScore, newsRec] = this.evaluateIndicator('Latest_Company_News', newsSentiment);
      results['Latest_Company_News'] = { value: newsSentiment, score: newsScore, recommendation: newsRec };
      totalScore += newsScore;
      factors.push({
        name: 'News',
        value: newsSentiment === 1 ? 80 : newsSentiment === 0 ? 50 : 20,
        description: `Recent news sentiment is ${newsSentiment === 1 ? "positive" : newsSentiment === -1 ? "negative" : "neutral"}`
      });
    }
    
    // 6. Earnings History
    if (stockData.earningsHistory && stockData.earningsHistory.length > 0) {
      const beatCount = stockData.earningsHistory
        .slice(0, Math.min(4, stockData.earningsHistory.length))
        .filter((e: any) => e.actualEPS > e.estimatedEPS).length;
      
      const [earningsScore, earningsRec] = this.evaluateIndicator('Earnings_Beat_History', beatCount);
      results['Earnings_Beat_History'] = { value: beatCount, score: earningsScore, recommendation: earningsRec };
      totalScore += earningsScore;
      factors.push({
        name: 'Earnings',
        value: beatCount * 25,
        description: `Beat earnings expectations ${beatCount} times in last ${Math.min(4, stockData.earningsHistory.length)} quarters`
      });
    }
    
    // Add external indicators with placeholder values
    for (const [indicatorName, indicatorValue] of Object.entries(this.externalDataCache)) {
      const [score, rec] = this.evaluateIndicator(indicatorName, indicatorValue);
      results[indicatorName] = { value: indicatorValue, score, recommendation: rec };
      totalScore += score;
    }
    
    // Determine overall recommendation
    let recommendation: StockRecommendation;
    if (totalScore >= 3) {
      recommendation = "Strong Buy";
    } else if (totalScore >= 1) {
      recommendation = "Buy";
    } else if (totalScore <= -3) {
      recommendation = "Strong Sell";
    } else if (totalScore <= -1) {
      recommendation = "Sell";
    } else {
      recommendation = "Hold";
    }
    
    return { score: totalScore, recommendation, results, factors };
  }
}

// Create singleton instance
const stockRecommendationEngine = new StockRecommendationEngine();
export default stockRecommendationEngine;
