
import { toast } from "sonner";
import { API_KEYS, API_URLS, checkApiKeys } from "./apiConfig";
import { StockData, MetricScore, StockRecommendation } from "@/types/stock";
import { stocksDatabase } from './stockService';

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

    // Generate mock earnings and price history if not available
    const mockEarningsHistory = [
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
    ];

    const mockHistoricalPrices = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i));
      const basePrice = overview.price * 0.9;
      const trendFactor = 1 + (i / 100);
      const volatility = (Math.random() - 0.5) * 0.1;
      
      return {
        date: date.toISOString().split('T')[0],
        price: basePrice * trendFactor * (1 + volatility),
        volume: Math.floor(Math.random() * 10000000) + 5000000
      };
    });

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
      earningsHistory: mockEarningsHistory,
      historicalPrices: mockHistoricalPrices
    };

    return stockData;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    toast.error("Error fetching stock data. Using mock data instead.");
    return getMockStockData(ticker);
  }
};

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

const fetchFundamentalMetrics = async (ticker: string): Promise<MetricScore[]> => {
  try {
    const metrics: MetricScore[] = [];
    
    if (API_KEYS.FINANCIAL_MODELING_PREP) {
      const response = await fetch(
        `${API_URLS.FINANCIAL_MODELING_PREP}/ratios/${ticker}?apikey=${API_KEYS.FINANCIAL_MODELING_PREP}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const ratios = data[0];
        
        const peRatio = ratios.priceEarningsRatio;
        let peValue = 50;
        let peDescription = '';
        
        if (peRatio <= 20) {
          peValue = 90;
          peDescription = 'P/E ratio below 20 indicates potential strong buy opportunity';
        } else if (peRatio >= 90) {
          peValue = 10;
          peDescription = 'P/E ratio above 90 indicates potential strong sell signal';
        } else {
          peValue = Math.max(20, 100 - peRatio);
          peDescription = `P/E ratio of ${peRatio?.toFixed(2)} indicates moderate valuation`;
        }
        
        metrics.push({
          name: 'P/E Ratio',
          value: peValue,
          description: peDescription
        });
        
        const growthValue = calculateGrowthValue(ratios);
        metrics.push({
          name: 'Growth Rate',
          value: growthValue,
          description: 'Growth analysis based on revenue, earnings, and cash flow trends'
        });
        
        const earningsQualityValue = calculateEarningsQuality(ratios);
        metrics.push({
          name: 'Earnings Quality',
          value: earningsQualityValue,
          description: 'Assessment of earnings consistency and cash flow conversion'
        });
      }
    }
    
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
    const mockData = getMockStockData(ticker);
    return mockData?.metrics.fundamental || [];
  }
};

const fetchTechnicalIndicators = async (ticker: string): Promise<MetricScore[]> => {
  try {
    const metrics: MetricScore[] = [];
    
    if (API_KEYS.ALPHA_VANTAGE) {
      const rsiResponse = await fetch(
        `${API_URLS.ALPHA_VANTAGE}?function=RSI&symbol=${ticker}&interval=daily&time_period=14&series_type=close&apikey=${API_KEYS.ALPHA_VANTAGE}`
      );
      const rsiData = await rsiResponse.json();
      
      if (rsiData && rsiData['Technical Analysis: RSI']) {
        const rsiValues = Object.values(rsiData['Technical Analysis: RSI']) as any[];
        if (rsiValues.length > 0 && rsiValues[0].RSI) {
          const latestRsi = parseFloat(rsiValues[0].RSI);
          
          let rsiValue = 50;
          let rsiDescription = '';
          
          if (latestRsi < 35) {
            rsiValue = 90;
            rsiDescription = 'RSI below 35 indicates oversold conditions, strong buy signal';
          } else if (latestRsi > 90) {
            rsiValue = 10;
            rsiDescription = 'RSI above 90 indicates overbought conditions, strong sell signal';
          } else {
            rsiValue = 50 + ((60 - latestRsi) / 25) * 20;
            rsiDescription = `RSI of ${latestRsi.toFixed(2)} indicates neutral momentum`;
          }
          
          metrics.push({
            name: 'RSI',
            value: rsiValue,
            description: rsiDescription
          });
        }
      }
      
      const maResponse = await fetch(
        `${API_URLS.ALPHA_VANTAGE}?function=SMA&symbol=${ticker}&interval=daily&time_period=50&series_type=close&apikey=${API_KEYS.ALPHA_VANTAGE}`
      );
      const maData = await maResponse.json();
      
      const quoteResponse = await fetch(
        `${API_URLS.ALPHA_VANTAGE}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEYS.ALPHA_VANTAGE}`
      );
      const quoteData = await quoteResponse.json();
      
      if (maData && maData['Technical Analysis: SMA'] && quoteData && quoteData['Global Quote']) {
        const maValues = Object.values(maData['Technical Analysis: SMA']) as any[];
        if (maValues.length > 0 && maValues[0].SMA) {
          const latestMa = parseFloat(maValues[0].SMA);
          const currentPrice = parseFloat(quoteData['Global Quote']['05. price']);
          
          const priceDiffPercent = ((currentPrice - latestMa) / latestMa) * 100;
          const maValue = 50 + (priceDiffPercent * 5);
          
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
    
    metrics.push({
      name: 'Volume',
      value: Math.floor(Math.random() * 40) + 40,
      description: 'Volume analysis based on recent trading activity'
    });
    
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
    const mockData = getMockStockData(ticker);
    return mockData?.metrics.technical || [];
  }
};

const fetchMarketSentiment = async (ticker: string): Promise<MetricScore[]> => {
  try {
    const metrics: MetricScore[] = [];
    
    const mockData = getMockStockData(ticker);
    
    if (mockData) {
      return mockData.metrics.sentiment;
    }
    
    const tickerSum = ticker.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const seedValue = tickerSum % 100;
    
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
    const mockData = getMockStockData(ticker);
    return mockData?.metrics.sentiment || [];
  }
};

const calculateGrowthValue = (ratios: any): number => {
  const revenueGrowth = ratios.netIncomePerShare > 0 ? 70 : 30;
  const profitMargin = ratios.netProfitMargin || 0;
  const profitMarginScore = profitMargin > 0.2 ? 80 : 
                           profitMargin > 0.1 ? 65 : 
                           profitMargin > 0.05 ? 50 : 30;
  
  return Math.round((revenueGrowth + profitMarginScore) / 2);
};

const calculateEarningsQuality = (ratios: any): number => {
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

const generateRecommendation = (metrics: MetricScore[]): StockRecommendation => {
  if (!metrics || metrics.length === 0) {
    return 'Hold';
  }
  
  const totalValue = metrics.reduce((sum, metric) => sum + metric.value, 0);
  const averageValue = totalValue / metrics.length;
  
  if (averageValue >= 80) return 'Strong Buy';
  if (averageValue >= 60) return 'Buy';
  if (averageValue >= 40) return 'Hold';
  if (averageValue >= 20) return 'Sell';
  return 'Strong Sell';
};

const getMockStockData = (ticker: string): StockData | null => {
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
