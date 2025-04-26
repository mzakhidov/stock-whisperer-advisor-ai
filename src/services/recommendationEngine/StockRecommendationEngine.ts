
import { StockData, StockRecommendation, MetricScore } from "@/types/stock";
import { indicators } from './indicatorConfig';
import { apiUtils } from './apiUtils';
import { technicalIndicators } from './technicalIndicators';
import { fundamentalIndicators } from './fundamentalIndicators';
import { sentimentIndicators } from './sentimentIndicators';
import { marketIndicators } from './marketIndicators';
import { macroIndicators } from './macroIndicators';
import { ExternalDataCache, IndicatorResult, AnalysisResults, StockAnalysis } from './types';

export class StockRecommendationEngine {
  private externalDataCache: ExternalDataCache = {};
  private readonly cacheDuration = 30 * 60 * 1000; // 30 minutes

  private async updateExternalData(force = false): Promise<void> {
    const now = new Date();
    if (!force && this.externalDataCache.lastUpdated && 
        (now.getTime() - this.externalDataCache.lastUpdated.getTime()) < this.cacheDuration) {
      return;
    }

    try {
      // Fetch market indicators
      const [vixRate, bondYield, consumerSentiment, consumerSpending, marketSentiment] = await Promise.all([
        marketIndicators.fetchVIXRate(),
        marketIndicators.fetchBondYield(),
        marketIndicators.fetchConsumerSentiment(),
        marketIndicators.fetchConsumerSpending(),
        sentimentIndicators.fetchMarketSentiment()
      ]);

      // Fetch macro indicators
      const [inflationRate, unemploymentRate, gdpGrowth, fedFundsRate, macroScore] = await Promise.all([
        macroIndicators.fetchInflationRate(),
        macroIndicators.fetchUnemploymentRate(),
        macroIndicators.fetchGDPGrowthRate(),
        macroIndicators.fetchFedFundsRate(),
        macroIndicators.fetchMacroScore()
      ]);

      this.externalDataCache = {
        VIX_Rate: vixRate,
        Bond_Yield: bondYield,
        Consumer_Sentiment: consumerSentiment,
        Consumer_Spending: consumerSpending,
        Market_Sentiment: marketSentiment,
        Inflation_Rate: inflationRate,
        Unemployment_Rate: unemploymentRate,
        GDP_Growth_Rate: gdpGrowth,
        Fed_Funds_Rate: fedFundsRate,
        Macroeconomics: macroScore,
        lastUpdated: now
      };
    } catch (error) {
      console.error("Error updating external data:", error);
      this.externalDataCache.lastUpdated = now;
    }
  }

  private evaluateIndicator(indicatorName: string, value: number | null): [number, string] {
    if (value === null) return [0, "Neutral (No Data)"];
    
    const indicator = indicators[indicatorName];
    if (!indicator) return [0, "Neutral (Unknown Indicator)"];
    
    const { weight, buyThreshold, sellThreshold, buyBelow, sellAbove } = indicator;
    
    if ((buyBelow && value <= buyThreshold) || (!buyBelow && value >= buyThreshold)) {
      return [weight, "Buy"];
    }
    
    if ((sellAbove && value >= sellThreshold) || (!sellAbove && value <= sellThreshold)) {
      return [-weight, "Sell"];
    }
    
    return [0, "Neutral"];
  }

