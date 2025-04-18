
import { StockData } from '@/types/stock';
import { stocksDatabase } from './database/mockStockDatabase';

export const getMockStockData = (ticker: string): StockData | null => {
  ticker = ticker.toUpperCase();
  
  if (stocksDatabase[ticker]) {
    return stocksDatabase[ticker];
  }
  
  const similarTickers = Object.keys(stocksDatabase).filter(
    key => key.includes(ticker) || ticker.includes(key)
  );
  
  if (similarTickers.length > 0) {
    return stocksDatabase[similarTickers[0]];
  }
  
  // Fallback to a default mock data if ticker not found
  const mockData: StockData = {
    ticker: ticker,
    name: ticker + " Corporation",
    price: 100 + Math.random() * 100,
    change: Math.random() * 5 - 2.5,
    changePercent: Math.random() * 5 - 2.5,
    recommendation: 'Hold',
    metrics: {
      fundamental: [
        { name: 'P/E Ratio', value: 60, description: 'Price to earnings analysis' },
        { name: 'Growth Rate', value: 50, description: 'Revenue and earnings trajectory' },
        { name: 'Earnings Quality', value: 50, description: 'Earnings consistency assessment' },
      ],
      technical: [
        { name: 'RSI', value: 50, description: 'Relative strength indicator' },
        { name: 'Moving Averages', value: 50, description: 'Price relative to key moving averages' },
        { name: 'Volume', value: 50, description: 'Trading volume analysis' },
      ],
      sentiment: [
        { name: 'Analyst Ratings', value: 50, description: 'Wall Street analyst consensus' },
        { name: 'News Sentiment', value: 50, description: 'Recent news coverage sentiment' },
        { name: 'Insider Trading', value: 50, description: 'Recent insider activity' },
      ],
    },
    peRatio: 20,
    rsi: 50,
    fiftyDayMA: 95,
    twoHundredDayMA: 90,
    analystRatings: {
      buy: 5,
      hold: 5,
      sell: 5,
    },
    growthRate: 5,
    recentEarnings: 'met',
    ceoRating: 3,
    marketSentiment: 'Neutral',
    recentNews: null,
    earningsHistory: [
      {
        date: "2025-01-30",
        period: "Q1 2025",
        actualEPS: 1.88,
        estimatedEPS: 1.82,
        surprise: 3.29,
        guidance: {
          low: 1.92,
          high: 2.05
        }
      },
      {
        date: "2024-10-28",
        period: "Q4 2024",
        actualEPS: 1.75,
        estimatedEPS: 1.78,
        surprise: -1.69,
        guidance: null
      },
      {
        date: "2024-07-25",
        period: "Q3 2024",
        actualEPS: 1.69,
        estimatedEPS: 1.65,
        surprise: 2.42,
        guidance: {
          low: 1.70,
          high: 1.80
        }
      },
      {
        date: "2024-04-30",
        period: "Q2 2024",
        actualEPS: 1.52,
        estimatedEPS: 1.50,
        surprise: 1.33,
        guidance: {
          low: 1.60,
          high: 1.70
        }
      }
    ],
    historicalPrices: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i));
      return {
        date: date.toISOString().split('T')[0],
        price: 95 + Math.random() * 10,
        volume: Math.floor(Math.random() * 10000000) + 5000000
      };
    })
  };
  
  return mockData;
};
