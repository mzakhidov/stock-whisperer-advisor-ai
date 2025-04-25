
import { StockRecommendation, MetricScore } from "@/types/stock";
import { API_KEYS, API_URLS } from '../apiConfig';
import { toast } from "sonner";
import { formatDate, getDateXDaysAgo } from '../utils/dateUtils';

interface ExternalDataCache {
  [key: string]: any;
  lastUpdated?: Date;
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
  private apiCallsThisMinute: number;
  private apiCallsResetTime: Date;
  private apiRateLimit: number;

  constructor() {
    this.externalDataCache = {};
    this.externalDataTimestamp = null;
    this.apiCallsThisMinute = 0;
    this.apiCallsResetTime = new Date();
    this.apiRateLimit = 5; // Conservative limit to avoid hitting Polygon's rate limits
    
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
   * Rate limit API calls to stay within Polygon limits
   */
  private async checkRateLimit(): Promise<boolean> {
    const now = new Date();
    
    // Reset counter if a minute has passed
    if (now.getTime() - this.apiCallsResetTime.getTime() > 60000) {
      this.apiCallsThisMinute = 0;
      this.apiCallsResetTime = now;
    }
    
    // Check if we've hit the rate limit
    if (this.apiCallsThisMinute >= this.apiRateLimit) {
      const waitTime = 60000 - (now.getTime() - this.apiCallsResetTime.getTime());
      console.log(`Rate limit hit. Waiting ${waitTime}ms before next call`);
      
      // Wait until reset
      await new Promise(resolve => setTimeout(resolve, waitTime + 100));
      
      // Reset counter
      this.apiCallsThisMinute = 0;
      this.apiCallsResetTime = new Date();
    }
    
    this.apiCallsThisMinute++;
    return true;
  }

  /**
   * Make a rate-limited API call to Polygon
   */
  private async fetchPolygonAPI(endpoint: string, params: {[key: string]: string} = {}): Promise<any> {
    if (!API_KEYS.POLYGON) {
      throw new Error("Polygon API key not configured");
    }
    
    // Add API key to params
    params = { ...params, apiKey: API_KEYS.POLYGON };
    
    // Build query string
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    const url = `${API_URLS.POLYGON}${endpoint}${endpoint.includes('?') ? '&' : '?'}${queryString}`;
    
    // Check rate limit before making call
    await this.checkRateLimit();
    
    // Make API call
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
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
   * Fetch RSI directly from Polygon API
   */
  private async fetchRSI(ticker: string): Promise<number | null> {
    try {
      const endDate = formatDate(new Date());
      const startDate = formatDate(getDateXDaysAgo(30));
      
      const data = await this.fetchPolygonAPI(`/indicators/rsi/${ticker}`, {
        timespan: "day",
        adjusted: "true",
        window: "14",
        series_type: "close",
        order: "desc",
        limit: "1",
        start_date: startDate,
        end_date: endDate
      });
      
      if (data.results && data.results.values && data.results.values.length > 0) {
        return data.results.values[0].value;
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching RSI from API:", error);
      return null;
    }
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
   * Fetch moving averages directly from Polygon API
   */
  private async fetchMovingAverages(ticker: string): Promise<number> {
    try {
      const endDate = formatDate(new Date());
      const startDate = formatDate(getDateXDaysAgo(210)); // Need more than 200 days for 200-day MA
      
      // Fetch 50-day MA
      const ma50Data = await this.fetchPolygonAPI(`/indicators/sma/${ticker}`, {
        timespan: "day",
        adjusted: "true",
        window: "50",
        series_type: "close",
        order: "desc",
        limit: "10",
        start_date: startDate,
        end_date: endDate
      });
      
      // Fetch 200-day MA
      const ma200Data = await this.fetchPolygonAPI(`/indicators/sma/${ticker}`, {
        timespan: "day",
        adjusted: "true",
        window: "200",
        series_type: "close",
        order: "desc",
        limit: "10",
        start_date: startDate,
        end_date: endDate
      });
      
      // Check for crosses
      if (ma50Data.results?.values?.length > 1 && ma200Data.results?.values?.length > 1) {
        const ma50Values = ma50Data.results.values;
        const ma200Values = ma200Data.results.values;
        
        // Check current relationship
        const currentMa50 = ma50Values[0].value;
        const currentMa200 = ma200Values[0].value;
        
        // Get previous values if available
        const prevMa50 = ma50Values.length > 1 ? ma50Values[1].value : null;
        const prevMa200 = ma200Values.length > 1 ? ma200Values[1].value : null;
        
        // Check for crosses
        if (prevMa50 && prevMa200) {
          // Golden Cross: 50-day crosses above 200-day
          if (prevMa50 <= prevMa200 && currentMa50 > currentMa200) {
            return 1;
          }
          
          // Death Cross: 50-day crosses below 200-day
          if (prevMa50 >= prevMa200 && currentMa50 < currentMa200) {
            return -1;
          }
        }
        
        // Current relationship
        if (currentMa50 > currentMa200) {
          return 0.5;  // Above but no recent cross
        } else if (currentMa50 < currentMa200) {
          return -0.5;  // Below but no recent cross
        }
      }
      
      return 0;
    } catch (error) {
      console.error("Error fetching moving averages from API:", error);
      return 0;
    }
  }

  /**
   * Fetch Annual Growth Rate from financial data
   */
  private async fetchAnnualGrowthRate(ticker: string): Promise<number | null> {
    try {
      // Use Polygon reference/financials endpoint
      const data = await this.fetchPolygonAPI(`/reference/financials/${ticker}`, {
        limit: "8",  // Last 2 years (quarterly)
        type: "Q"    // Quarterly
      });
      
      if (!data.results || data.results.length < 4) {
        return null;
      }
      
      // Sort by filing date
      const sortedResults = [...data.results].sort((a: any, b: any) => 
        new Date(b.filing_date).getTime() - new Date(a.filing_date).getTime());
      
      // Get most recent 4 quarters and same 4 quarters from previous year
      const recentFourQuarters = sortedResults.slice(0, 4);
      const previousFourQuarters = sortedResults.slice(4, 8);
      
      // Calculate total revenue for both periods
      const recentRevenue = recentFourQuarters.reduce((sum: number, q: any) => 
        sum + (q.financials?.income_statement?.revenues?.value || 0), 0);
      
      const previousRevenue = previousFourQuarters.reduce((sum: number, q: any) => 
        sum + (q.financials?.income_statement?.revenues?.value || 0), 0);
      
      // Calculate growth rate
      if (previousRevenue > 0) {
        return ((recentRevenue - previousRevenue) / previousRevenue) * 100;
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching annual growth rate:", error);
      return null;
    }
  }

  /**
   * Fetch Analyst Price Projections
   */
  private async fetchAnalystPriceProjections(ticker: string, currentPrice: number): Promise<number | null> {
    try {
      // Use Polygon snapshot endpoint for price targets
      const data = await this.fetchPolygonAPI(`/snapshot/locale/us/markets/stocks/tickers/${ticker}`);
      
      if (!data.ticker || !data.ticker.price_target) {
        return null;
      }
      
      const priceTarget = data.ticker.price_target;
      
      // Calculate potential upside as percentage
      if (priceTarget && priceTarget.average && currentPrice > 0) {
        return ((priceTarget.average - currentPrice) / currentPrice) * 100;
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching analyst price projections:", error);
      return null;
    }
  }

  /**
   * Fetch CEO Strength metric
   * This is a composite metric based on company info and news sentiment
   */
  private async fetchCEOStrength(ticker: string): Promise<number | null> {
    try {
      // Fetch company information
      const companyInfo = await this.fetchPolygonAPI(`/reference/tickers/${ticker}`);
      
      if (!companyInfo.results) {
        return null;
      }
      
      // Fetch recent news about the company
      const endDate = formatDate(new Date());
      const startDate = formatDate(getDateXDaysAgo(90)); // Last 90 days
      
      const news = await this.fetchPolygonAPI(`/reference/news`, {
        ticker: ticker,
        order: "desc",
        limit: "50",
        sort: "published_utc",
        published_utc.gte: startDate,
        published_utc.lte: endDate
      });
      
      // Calculate CEO sentiment from news
      let ceoNewsCount = 0;
      let positiveMentions = 0;
      
      if (news.results) {
        // Find CEO name from company info
        const ceoName = companyInfo.results.branding?.ceo || "";
        
        if (ceoName) {
          // Look for CEO mentions in news
          news.results.forEach((article: any) => {
            if (article.description && article.description.includes(ceoName)) {
              ceoNewsCount++;
              
              // Simple sentiment analysis - look for positive words
              const positiveWords = ["positive", "growth", "success", "innovation", 
                "leadership", "profit", "beat", "exceed", "strong", "vision"];
              
              const hasPositiveWords = positiveWords.some(word => 
                article.description.toLowerCase().includes(word));
              
              if (hasPositiveWords) {
                positiveMentions++;
              }
            }
          });
        }
      }
      
      // Calculate CEO strength score (scale of 1-5)
      if (ceoNewsCount > 0) {
        const sentimentScore = positiveMentions / ceoNewsCount;
        return 1 + Math.min(4, Math.round(sentimentScore * 4));
      }
      
      // Default score if no CEO news
      return 3;
    } catch (error) {
      console.error("Error fetching CEO strength:", error);
      return null;
    }
  }

  /**
   * Fetch Company Guidance from earnings calls
   */
  private async fetchCompanyGuidance(ticker: string): Promise<number | null> {
    try {
      // Fetch most recent earnings call
      const earnings = await this.fetchPolygonAPI(`/reference/earnings/${ticker}`, {
        limit: "1"
      });
      
      if (!earnings.results || earnings.results.length === 0) {
        return null;
      }
      
      const mostRecent = earnings.results[0];
      
      // Check for guidance
      if (mostRecent.guidance) {
        const actual = mostRecent.eps_actual || 0;
        const estimate = mostRecent.eps_estimate || 0;
        
        // Extract forward guidance sentiment
        if (mostRecent.guidance.includes("raise") || 
            mostRecent.guidance.includes("positive") || 
            mostRecent.guidance.includes("higher")) {
          return 1; // Positive guidance
        } else if (mostRecent.guidance.includes("lower") || 
                  mostRecent.guidance.includes("negative") || 
                  mostRecent.guidance.includes("reduce")) {
          return -1; // Negative guidance
        }
      }
      
      // If no explicit guidance, check earnings vs estimates
      if (mostRecent.eps_actual !== null && mostRecent.eps_estimate !== null) {
        if (mostRecent.eps_actual > mostRecent.eps_estimate * 1.05) {
          return 0.5; // Beat by 5%+
        } else if (mostRecent.eps_actual < mostRecent.eps_estimate * 0.95) {
          return -0.5; // Missed by 5%+
        }
      }
      
      return 0; // Neutral
    } catch (error) {
      console.error("Error fetching company guidance:", error);
      return null;
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
   * Fetch news sentiment directly from Polygon API
   */
  private async fetchNewsSentiment(ticker: string): Promise<number | null> {
    try {
      const endDate = formatDate(new Date());
      const startDate = formatDate(getDateXDaysAgo(7)); // Last week
      
      const news = await this.fetchPolygonAPI(`/reference/news`, {
        ticker: ticker,
        order: "desc",
        limit: "20",
        sort: "published_utc",
        published_utc.gte: startDate,
        published_utc.lte: endDate
      });
      
      if (!news.results || news.results.length === 0) {
        return null;
      }
      
      // Simple sentiment analysis
      let positiveCount = 0;
      let negativeCount = 0;
      
      const positiveWords = ["up", "rise", "gain", "positive", "buy", "bullish", 
        "growth", "success", "innovation", "profit", "beat", "exceed", "strong"];
      
      const negativeWords = ["down", "fall", "drop", "negative", "sell", "bearish", 
        "loss", "fail", "bankruptcy", "weak", "miss", "below", "poor"];
      
      news.results.forEach((article: any) => {
        if (article.title) {
          const title = article.title.toLowerCase();
          
          const hasPositiveWords = positiveWords.some(word => title.includes(word));
          const hasNegativeWords = negativeWords.some(word => title.includes(word));
          
          if (hasPositiveWords) positiveCount++;
          if (hasNegativeWords) negativeCount++;
        }
      });
      
      // Calculate sentiment score
      if (positiveCount + negativeCount > 0) {
        if (positiveCount > negativeCount * 2) return 1;
        if (negativeCount > positiveCount * 2) return -1;
        if (positiveCount > negativeCount) return 0.5;
        if (negativeCount > positiveCount) return -0.5;
      }
      
      return 0; // Neutral
    } catch (error) {
      console.error("Error fetching news sentiment:", error);
      return null;
    }
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
      const externalData: ExternalDataCache = {};
      
      // 1. Market Sentiment (Fear & Greed Index)
      try {
        const vixData = await this.fetchPolygonAPI(`/aggs/ticker/VIX/prev`);
        if (vixData.results && vixData.results[0]) {
          const vixValue = vixData.results[0].c;
          
          // Convert VIX to market sentiment (-100 to 100 scale)
          // VIX: 10 (low fear) => +50 (greed)
          // VIX: 20 (normal) => 0 (neutral)
          // VIX: 40 (high fear) => -50 (fear)
          externalData['Market_Sentiment'] = Math.max(-100, Math.min(100, (25 - vixValue) * 5));
        }
      } catch (error) {
        console.error("Error fetching market sentiment (VIX):", error);
      }
      
      // 2. Macroeconomics (Index performance)
      try {
        // Use a basket of indices to determine economic health
        const indicesData = await this.fetchPolygonAPI(`/snapshot/locale/us/markets/indices/tickers`);
        
        if (indicesData.tickers) {
          const indices = indicesData.tickers.filter((index: any) => 
            ['SPY', 'QQQ', 'DIA', 'IWM'].includes(index.ticker));
          
          let totalChange = 0;
          let count = 0;
          
          indices.forEach((index: any) => {
            if (index.day && index.day.c !== undefined && index.prevDay && index.prevDay.c !== undefined) {
              const change = (index.day.c - index.prevDay.c) / index.prevDay.c;
              totalChange += change;
              count++;
            }
          });
          
          if (count > 0) {
            const avgChange = totalChange / count;
            // Scale to -1 to +1
            externalData['Macroeconomics'] = Math.max(-1, Math.min(1, avgChange * 50));
          }
        }
      } catch (error) {
        console.error("Error fetching macroeconomic indices:", error);
      }
      
      // 3. Bond Yield (10-Year Treasury)
      try {
        const bondData = await this.fetchPolygonAPI(`/aggs/ticker/TNX/prev`);
        if (bondData.results && bondData.results[0]) {
          // TNX is 10x the yield, so divide by 10 to get actual percentage
          externalData['Bond_Yield'] = bondData.results[0].c / 10;
        }
      } catch (error) {
        console.error("Error fetching bond yield:", error);
      }
      
      // 4. Inflation Rate (CPI)
      try {
        // For inflation, we need to look at CPI year over year change
        const today = new Date();
        const yearAgo = new Date();
        yearAgo.setFullYear(today.getFullYear() - 1);
        
        const cpiData = await this.fetchPolygonAPI(`/aggs/ticker/CPIAUCNS/range/1/month/${formatDate(yearAgo)}/${formatDate(today)}`);
        
        if (cpiData.results && cpiData.results.length >= 2) {
          const latestCPI = cpiData.results[cpiData.results.length - 1].c;
          const yearAgoCPI = cpiData.results[0].c;
          
          const inflationRate = ((latestCPI - yearAgoCPI) / yearAgoCPI) * 100;
          externalData['Inflation_Rate'] = inflationRate;
        }
      } catch (error) {
        console.error("Error fetching inflation rate:", error);
      }
      
      // 5. Unemployment Rate
      try {
        const unemploymentData = await this.fetchPolygonAPI(`/aggs/ticker/UNRATE/prev`);
        if (unemploymentData.results && unemploymentData.results[0]) {
          externalData['Unemployment_Rate'] = unemploymentData.results[0].c;
        }
      } catch (error) {
        console.error("Error fetching unemployment rate:", error);
      }
      
      // 6. Consumer Spending
      try {
        // Personal Consumption Expenditures month-over-month change
        const today = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        
        const pceData = await this.fetchPolygonAPI(`/aggs/ticker/PCE/range/1/month/${formatDate(threeMonthsAgo)}/${formatDate(today)}`);
        
        if (pceData.results && pceData.results.length >= 2) {
          const latest = pceData.results[pceData.results.length - 1].c;
          const previous = pceData.results[pceData.results.length - 2].c;
          
          const pceChange = ((latest - previous) / previous) * 100;
          externalData['Consumer_Spending'] = pceChange;
        }
      } catch (error) {
        console.error("Error fetching consumer spending:", error);
      }
      
      // 7. Consumer Sentiment (University of Michigan)
      try {
        const sentimentData = await this.fetchPolygonAPI(`/aggs/ticker/UMCSENT/prev`);
        if (sentimentData.results && sentimentData.results[0]) {
          externalData['Consumer_Sentiment'] = sentimentData.results[0].c;
        }
      } catch (error) {
        console.error("Error fetching consumer sentiment:", error);
      }
      
      // 8. Fed Funds Rate
      try {
        const fedRateData = await this.fetchPolygonAPI(`/aggs/ticker/FEDFUNDS/prev`);
        if (fedRateData.results && fedRateData.results[0]) {
          externalData['Fed_Funds_Rate'] = fedRateData.results[0].c;
        }
      } catch (error) {
        console.error("Error fetching Fed funds rate:", error);
      }
      
      // 9. VIX Rate
      try {
        const vixData = await this.fetchPolygonAPI(`/aggs/ticker/VIX/prev`);
        if (vixData.results && vixData.results[0]) {
          externalData['VIX_Rate'] = vixData.results[0].c;
        }
      } catch (error) {
        console.error("Error fetching VIX rate:", error);
      }
      
      // 10. GDP Growth Rate
      try {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        
        const gdpData = await this.fetchPolygonAPI(`/aggs/ticker/GDP/range/1/quarter/${formatDate(sixMonthsAgo)}/${formatDate(today)}`);
        
        if (gdpData.results && gdpData.results.length >= 2) {
          const latest = gdpData.results[gdpData.results.length - 1].c;
          const previous = gdpData.results[gdpData.results.length - 2].c;
          
          const gdpGrowth = ((latest - previous) / previous) * 100;
          externalData['GDP_Growth_Rate'] = gdpGrowth;
        }
      } catch (error) {
        console.error("Error fetching GDP growth rate:", error);
      }
      
      // Store timestamp and update cache
      externalData.lastUpdated = new Date();
      this.externalDataCache = externalData;
      this.externalDataTimestamp = new Date();
      
      console.log("External economic indicators updated:", externalData);
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
        'GDP_Growth_Rate': 2.0,
        lastUpdated: new Date()
      };
      this.externalDataTimestamp = new Date();
    }
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
    
    // 1. RSI - Fetch from API if possible
    let rsiValue = null;
    try {
      rsiValue = await this.fetchRSI(stockData.ticker);
    } catch (error) {
      console.error("Error fetching RSI from API:", error);
      // Fall back to calculation if API fails
      if (stockData.historicalPrices && stockData.historicalPrices.length > 14) {
        rsiValue = this.calculateRSI(stockData.historicalPrices);
      }
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
    
    // 3. Moving Average Cross - Fetch from API if possible
    let maValue = null;
    try {
      maValue = await this.fetchMovingAverages(stockData.ticker);
    } catch (error) {
      console.error("Error fetching moving averages from API:", error);
      // Fall back to calculation
      if (stockData.historicalPrices && stockData.historicalPrices.length >= 200) {
        maValue = this.getMovingAverageCross(stockData.historicalPrices);
      }
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
    
    // 4. Annual Growth Rate - NEW
    let growthRateValue = null;
    try {
      growthRateValue = await this.fetchAnnualGrowthRate(stockData.ticker);
    } catch (error) {
      console.error("Error fetching annual growth rate:", error);
      growthRateValue = stockData.growthRate; // Fall back to provided value if available
    }
    
    const [growthScore, growthRec] = this.evaluateIndicator('Annual_Growth_Rate', growthRateValue);
    results['Annual_Growth_Rate'] = { value: growthRateValue, score: growthScore, recommendation: growthRec };
    totalScore += growthScore;
    if (growthRateValue !== null) {
      factors.push({
        name: 'Growth',
        value: growthRateValue < 0 ? 30 : growthRateValue < 10 ? 50 : growthRateValue < 20 ? 70 : 90,
        description: `Annual growth rate is ${growthRateValue?.toFixed(1)}%. ${growthRateValue > 15 ? "Strong growth" : growthRateValue > 5 ? "Moderate growth" : "Low/negative growth"}`
      });
    }
    
    // 5. Analyst Ratings
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
    
    // 6. Analyst Price Projections - NEW
    let priceProjectionValue = null;
    try {
      priceProjectionValue = await this.fetchAnalystPriceProjections(stockData.ticker, stockData.price);
    } catch (error) {
      console.error("Error fetching analyst price projections:", error);
    }
    
    const [projectionScore, projectionRec] = this.evaluateIndicator('Analyst_Price_Projection', priceProjectionValue);
    results['Analyst_Price_Projection'] = { value: priceProjectionValue, score: projectionScore, recommendation: projectionRec };
    totalScore += projectionScore;
    if (priceProjectionValue !== null) {
      factors.push({
        name: 'Price Target',
        value: priceProjectionValue < 0 ? 30 : priceProjectionValue < 10 ? 50 : priceProjectionValue < 20 ? 70 : 90,
        description: `Analysts project ${priceProjectionValue > 0 ? "+" : ""}${priceProjectionValue?.toFixed(1)}% potential ${priceProjectionValue > 0 ? "upside" : "downside"}`
      });
    }
    
    // 7. CEO Strength - NEW
    let ceoStrengthValue = null;
    try {
      ceoStrengthValue = await this.fetchCEOStrength(stockData.ticker);
    } catch (error) {
      console.error("Error fetching CEO strength:", error);
      ceoStrengthValue = stockData.ceoRating; // Fall back to provided value
    }
    
    const [ceoScore, ceoRec] = this.evaluateIndicator('CEO_Strength', ceoStrengthValue);
    results['CEO_Strength'] = { value: ceoStrengthValue, score: ceoScore, recommendation: ceoRec };
    totalScore += ceoScore;
    if (ceoStrengthValue !== null) {
      factors.push({
        name: 'Leadership',
        value: (ceoStrengthValue / 5) * 100, // Convert 1-5 to 0-100
        description: `Leadership quality rated ${ceoStrengthValue}/5 based on news sentiment and performance`
      });
    }
    
    // 8. Earnings Beat History
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
    
    // 9. Company Guidance - NEW
    let guidanceValue = null;
    try {
      guidanceValue = await this.fetchCompanyGuidance(stockData.ticker);
    } catch (error) {
      console.error("Error fetching company guidance:", error);
      // Use recent earnings result as a fallback
      guidanceValue = stockData.recentEarnings === 'beat' ? 1 : 
                      stockData.recentEarnings === 'missed' ? -1 : 0;
    }
    
    const [guidanceScore, guidanceRec] = this.evaluateIndicator('Company_Guidance', guidanceValue);
    results['Company_Guidance'] = { value: guidanceValue, score: guidanceScore, recommendation: guidanceRec };
    totalScore += guidanceScore;
    if (guidanceValue !== null) {
      factors.push({
        name: 'Guidance',
        value: guidanceValue === 1 ? 90 : guidanceValue === 0.5 ? 70 : 
               guidanceValue === 0 ? 50 : guidanceValue === -0.5 ? 30 : 10,
        description: `Company provided ${guidanceValue > 0 ? "positive" : guidanceValue < 0 ? "negative" : "neutral"} forward guidance`
      });
    }
    
    // 10. Latest Company News - NEW
    let newsSentimentValue = null;
    try {
      newsSentimentValue = await this.fetchNewsSentiment(stockData.ticker);
    } catch (error) {
      console.error("Error fetching news sentiment:", error);
      // Fall back to provided news data
      if (stockData.recentNews) {
        newsSentimentValue = this.getNewsSentiment(stockData.recentNews);
      }
    }
    
    const [newsScore, newsRec] = this.evaluateIndicator('Latest_Company_News', newsSentimentValue);
    results['Latest_Company_News'] = { value: newsSentimentValue, score: newsScore, recommendation: newsRec };
    totalScore += newsScore;
    if (newsSentimentValue !== null) {
      factors.push({
        name: 'News',
        value: newsSentimentValue === 1 ? 90 : newsSentimentValue === 0.5 ? 70 : 
               newsSentimentValue === 0 ? 50 : newsSentimentValue === -0.5 ? 30 : 10,
        description: `Recent news sentiment is ${newsSentimentValue > 0 ? "positive" : newsSentimentValue < 0 ? "negative" : "neutral"}`
      });
    }
    
    // Add external indicators from updated cache
    for (const [key, value] of Object.entries(this.externalDataCache)) {
      if (key !== 'lastUpdated') {
        const [score, rec] = this.evaluateIndicator(key, value as number);
        results[key] = { value: value as number, score, recommendation: rec };
        totalScore += score;
        
        // Add external factors to the output
        if (key === 'Market_Sentiment') {
          factors.push({
            name: 'Market Sentiment',
            value: ((value as number) + 100) / 2, // Convert -100 to 100 scale to 0-100
            description: `Overall market sentiment is ${(value as number) > 20 ? "bullish" : (value as number) < -20 ? "bearish" : "neutral"}`
          });
        } else if (key === 'VIX_Rate') {
          factors.push({
            name: 'Volatility',
            value: Math.max(0, 100 - (value as number) * 2.5), // Convert VIX to 0-100 (lower VIX = higher score)
            description: `Market volatility index (VIX) is ${(value as number)?.toFixed(1)}`
          });
        }
      }
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
