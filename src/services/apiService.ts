
import { StockData } from "@/types/stock";
import { fetchStockData } from "./stock/stockDataService";
import { stocksDatabase } from './database/mockStockDatabase';
export { getRecommendationColor, getRecommendationTextColor, getChangeColor } from './utils/stockUtils';
export { searchStocks } from './search/searchService';
export { fetchStockData } from './stock/stockDataService';

export const getStockData = async (ticker: string): Promise<StockData | null> => {
  try {
    const data = await fetchStockData(ticker);
    
    if (data) {
      return data;
    }
    
    ticker = ticker.toUpperCase();
    return stocksDatabase[ticker] || null;
  } catch (error) {
    console.error("Error in getStockData:", error);
    return stocksDatabase[ticker.toUpperCase()] || null;
  }
};
