
import { toast } from "sonner";
import { API_KEYS, API_URLS, checkApiKeys } from "./apiConfig";
import { StockData } from "@/types/stock";
import { fetchFundamentalMetrics, fetchTechnicalIndicators, fetchMarketSentiment } from "./metrics/metricsService";
import { generateRecommendation } from "./recommendations/recommendationService";
import { getMockStockData } from "./mockDataService";
import stockRecommendationEngine from "./recommendationEngine/StockRecommendationEngine";

const fetchStockOverview = async (ticker: string): Promise<any | null> => {
  try {
    if (API_KEYS.POLYGON) {
      const response = await fetch(
        `${API_URLS.POLYGON}/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${API_KEYS.POLYGON}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const quote = data.results[0];
        const previousClose = quote.c;
        const currentPrice = quote.c;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;
        
        // Get company details
        const companyResponse = await fetch(
          `${API_URLS.POLYGON}/reference/tickers/${ticker}?apiKey=${API_KEYS.POLYGON}`
        );
        const companyData = await companyResponse.json();
        
        // Get industry
        let industry = null;
        let description = null;
        let mainProducts = null;
        if (companyData.results) {
          industry = companyData.results.sic_description || companyData.results.standard_industrial_classification?.industry_title;
          description = companyData.results.description;
          // Main products would need additional data sources
        }
        
        return {
          name: companyData.results?.name || ticker,
          price: currentPrice,
          change: change,
          changePercent: changePercent,
          peRatio: null, // Will be populated by metrics service
          rsi: null,
          fiftyDayMA: null,
          twoHundredDayMA: null,
          analystRatings: null,
          growthRate: null,
          recentEarnings: null,
          ceoRating: null,
          marketSentiment: null,
          recentNews: null,
          description,
          industry,
          mainProducts
        };
      }
    }
    
    const mockData = getMockStockData(ticker);
    return {
      name: mockData?.name || ticker,
      price: mockData?.price || 100,
      change: mockData?.change || 0,
      changePercent: mockData?.changePercent || 0,
      peRatio: mockData?.peRatio,
      rsi: mockData?.rsi,
      fiftyDayMA: mockData?.fiftyDayMA,
      twoHundredDayMA: mockData?.twoHundredDayMA,
      analystRatings: mockData?.analystRatings,
      growthRate: mockData?.growthRate,
      recentEarnings: mockData?.recentEarnings,
      ceoRating: mockData?.ceoRating,
      marketSentiment: mockData?.marketSentiment,
      recentNews: mockData?.recentNews || [
        {
          headline: `Latest ${ticker} Market Update`,
          sentiment: 'neutral',
          date: new Date().toISOString().split('T')[0]
        },
        {
          headline: `${ticker} Announces New Product Line`,
          sentiment: 'positive',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0]
        }
      ],
      description: mockData?.description,
      industry: mockData?.industry,
      mainProducts: mockData?.mainProducts
    };
  } catch (error) {
    console.error("Error fetching stock overview:", error);
    return null;
  }
};

// Fetch recent news for a stock
const fetchStockNews = async (ticker: string): Promise<any[] | null> => {
  try {
    if (API_KEYS.POLYGON) {
      const response = await fetch(
        `${API_URLS.POLYGON}/reference/news?ticker=${ticker}&order=desc&limit=10&sort=published_utc&apiKey=${API_KEYS.POLYGON}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results.map((article: any) => {
          // Simple sentiment analysis based on title keywords
          const title = article.title.toLowerCase();
          let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
          
          const positiveWords = ["up", "rise", "gain", "positive", "buy", "bullish", 
            "growth", "success", "innovation", "profit", "beat", "exceed", "strong"];
          
          const negativeWords = ["down", "fall", "drop", "negative", "sell", "bearish", 
            "loss", "fail", "bankruptcy", "weak", "miss", "below", "poor"];
          
          const hasPositiveWords = positiveWords.some(word => title.includes(word));
          const hasNegativeWords = negativeWords.some(word => title.includes(word));
          
          if (hasPositiveWords && !hasNegativeWords) sentiment = 'positive';
          if (hasNegativeWords && !hasPositiveWords) sentiment = 'negative';
          
          return {
            headline: article.title,
            sentiment: sentiment,
            date: new Date(article.published_utc).toISOString().split('T')[0],
            url: article.article_url
          };
        });
      }
    }
    
    // Fall back to mock data
    const mockData = getMockStockData(ticker);
    return mockData?.recentNews || [];
  } catch (error) {
    console.error("Error fetching stock news:", error);
    return null;
  }
};

