
import { toast } from "sonner";
import { API_KEYS, API_URLS, checkApiKeys } from "./apiConfig";
import { StockData } from "@/types/stock";
import { fetchFundamentalMetrics, fetchTechnicalIndicators, fetchMarketSentiment } from "./metrics/metricsService";
import { generateRecommendation } from "./recommendations/recommendationService";
import { getMockStockData } from "./mockDataService";

const fetchStockOverview = async (ticker: string): Promise<any | null> => {
  try {
    if (API_KEYS.ALPHA_VANTAGE) {
      const response = await fetch(
        `${API_URLS.ALPHA_VANTAGE}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEYS.ALPHA_VANTAGE}`
      );
      const data = await response.json();
      
      if (data['Global Quote']) {
        const quote = data['Global Quote'];
        return {
          name: ticker,
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          peRatio: null,
          rsi: null,
          fiftyDayMA: null,
          twoHundredDayMA: null,
          analystRatings: null,
          growthRate: null,
          recentEarnings: null,
          ceoRating: null,
          marketSentiment: null,
          recentNews: null,
        };
      }
    } else if (API_KEYS.FINANCIAL_MODELING_PREP) {
      const response = await fetch(
        `${API_URLS.FINANCIAL_MODELING_PREP}/quote/${ticker}?apikey=${API_KEYS.FINANCIAL_MODELING_PREP}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const quote = data[0];
        return {
          name: quote.name,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changesPercentage,
          peRatio: null,
          rsi: null,
          fiftyDayMA: null,
          twoHundredDayMA: quote.priceAvg200,
          analystRatings: null,
          growthRate: null,
          recentEarnings: null,
          ceoRating: null,
          marketSentiment: null,
          recentNews: null,
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
      recentNews: mockData?.recentNews,
    };
  } catch (error) {
    console.error("Error fetching stock overview:", error);
    return null;
  }
};

export const fetchStockData = async (ticker: string): Promise<StockData | null> => {
  if (!checkApiKeys()) {
    toast.error("API keys not configured. Using mock data instead.");
    return getMockStockData(ticker);
  }

  try {
    const [overview, fundamentals, technicals, sentiment] = await Promise.all([
      fetchStockOverview(ticker),
      fetchFundamentalMetrics(ticker),
      fetchTechnicalIndicators(ticker),
      fetchMarketSentiment(ticker)
    ]);

    if (!overview) {
      toast.error(`Could not find data for ${ticker}`);
      return null;
    }

    const allMetrics = [...fundamentals, ...technicals, ...sentiment];
    const recommendation = generateRecommendation(allMetrics);

    const mockData = getMockStockData(ticker);

    const stockData: StockData = {
      ticker: ticker.toUpperCase(),
      name: overview.name,
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
      recentNews: overview.recentNews,
      earningsHistory: mockData?.earningsHistory || [],
      historicalPrices: mockData?.historicalPrices || []
    };

    return stockData;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    toast.error("Error fetching stock data. Using mock data instead.");
    return getMockStockData(ticker);
  }
};
