
import { StockData } from '@/types/stock';
import { stocksDatabase } from '../database/mockStockDatabase';

export const searchStocks = async (query: string): Promise<StockData[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!query) return [];
  
  query = query.toUpperCase();
  
  // For search results, we'll still use the mock database for simplicity
  return Object.values(stocksDatabase).filter(
    stock => stock.ticker.includes(query) || stock.name.toUpperCase().includes(query)
  ).slice(0, 5); // Limit to 5 results
};