  public async analyzeStock(stockData: StockData): Promise<StockAnalysis> {
    await this.updateExternalData();
    
    const results: AnalysisResults = {};
    let totalScore = 0;
    const factors: MetricScore[] = [];

    // Technical indicators
    const [rsi, movingAverageCross, volumeIndicator, priceToMA] = await Promise.all([
      technicalIndicators.fetchRSI(stockData.ticker),
      technicalIndicators.fetchMovingAverages(stockData.ticker),
      technicalIndicators.fetchVolumeIndicator(stockData.ticker),
      technicalIndicators.fetchPriceToMA(stockData.ticker)
    ]);

    // Fundamental indicators
    const [growthRate, priceProjection, peRatio, earningsBeat, companyGuidance, analystRating] = await Promise.all([
      fundamentalIndicators.fetchAnnualGrowthRate(stockData.ticker),
      fundamentalIndicators.fetchAnalystPriceProjections(stockData.ticker, stockData.price),
      fundamentalIndicators.fetchPEProfitability(stockData.ticker),
      fundamentalIndicators.fetchEarningsBeatHistory(stockData.ticker),
      fundamentalIndicators.fetchCompanyGuidance(stockData.ticker),
      fundamentalIndicators.fetchAnalystRating(stockData.ticker)
    ]);

    // Sentiment indicators
    const [ceoStrength, newsSentiment, insiderTrading] = await Promise.all([
      sentimentIndicators.fetchCEOStrength(stockData.ticker),
      sentimentIndicators.fetchNewsSentiment(stockData.ticker),
      sentimentIndicators.fetchInsiderTrading(stockData.ticker)
    ]);

    // Combine all indicator values
    const indicatorValues = {
      // Technical indicators
      RSI: rsi,
      Moving_Average_Cross: movingAverageCross,
      Volume: volumeIndicator,
      Price_To_MA: priceToMA,
      
      // Fundamental indicators
      PE_Ratio: peRatio,
      Annual_Growth_Rate: growthRate,
      Analyst_Price_Projection: priceProjection,
      Earnings_Beat_History: earningsBeat,
      Company_Guidance: companyGuidance,
      Analyst_Rating: analystRating,
      
      // Sentiment indicators
      CEO_Strength: ceoStrength,
      Latest_Company_News: newsSentiment,
      Insider_Trading: insiderTrading,
      
      // External market indicators
      Market_Sentiment: this.externalDataCache.Market_Sentiment,
      VIX_Rate: this.externalDataCache.VIX_Rate,
      Bond_Yield: this.externalDataCache.Bond_Yield,
      Consumer_Sentiment: this.externalDataCache.Consumer_Sentiment,
      Consumer_Spending: this.externalDataCache.Consumer_Spending,
      
      // Macroeconomic indicators
      Macroeconomics: this.externalDataCache.Macroeconomics,
      Inflation_Rate: this.externalDataCache.Inflation_Rate,
      Unemployment_Rate: this.externalDataCache.Unemployment_Rate,
      GDP_Growth_Rate: this.externalDataCache.GDP_Growth_Rate,
      Fed_Funds_Rate: this.externalDataCache.Fed_Funds_Rate
    };

    // Remove lastUpdated from evaluation
    const { lastUpdated, ...evaluationValues } = this.externalDataCache;

    // Evaluate all indicators
    for (const [name, value] of Object.entries(indicatorValues)) {
      const [score, recommendation] = this.evaluateIndicator(name, value);
      results[name] = { value, score, recommendation };
      totalScore += score;

      if (value !== null) {
        // Convert numerical values to a 0-100 scale for UI display
        let displayValue: number;
        
        // Handle different indicator types for display
        if (name === 'RSI') {
          displayValue = Math.min(100, Math.max(0, 50 + (value > 50 ? -1 : 1) * Math.abs(value - 50)));
        } else if (['PE_Ratio', 'Volume', 'Price_To_MA', 'Analyst_Rating', 'Insider_Trading'].includes(name)) {
          displayValue = value; // These are already on a 0-100 scale
        } else {
          // Scale other indicators to 0-100 range based on score
          displayValue = Math.min(100, Math.max(0, 50 + score * 25));
        }

        factors.push({
          name: name.replace(/_/g, ' '),
          value: displayValue,
          description: `${name.replace(/_/g, ' ')}: ${typeof value === 'number' ? value.toFixed(2) : 'N/A'}. ${recommendation}`
        });
      }
    }

    // Sort factors by absolute score impact
    factors.sort((a, b) => Math.abs(b.value - 50) - Math.abs(a.value - 50));

    // Determine final recommendation
    let recommendation: StockRecommendation;
    if (totalScore >= 3) recommendation = "Strong Buy";
    else if (totalScore >= 1) recommendation = "Buy";
    else if (totalScore <= -3) recommendation = "Strong Sell";
    else if (totalScore <= -1) recommendation = "Sell";
    else recommendation = "Hold";

    return { score: totalScore, recommendation, results, factors };
  }
}

const stockRecommendationEngine = new StockRecommendationEngine();
export default stockRecommendationEngine;
