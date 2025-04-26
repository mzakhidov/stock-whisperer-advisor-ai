
import { StockData } from "@/types/stock";
import { toast } from "sonner";
import { fetchStockData } from "./stock/stockDataService";
import { stocksDatabase } from './database/mockStockDatabase';
export { getRecommendationColor, getRecommendationTextColor, getChangeColor } from './utils/stockUtils';
export { searchStocks } from './search/searchService';

export const getStockData = async (ticker: string): Promise<StockData | null> => {
  try {
    // Try to fetch real data from APIs
    const data = await fetchStockData(ticker);
    
    if (data) {
      return data;
    }
    
    // If API fetch failed, fall back to mock data
    ticker = ticker.toUpperCase();
    
    if (!stocksDatabase[ticker]) {
      toast.error("Stock not found. Please try a different ticker symbol.");
      return null;
    }
    
    return stocksDatabase[ticker];
  } catch (error) {
    console.error("Error in getStockData:", error);
    // Fallback to mock database
    return stocksDatabase[ticker.toUpperCase()] || null;
  }
};
