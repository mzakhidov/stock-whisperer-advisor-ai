
import { StockData } from "@/types/stock";
import { toast } from "sonner";
import { checkApiKeys } from "../apiConfig";
import { fetchFundamentalMetrics, fetchTechnicalIndicators, fetchMarketSentiment } from "../metrics/metricsService";
import { generateRecommendation } from "../recommendations/recommendationService";
import { getMockStockData } from "../mockDataService";
import stockRecommendationEngine from "../recommendationEngine/StockRecommendationEngine";
import { fetchStockOverview } from "./stockOverviewService";
import { fetchStockNews } from "./newsService";
import { fetchHistoricalPrices } from "./historicalDataService";

// Core function to fetch complete stock data
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
      toast.error(`Could not fetch data for ${ticker}`);
      return null;
    }

    const allMetrics = [...fundamentals, ...technicals, ...sentiment];
    const recommendation = generateRecommendation(allMetrics);
    const mockData = getMockStockData(ticker);

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

    try {
      const engineAnalysis = await stockRecommendationEngine.analyzeStock(stockData);
      stockData.recommendation = engineAnalysis.recommendation;
      stockData.metrics.aiAnalysisFactors = engineAnalysis.factors;
      console.log("Stock recommendation engine analysis:", engineAnalysis);
    } catch (error) {
      console.error("Error using recommendation engine:", error);
    }

    return stockData;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    toast.error("Error fetching stock data. Using mock data instead.");
    return getMockStockData(ticker);
  }
};
