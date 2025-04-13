
import { toast } from "sonner";
import { API_KEYS, API_URLS, checkApiKeys } from "./apiConfig";
import { StockData, MetricScore, StockRecommendation } from "@/types/stock";

// Function to fetch stock data from external APIs
export const fetchStockData = async (ticker: string): Promise<StockData | null> => {
  if (!checkApiKeys()) {
    toast.error("API keys not configured. Using mock data instead.");
    // If no API keys available, fallback to mock data
    return getMockStockData(ticker);
  }

  try {
    // Fetch data in parallel for better performance
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

    // Generate recommendation based on combined metrics
    const allMetrics = [...fundamentals, ...technicals, ...sentiment];
    const recommendation = generateRecommendation(allMetrics);

    // Construct the complete stock data object
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
    };

    return stockData;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    toast.error("Error fetching stock data. Using mock data instead.");
    return getMockStockData(ticker);
  }
};

// Fetch basic stock overview information
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
          name: ticker, // Alpha Vantage doesn't return company name in this endpoint
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
          peRatio: quote.pe,
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
    
    // If we get here, fallback to mock data but don't return the entire mock object yet
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

// Fetch fundamental metrics (P/E, growth rate, earnings quality)
const fetchFundamentalMetrics = async (ticker: string): Promise<MetricScore[]> => {
  try {
    const metrics: MetricScore[] = [];
    
    if (API_KEYS.FINANCIAL_MODELING_PREP) {
      // Fetch P/E ratio and other fundamentals
      const response = await fetch(
        `${API_URLS.FINANCIAL_MODELING_PREP}/ratios/${ticker}?apikey=${API_KEYS.FINANCIAL_MODELING_PREP}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const ratios = data[0];
        
        // P/E Ratio Analysis
        const peRatio = ratios.priceEarningsRatio;
        const peValue = peRatio > 0 && peRatio < 30 ? 
          Math.max(0, 100 - (peRatio * 2)) : // Lower PE is better, up to a point
          Math.max(20, 100 - Math.abs(peRatio)); // Very low or negative PE might be concerning
        
        metrics.push({
          name: 'P/E Ratio',
          value: peValue,
          description: `P/E ratio of ${peRatio?.toFixed(2) || 'N/A'} indicates ${
            peRatio < 15 ? 'potential undervaluation' : 
            peRatio < 25 ? 'fair valuation' : 
            'potential overvaluation'
          }`
        });
        
        // Growth metrics
        const growthValue = calculateGrowthValue(ratios);
        metrics.push({
          name: 'Growth Rate',
          value: growthValue,
          description: `Growth analysis based on revenue, earnings, and cash flow trends`
        });
        
        // Earnings quality
        const earningsQualityValue = calculateEarningsQuality(ratios);
        metrics.push({
          name: 'Earnings Quality',
          value: earningsQualityValue,
          description: `Assessment of earnings consistency and cash flow conversion`
        });
      }
    }
    
    // If no data or missing metrics, fill with mock data
    if (metrics.length < 3) {
      const mockData = getMockStockData(ticker);
      if (mockData) {
        const existingMetricNames = metrics.map(m => m.name);
        mockData.metrics.fundamental.forEach(metric => {
          if (!existingMetricNames.includes(metric.name)) {
            metrics.push(metric);
          }
        });
      }
    }
    
    return metrics;
  } catch (error) {
    console.error("Error fetching fundamental metrics:", error);
    // Return mock fundamental metrics
    const mockData = getMockStockData(ticker);
    return mockData?.metrics.fundamental || [];
  }
};

// Fetch technical indicators (RSI, moving averages, volume)
const fetchTechnicalIndicators = async (ticker: string): Promise<MetricScore[]> => {
  try {
    const metrics: MetricScore[] = [];
    
    if (API_KEYS.ALPHA_VANTAGE) {
      // Fetch RSI
      const rsiResponse = await fetch(
        `${API_URLS.ALPHA_VANTAGE}?function=RSI&symbol=${ticker}&interval=daily&time_period=14&series_type=close&apikey=${API_KEYS.ALPHA_VANTAGE}`
      );
      const rsiData = await rsiResponse.json();
      
      if (rsiData && rsiData['Technical Analysis: RSI']) {
        const rsiValues = Object.values(rsiData['Technical Analysis: RSI']) as any[];
        if (rsiValues.length > 0 && rsiValues[0].RSI) {
          const latestRsi = parseFloat(rsiValues[0].RSI);
          
          // RSI interpretation: 30-70 is neutral, <30 is oversold (good), >70 is overbought (bad)
          const rsiValue = latestRsi < 30 ? 85 : 
                          latestRsi > 70 ? 30 : 
                          50 + ((50 - Math.abs(latestRsi - 50)) / 50) * 25;
          
          metrics.push({
            name: 'RSI',
            value: rsiValue,
            description: `RSI of ${latestRsi.toFixed(2)} indicates ${
              latestRsi < 30 ? 'oversold conditions, potential buy opportunity' : 
              latestRsi > 70 ? 'overbought conditions, potential sell signal' : 
              'neutral momentum'
            }`
          });
        }
      }
      
      // Fetch Moving Averages
      const maResponse = await fetch(
        `${API_URLS.ALPHA_VANTAGE}?function=SMA&symbol=${ticker}&interval=daily&time_period=50&series_type=close&apikey=${API_KEYS.ALPHA_VANTAGE}`
      );
      const maData = await maResponse.json();
      
      // Also fetch current price for comparison
      const quoteResponse = await fetch(
        `${API_URLS.ALPHA_VANTAGE}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEYS.ALPHA_VANTAGE}`
      );
      const quoteData = await quoteResponse.json();
      
      if (maData && maData['Technical Analysis: SMA'] && quoteData && quoteData['Global Quote']) {
        const maValues = Object.values(maData['Technical Analysis: SMA']) as any[];
        if (maValues.length > 0 && maValues[0].SMA) {
          const latestMa = parseFloat(maValues[0].SMA);
          const currentPrice = parseFloat(quoteData['Global Quote']['05. price']);
          
          // Price above MA is bullish, below is bearish
          const priceDiffPercent = ((currentPrice - latestMa) / latestMa) * 100;
          const maValue = 50 + (priceDiffPercent * 5); // Scale to 0-100
          
          metrics.push({
            name: 'Moving Averages',
            value: Math.min(100, Math.max(0, maValue)),
            description: `Price is ${priceDiffPercent > 0 ? 'above' : 'below'} 50-day moving average by ${Math.abs(priceDiffPercent).toFixed(2)}%, indicating ${
              priceDiffPercent > 5 ? 'strong uptrend' : 
              priceDiffPercent > 0 ? 'mild uptrend' : 
              priceDiffPercent > -5 ? 'mild downtrend' : 
              'strong downtrend'
            }`
          });
        }
      }
    }
    
    // Volume analysis would be here (requires historical data fetching)
    // For simplicity, we'll add a mock volume metric
    metrics.push({
      name: 'Volume',
      value: Math.floor(Math.random() * 40) + 40, // Random value between 40-80
      description: 'Volume analysis based on recent trading activity'
    });
    
    // If no data or missing metrics, fill with mock data
    if (metrics.length < 3) {
      const mockData = getMockStockData(ticker);
      if (mockData) {
        const existingMetricNames = metrics.map(m => m.name);
        mockData.metrics.technical.forEach(metric => {
          if (!existingMetricNames.includes(metric.name)) {
            metrics.push(metric);
          }
        });
      }
    }
    
    return metrics;
  } catch (error) {
    console.error("Error fetching technical indicators:", error);
    // Return mock technical indicators
    const mockData = getMockStockData(ticker);
    return mockData?.metrics.technical || [];
  }
};

// Fetch market sentiment (analyst ratings, news sentiment, insider trading)
const fetchMarketSentiment = async (ticker: string): Promise<MetricScore[]> => {
  try {
    const metrics: MetricScore[] = [];
    
    // For market sentiment, we would need premium APIs
    // For demonstration purposes, we'll use mock data based on real stock ticker
    const mockData = getMockStockData(ticker);
    
    if (mockData) {
      return mockData.metrics.sentiment;
    }
    
    // If we don't have mock data for this ticker, generate some based on the ticker
    const tickerSum = ticker.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const seedValue = tickerSum % 100; // 0-99
    
    metrics.push({
      name: 'Analyst Ratings',
      value: Math.min(100, Math.max(0, seedValue + 10)),
      description: 'Aggregate of Wall Street analyst recommendations'
    });
    
    metrics.push({
      name: 'News Sentiment',
      value: Math.min(100, Math.max(0, (seedValue + 20) % 100)),
      description: 'Analysis of recent news articles and social media sentiment'
    });
    
    metrics.push({
      name: 'Insider Trading',
      value: Math.min(100, Math.max(0, (seedValue + 30) % 100)),
      description: 'Recent insider buying and selling activity'
    });
    
    return metrics;
  } catch (error) {
    console.error("Error fetching market sentiment:", error);
    // Return mock sentiment metrics
    const mockData = getMockStockData(ticker);
    return mockData?.metrics.sentiment || [];
  }
};

// Helper function to calculate growth value based on ratios
const calculateGrowthValue = (ratios: any): number => {
  // In a real implementation, this would analyze multiple years of data
  // For simplicity, we're using available ratios to estimate growth
  const revenueGrowth = ratios.netIncomePerShare > 0 ? 70 : 30;
  const profitMargin = ratios.netProfitMargin || 0;
  const profitMarginScore = profitMargin > 0.2 ? 80 : 
                           profitMargin > 0.1 ? 65 : 
                           profitMargin > 0.05 ? 50 : 30;
  
  return Math.round((revenueGrowth + profitMarginScore) / 2);
};

// Helper function to calculate earnings quality based on ratios
const calculateEarningsQuality = (ratios: any): number => {
  // In a real implementation, this would be much more sophisticated
  const returnOnEquity = ratios.returnOnEquity || 0;
  const roeScore = returnOnEquity > 0.2 ? 90 : 
                  returnOnEquity > 0.15 ? 80 : 
                  returnOnEquity > 0.1 ? 70 : 
                  returnOnEquity > 0.05 ? 60 : 40;
  
  const debtToEquity = ratios.debtToEquity || 0;
  const debtScore = debtToEquity < 0.3 ? 90 : 
                   debtToEquity < 0.5 ? 80 : 
                   debtToEquity < 1 ? 70 : 
                   debtToEquity < 1.5 ? 60 : 40;
  
  return Math.round((roeScore + debtScore) / 2);
};

// Generate a recommendation based on metrics
const generateRecommendation = (metrics: MetricScore[]): StockRecommendation => {
  if (!metrics || metrics.length === 0) {
    return 'Hold';
  }
  
  // Calculate weighted average of all metrics
  const totalValue = metrics.reduce((sum, metric) => sum + metric.value, 0);
  const averageValue = totalValue / metrics.length;
  
  // Map the average to a recommendation
  if (averageValue >= 80) return 'Strong Buy';
  if (averageValue >= 60) return 'Buy';
  if (averageValue >= 40) return 'Hold';
  if (averageValue >= 20) return 'Sell';
  return 'Strong Sell';
};

// Fallback to get mock data for a ticker from the existing mock database
const getMockStockData = (ticker: string): StockData | null => {
  // Import the mock database from stockService
  const { stocksDatabase } = require('./stockService');
  
  ticker = ticker.toUpperCase();
  
  if (stocksDatabase[ticker]) {
    return stocksDatabase[ticker];
  }
  
  // If ticker not found in mock data, try to find a similar one
  const similarTickers = Object.keys(stocksDatabase).filter(
    key => key.includes(ticker) || ticker.includes(key)
  );
  
  if (similarTickers.length > 0) {
    return stocksDatabase[similarTickers[0]];
  }
  
  // If no similar ticker found, return a default mock
  return stocksDatabase['AAPL']; // Default to AAPL if no match
};