// Fetch historical prices for a stock
const fetchHistoricalPrices = async (ticker: string): Promise<any[] | null> => {
  try {
    if (API_KEYS.POLYGON) {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 365); // Get 1 year of data
      const startDateStr = startDate.toISOString().split('T')[0];
      
      const response = await fetch(
        `${API_URLS.POLYGON}/aggs/ticker/${ticker}/range/1/day/${startDateStr}/${endDate}?adjusted=true&sort=asc&limit=365&apiKey=${API_KEYS.POLYGON}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results.map((bar: any) => {
          const date = new Date(bar.t);
          return {
            date: date.toISOString().split('T')[0],
            price: bar.c,
            volume: bar.v
          };
        });
      }
    }
    
    // Fall back to mock data
    const mockData = getMockStockData(ticker);
    return mockData?.historicalPrices || [];
  } catch (error) {
    console.error("Error fetching historical prices:", error);
    return null;
  }
};

export const fetchStockData = async (ticker: string): Promise<StockData | null> => {
  if (!checkApiKeys()) {
    toast.error("API keys not configured. Using mock data instead.");
    return getMockStockData(ticker);
  }

  try {
    const [overview, fundamentals, technicals, sentiment, news, historicalPrices] = await Promise.all([
      fetchStockOverview(ticker),
      fetchFundamentalMetrics(ticker),
      fetchTechnicalIndicators(ticker),
      fetchMarketSentiment(ticker),
      fetchStockNews(ticker),
      fetchHistoricalPrices(ticker)
    ]);

    if (!overview) {
      toast.error(`Could not find data for ${ticker}`);
      return null;
    }

    const allMetrics = [...fundamentals, ...technicals, ...sentiment];
    const recommendation = generateRecommendation(allMetrics);

    const mockData = getMockStockData(ticker);

    // Ensure we have data for all sections
    const stockData: StockData = {
      ticker: ticker.toUpperCase(),
      name: overview.name,
      description: overview.description || mockData?.description,
      industry: overview.industry || mockData?.industry, 
      mainProducts: overview.mainProducts || mockData?.mainProducts,
      price: overview.price,
      change: overview.change,
      changePercent: overview.changePercent,
      recommendation,
      metrics: {
        fundamental: fundamentals,
        technical: technicals,
        sentiment: sentiment,
      },
      peRatio: overview.peRatio,
      rsi: overview.rsi,
      fiftyDayMA: overview.fiftyDayMA,
      twoHundredDayMA: overview.twoHundredDayMA,
      analystRatings: overview.analystRatings,
      growthRate: overview.growthRate,
      recentEarnings: overview.recentEarnings,
      ceoRating: overview.ceoRating,
      marketSentiment: overview.marketSentiment,
      recentNews: news || overview.recentNews || mockData?.recentNews,
      earningsHistory: mockData?.earningsHistory || [],
      historicalPrices: historicalPrices || mockData?.historicalPrices || []
    };

    // Use the recommendation engine to enhance the recommendation
    try {
      const engineAnalysis = await stockRecommendationEngine.analyzeStock(stockData);
      
      // Update the recommendation with the engine's analysis
      stockData.recommendation = engineAnalysis.recommendation;
      
      // Add AI analysis factors to the metrics
      stockData.metrics.aiAnalysisFactors = engineAnalysis.factors;
      
      // Log the analysis results
      console.log("Stock recommendation engine analysis:", engineAnalysis);
    } catch (error) {
      console.error("Error using recommendation engine:", error);
      // fallback to the simpler recommendation
    }

    return stockData;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    toast.error("Error fetching stock data. Using mock data instead.");
    return getMockStockData(ticker);
  }
};
