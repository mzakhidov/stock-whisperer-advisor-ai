import { StockData, StockRecommendation } from '@/types/stock';

// Mock database of stocks - keep for fallback
export const stocksDatabase: Record<string, StockData> = {
  'AAPL': {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    price: 184.32,
    change: 2.25,
    changePercent: 1.24,
    recommendation: 'Buy',
    metrics: {
      fundamental: [
        { name: 'P/E Ratio', value: 75, description: 'Price to earnings ratio is above industry average but justified by growth' },
        { name: 'Growth Rate', value: 85, description: 'Strong revenue and earnings growth expected to continue' },
        { name: 'Earnings Quality', value: 90, description: 'Consistent earnings beats in recent quarters' },
      ],
      technical: [
        { name: 'RSI', value: 65, description: 'Slightly overbought but still showing strong momentum' },
        { name: 'Moving Averages', value: 80, description: 'Price above key moving averages showing bullish trend' },
        { name: 'Volume', value: 70, description: 'Above average volume on up days' },
      ],
      sentiment: [
        { name: 'Analyst Ratings', value: 85, description: '80% of analysts have a Buy rating' },
        { name: 'News Sentiment', value: 65, description: 'Mostly positive news with some concerns about supply chain' },
        { name: 'Insider Trading', value: 60, description: 'More buying than selling from insiders' },
      ],
    },
    peRatio: 28.5,
    rsi: 65,
    fiftyDayMA: 178.42,
    twoHundredDayMA: 170.15,
    analystRatings: {
      buy: 32,
      hold: 8,
      sell: 0,
    },
    growthRate: 8.1,
    recentEarnings: 'beat',
    ceoRating: 4.5,
    marketSentiment: 'Bullish',
    recentNews: [
      {
        headline: 'Apple Reports Record Quarter with Strong iPhone Sales',
        sentiment: 'positive',
        date: '2025-02-15',
      },
      {
        headline: 'New AI Features Coming to iPhone in Next Update',
        sentiment: 'positive',
        date: '2025-03-21',
      },
      {
        headline: 'Supply Chain Constraints May Impact Apple Production',
        sentiment: 'negative',
        date: '2025-03-30',
      },
    ],
    earningsHistory: [
      {
        date: "2025-01-30",
        period: "Q1 2025",
        actualEPS: 2.18,
        estimatedEPS: 2.10,
        surprise: 3.81,
        guidance: {
          low: 2.20,
          high: 2.35
        }
      },
      {
        date: "2024-10-28",
        period: "Q4 2024",
        actualEPS: 2.05,
        estimatedEPS: 1.95,
        surprise: 5.13,
        guidance: {
          low: 2.10,
          high: 2.25
        }
      },
      {
        date: "2024-07-25",
        period: "Q3 2024",
        actualEPS: 1.89,
        estimatedEPS: 1.85,
        surprise: 2.16,
        guidance: {
          low: 1.90,
          high: 2.05
        }
      },
      {
        date: "2024-04-30",
        period: "Q2 2024",
        actualEPS: 1.76,
        estimatedEPS: 1.70,
        surprise: 3.53,
        guidance: null
      }
    ],
    historicalPrices: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i));
      const basePrice = 175;
      const trendFactor = 1 + (i / 100);
      const volatility = (Math.random() - 0.5) * 0.05;
      
      return {
        date: date.toISOString().split('T')[0],
        price: basePrice * trendFactor * (1 + volatility),
        volume: Math.floor(Math.random() * 15000000) + 10000000
      };
    })
  },
  'MSFT': {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    price: 415.50,
    change: 5.32,
    changePercent: 1.30,
    recommendation: 'Strong Buy',
    metrics: {
      fundamental: [
        { name: 'P/E Ratio', value: 70, description: 'Price to earnings ratio is reasonable given cloud growth' },
        { name: 'Growth Rate', value: 90, description: 'Exceptional Azure growth driving strong revenue increases' },
        { name: 'Earnings Quality', value: 95, description: 'Consistent earnings with high predictability' },
      ],
      technical: [
        { name: 'RSI', value: 60, description: 'Neutral momentum neither overbought nor oversold' },
        { name: 'Moving Averages', value: 90, description: 'Strong uptrend with price well above key moving averages' },
        { name: 'Volume', value: 85, description: 'Consistent high volume supporting price movement' },
      ],
      sentiment: [
        { name: 'Analyst Ratings', value: 95, description: '90% of analysts have a Strong Buy rating' },
        { name: 'News Sentiment', value: 90, description: 'Very positive news coverage around AI initiatives' },
        { name: 'Insider Trading', value: 75, description: 'Limited insider selling despite price appreciation' },
      ],
    },
    peRatio: 32.1,
    rsi: 60,
    fiftyDayMA: 405.80,
    twoHundredDayMA: 380.25,
    analystRatings: {
      buy: 40,
      hold: 4,
      sell: 0,
    },
    growthRate: 15.2,
    recentEarnings: 'beat',
    ceoRating: 4.8,
    marketSentiment: 'Bullish',
    recentNews: [
      {
        headline: 'Microsoft Cloud Revenue Surges 30% Year-over-Year',
        sentiment: 'positive',
        date: '2025-03-25',
      },
      {
        headline: 'Microsoft\'s AI Integration Driving New Customer Adoption',
        sentiment: 'positive',
        date: '2025-03-18',
      },
      {
        headline: 'New Microsoft 365 Features Receive Positive User Feedback',
        sentiment: 'positive',
        date: '2025-03-10',
      },
    ],
    earningsHistory: [
      {
        date: "2025-02-15",
        period: "Q1 2025",
        actualEPS: 2.98,
        estimatedEPS: 2.85,
        surprise: 4.56,
        guidance: {
          low: 3.00,
          high: 3.15
        }
      },
      {
        date: "2024-11-10",
        period: "Q4 2024",
        actualEPS: 2.80,
        estimatedEPS: 2.75,
        surprise: 1.82,
        guidance: {
          low: 2.85,
          high: 3.00
        }
      },
      {
        date: "2024-08-05",
        period: "Q3 2024",
        actualEPS: 2.65,
        estimatedEPS: 2.60,
        surprise: 1.92,
        guidance: null
      },
      {
        date: "2024-05-12",
        period: "Q2 2024",
        actualEPS: 2.50,
        estimatedEPS: 2.45,
        surprise: 2.04,
        guidance: {
          low: 2.55,
          high: 2.70
        }
      }
    ],
    historicalPrices: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i));
      const basePrice = 400;
      const trendFactor = 1 + (i / 90);
      const volatility = (Math.random() - 0.5) * 0.04;
      
      return {
        date: date.toISOString().split('T')[0],
        price: basePrice * trendFactor * (1 + volatility),
        volume: Math.floor(Math.random() * 12000000) + 8000000
      };
    })
  },
  'TSLA': {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    price: 167.42,
    change: -5.23,
    changePercent: -3.03,
    recommendation: 'Hold',
    metrics: {
      fundamental: [
        { name: 'P/E Ratio', value: 45, description: 'High P/E ratio reflects future growth but carries risk' },
        { name: 'Growth Rate', value: 60, description: 'Slowing delivery growth raising concerns' },
        { name: 'Earnings Quality', value: 55, description: 'Increasing reliance on regulatory credits' },
      ],
      technical: [
        { name: 'RSI', value: 35, description: 'Approaching oversold territory after recent decline' },
        { name: 'Moving Averages', value: 40, description: 'Price below key moving averages, suggesting weakness' },
        { name: 'Volume', value: 65, description: 'High volume on down days indicating selling pressure' },
      ],
      sentiment: [
        { name: 'Analyst Ratings', value: 50, description: 'Mixed analyst opinions with increasing price target cuts' },
        { name: 'News Sentiment', value: 45, description: 'Concerns about competition and margin pressure' },
        { name: 'Insider Trading', value: 40, description: 'Notable selling from insiders including executives' },
      ],
    },
    peRatio: 64.8,
    rsi: 35,
    fiftyDayMA: 182.35,
    twoHundredDayMA: 190.42,
    analystRatings: {
      buy: 15,
      hold: 20,
      sell: 5,
    },
    growthRate: 12.3,
    recentEarnings: 'missed',
    ceoRating: 3.2,
    marketSentiment: 'Neutral',
    recentNews: [
      {
        headline: 'Tesla Delivery Numbers Miss Analyst Expectations',
        sentiment: 'negative',
        date: '2025-04-02',
      },
      {
        headline: 'Competition Intensifying in Electric Vehicle Market',
        sentiment: 'negative',
        date: '2025-03-28',
      },
      {
        headline: 'Tesla Announces New Energy Storage Projects',
        sentiment: 'positive',
        date: '2025-03-15',
      },
    ],
    earningsHistory: [
      {
        date: "2025-01-25",
        period: "Q1 2025",
        actualEPS: 0.65,
        estimatedEPS: 0.70,
        surprise: -7.14,
        guidance: null
      },
      {
        date: "2024-10-15",
        period: "Q4 2024",
        actualEPS: 0.68,
        estimatedEPS: 0.65,
        surprise: 4.62,
        guidance: {
          low: 0.65,
          high: 0.75
        }
      },
      {
        date: "2024-07-18",
        period: "Q3 2024",
        actualEPS: 0.60,
        estimatedEPS: 0.55,
        surprise: 9.09,
        guidance: {
          low: 0.60,
          high: 0.70
        }
      },
      {
        date: "2024-04-20",
        period: "Q2 2024",
        actualEPS: 0.52,
        estimatedEPS: 0.58,
        surprise: -10.34,
        guidance: null
      }
    ],
    historicalPrices: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i));
      const basePrice = 180;
      const trendFactor = 1 - (i / 150);
      const volatility = (Math.random() - 0.5) * 0.08;
      
      return {
        date: date.toISOString().split('T')[0],
        price: basePrice * trendFactor * (1 + volatility),
        volume: Math.floor(Math.random() * 20000000) + 15000000
      };
    })
  },
  'AMZN': {
    ticker: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 178.75,
    change: 1.25,
    changePercent: 0.70,
    recommendation: 'Buy',
    metrics: {
      fundamental: [
        { name: 'P/E Ratio', value: 72, description: 'P/E reflects continued investment in growth areas' },
        { name: 'Growth Rate', value: 80, description: 'AWS and advertising segments showing strong growth' },
        { name: 'Earnings Quality', value: 75, description: 'Improving profit margins as investments mature' },
      ],
      technical: [
        { name: 'RSI', value: 58, description: 'Neutral momentum with room to run higher' },
        { name: 'Moving Averages', value: 75, description: 'Price above major moving averages showing strength' },
        { name: 'Volume', value: 65, description: 'Average volume indicating steady accumulation' },
      ],
      sentiment: [
        { name: 'Analyst Ratings', value: 85, description: 'Strong consensus among analysts with upside targets' },
        { name: 'News Sentiment', value: 70, description: 'Positive coverage on AI initiatives and cloud growth' },
        { name: 'Insider Trading', value: 65, description: 'Minimal insider selling despite price appreciation' },
      ],
    },
    peRatio: 38.2,
    rsi: 58,
    fiftyDayMA: 175.32,
    twoHundredDayMA: 165.47,
    analystRatings: {
      buy: 35,
      hold: 5,
      sell: 0,
    },
    growthRate: 10.5,
    recentEarnings: 'beat',
    ceoRating: 4.3,
    marketSentiment: 'Bullish',
    recentNews: [
      {
        headline: 'Amazon Web Services Announces New AI Tools for Developers',
        sentiment: 'positive',
        date: '2025-03-29',
      },
      {
        headline: 'Amazon\'s Logistics Network Expansion Continues',
        sentiment: 'positive',
        date: '2025-03-20',
      },
      {
        headline: 'Retail Sales Growth Slows but Profitability Improves',
        sentiment: 'neutral',
        date: '2025-03-12',
      },
    ],
    earningsHistory: [
      {
        date: "2025-02-29",
        period: "Q1 2025",
        actualEPS: 2.20,
        estimatedEPS: 2.15,
        surprise: 5.00,
        guidance: {
          low: 2.25,
          high: 2.28
        }
      },
      {
        date: "2024-11-25",
        period: "Q4 2024",
        actualEPS: 2.15,
        estimatedEPS: 2.10,
        surprise: 5.00,
        guidance: {
          low: 2.20,
          high: 2.25
        }
      },
      {
        date: "2024-08-20",
        period: "Q3 2024",
        actualEPS: 2.00,
        estimatedEPS: 1.95,
        surprise: 5.00,
        guidance: {
          low: 2.05,
          high: 2.10
        }
      },
      {
        date: "2024-05-25",
        period: "Q2 2024",
        actualEPS: 1.85,
        estimatedEPS: 1.80,
        surprise: 5.00,
        guidance: {
          low: 1.90,
          high: 1.95
        }
      }
    ],
    historicalPrices: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i));
      const basePrice = 175;
      const trendFactor = 1 + (i / 100);
      const volatility = (Math.random() - 0.5) * 0.05;
      
      return {
        date: date.toISOString().split('T')[0],
        price: basePrice * trendFactor * (1 + volatility),
        volume: Math.floor(Math.random() * 15000000) + 10000000
      };
    })
  },
  'GOOGL': {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 152.28,
    change: -0.45,
    changePercent: -0.29,
    recommendation: 'Buy',
    metrics: {
      fundamental: [
        { name: 'P/E Ratio', value: 78, description: 'Reasonable valuation compared to tech peers' },
        { name: 'Growth Rate', value: 75, description: 'Search and YouTube continue to show strong growth' },
        { name: 'Earnings Quality', value: 80, description: 'Consistent earnings with high cash flow generation' },
      ],
      technical: [
        { name: 'RSI', value: 52, description: 'Neutral momentum with balanced buying and selling' },
        { name: 'Moving Averages', value: 70, description: 'Price consolidating above key moving averages' },
        { name: 'Volume', value: 60, description: 'Average volume with no clear direction' },
      ],
      sentiment: [
        { name: 'Analyst Ratings', value: 80, description: 'Strong buy recommendations from leading analysts' },
        { name: 'News Sentiment', value: 65, description: 'Mostly positive with some regulatory concerns' },
        { name: 'Insider Trading', value: 70, description: 'Limited insider activity' },
      ],
    },
    peRatio: 25.3,
    rsi: 52,
    fiftyDayMA: 150.75,
    twoHundredDayMA: 145.20,
    analystRatings: {
      buy: 38,
      hold: 2,
      sell: 0,
    },
    growthRate: 9.8,
    recentEarnings: 'beat',
    ceoRating: 4.2,
    marketSentiment: 'Bullish',
    recentNews: [
      {
        headline: 'Google Search Ad Revenue Exceeds Expectations',
        sentiment: 'positive',
        date: '2025-03-31',
      },
      {
        headline: 'New Android Features Boosting User Engagement',
        sentiment: 'positive',
        date: '2025-03-22',
      },
      {
        headline: 'Regulatory Investigation on Ad Business Continues',
        sentiment: 'negative',
        date: '2025-03-15',
      },
    ],
    earningsHistory: [
      {
        date: "2025-02-28",
        period: "Q1 2025",
        actualEPS: 2.25,
        estimatedEPS: 2.20,
        surprise: 5.00,
        guidance: {
          low: 2.30,
          high: 2.35
        }
      },
      {
        date: "2024-11-20",
        period: "Q4 2024",
        actualEPS: 2.20,
        estimatedEPS: 2.15,
        surprise: 5.00,
        guidance: {
          low: 2.25,
          high: 2.30
        }
      },
      {
        date: "2024-08-15",
        period: "Q3 2024",
        actualEPS: 2.05,
        estimatedEPS: 2.00,
        surprise: 5.00,
        guidance: {
          low: 2.10,
          high: 2.15
        }
      },
      {
        date: "2024-05-20",
        period: "Q2 2024",
        actualEPS: 1.90,
        estimatedEPS: 1.85,
        surprise: 5.00,
        guidance: {
          low: 1.95,
          high: 2.00
        }
      }
    ],
    historicalPrices: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i));
      const basePrice = 150;
      const trendFactor = 1 + (i / 100);
      const volatility = (Math.random() - 0.5) * 0.05;
      
      return {
        date: date.toISOString().split('T')[0],
        price: basePrice * trendFactor * (1 + volatility),
        volume: Math.floor(Math.random() * 15000000) + 10000000
      };
    })
  },
};

// Add more mock stocks
const moreStocks = [
  { ticker: 'NVDA', name: 'NVIDIA Corporation', recommendation: 'Strong Buy' },
  { ticker: 'META', name: 'Meta Platforms, Inc.', recommendation: 'Buy' },
  { ticker: 'NFLX', name: 'Netflix, Inc.', recommendation: 'Hold' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.', recommendation: 'Buy' },
  { ticker: 'DIS', name: 'The Walt Disney Company', recommendation: 'Hold' },
  { ticker: 'BA', name: 'The Boeing Company', recommendation: 'Sell' },
  { ticker: 'GM', name: 'General Motors Company', recommendation: 'Strong Sell' },
  { ticker: 'INTC', name: 'Intel Corporation', recommendation: 'Sell' },
];

// Generate simple data for additional stocks
moreStocks.forEach(stock => {
  // Random price between 50 and 500
  const price = Math.round(Math.random() * 450 + 50);
  // Random change between -5% and +5%
  const changePercent = (Math.random() * 10 - 5).toFixed(2);
  const change = (price * parseFloat(changePercent) / 100).toFixed(2);
  
  let recommendation = stock.recommendation as StockRecommendation;
  
  // Generate metrics based on recommendation
  const getMetricValue = (base: number) => {
    return Math.min(100, Math.max(0, base + (Math.random() * 20 - 10)));
  };
  
  let fundamentalBase = recommendation === 'Strong Buy' ? 85 :
                       recommendation === 'Buy' ? 75 :
                       recommendation === 'Hold' ? 50 :
                       recommendation === 'Sell' ? 35 : 20;
  
  let technicalBase = recommendation === 'Strong Buy' ? 80 :
                     recommendation === 'Buy' ? 70 :
                     recommendation === 'Hold' ? 55 :
                     recommendation === 'Sell' ? 30 : 25;
  
  let sentimentBase = recommendation === 'Strong Buy' ? 90 :
                     recommendation === 'Buy' ? 75 :
                     recommendation === 'Hold' ? 50 :
                     recommendation === 'Sell' ? 40 : 20;
  
  stocksDatabase[stock.ticker] = {
    ticker: stock.ticker,
    name: stock.name,
    price: price,
    change: parseFloat(change),
    changePercent: parseFloat(changePercent),
    recommendation: recommendation,
    metrics: {
      fundamental: [
        { name: 'P/E Ratio', value: getMetricValue(fundamentalBase), description: 'Price to earnings analysis' },
        { name: 'Growth Rate', value: getMetricValue(fundamentalBase), description: 'Revenue and earnings trajectory' },
        { name: 'Earnings Quality', value: getMetricValue(fundamentalBase), description: 'Earnings consistency assessment' },
      ],
      technical: [
        { name: 'RSI', value: getMetricValue(technicalBase), description: 'Relative strength indicator' },
        { name: 'Moving Averages', value: getMetricValue(technicalBase), description: 'Price relative to key moving averages' },
        { name: 'Volume', value: getMetricValue(technicalBase), description: 'Trading volume analysis' },
      ],
      sentiment: [
        { name: 'Analyst Ratings', value: getMetricValue(sentimentBase), description: 'Wall Street analyst consensus' },
        { name: 'News Sentiment', value: getMetricValue(sentimentBase), description: 'Recent news coverage sentiment' },
        { name: 'Insider Trading', value: getMetricValue(sentimentBase), description: 'Recent insider activity' },
      ],
    },
    peRatio: Math.round(Math.random() * 40 + 10),
    rsi: Math.round(Math.random() * 100),
    fiftyDayMA: price * (1 + (Math.random() * 0.1 - 0.05)),
    twoHundredDayMA: price * (1 + (Math.random() * 0.2 - 0.1)),
    analystRatings: {
      buy: Math.round(Math.random() * 30 + 5),
      hold: Math.round(Math.random() * 15 + 2),
      sell: Math.round(Math.random() * 5),
    },
    growthRate: parseFloat((Math.random() * 20 - 5).toFixed(1)),
    recentEarnings: Math.random() > 0.7 ? 'beat' : (Math.random() > 0.5 ? 'met' : 'missed'),
    ceoRating: parseFloat((Math.random() * 4 + 1).toFixed(1)),
    marketSentiment: Math.random() > 0.6 ? 'Bullish' : (Math.random() > 0.4 ? 'Neutral' : 'Bearish'),
    recentNews: null, // Simplified for additional stocks
    earningsHistory: [
      {
        date: "2025-02-10",
        period: "Q1 2025",
        actualEPS: (Math.random() * 2 + 0.5).toFixed(2) as unknown as number,
        estimatedEPS: (Math.random() * 2 + 0.5).toFixed(2) as unknown as number,
        surprise: (Math.random() * 10 - 5).toFixed(2) as unknown as number,
        guidance: Math.random() > 0.3 ? {
          low: (Math.random() * 2 + 0.5).toFixed(2) as unknown as number,
          high: (Math.random() * 3 + 1).toFixed(2) as unknown as number
        } : null
      },
      {
        date: "2024-11-15",
        period: "Q4 2024",
        actualEPS: (Math.random() * 2 + 0.5).toFixed(2) as unknown as number,
        estimatedEPS: (Math.random() * 2 + 0.5).toFixed(2) as unknown as number,
        surprise: (Math.random() * 10 - 5).toFixed(2) as unknown as number,
        guidance: Math.random() > 0.3 ? {
          low: (Math.random() * 2 + 0.5).toFixed(2) as unknown as number,
          high: (Math.random() * 3 + 1).toFixed(2) as unknown as number
        } : null
      },
      {
        date: "2024-08-20",
        period: "Q3 2024",
        actualEPS: (Math.random() * 2 + 0.5).toFixed(2) as unknown as number,
        estimatedEPS: (Math.random() * 2 + 0.5).toFixed(2) as unknown as number,
        surprise: (Math.random() * 10 - 5).toFixed(2) as unknown as number,
        guidance: Math.random() > 0.3 ? {
          low: (Math.random() * 2 + 0.5).toFixed(2) as unknown as number,
          high: (Math.random() * 3 + 1).toFixed(2) as unknown as number
        } : null
      },
      {
        date: "2024-05-15",
        period: "Q2 2024",
        actualEPS: (Math.random() * 2 + 0.5).toFixed(2) as unknown as number,
        estimatedEPS: (Math.random() * 2 + 0.5).toFixed(2) as unknown as number,
        surprise: (Math.random() * 10 - 5).toFixed(2) as unknown as number,
        guidance: Math.random() > 0.3 ? {
          low: (Math.random() * 2 + 0.5).toFixed(2) as unknown as number,
          high: (Math.random() * 3 + 1).toFixed(2) as unknown as number
        } : null
      }
    ],
    historicalPrices: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i));
      
      // Generate realistic price movements
      const basePrice = stocksDatabase[stock.ticker].price * 0.9;
      const randomTrend = Math.random() > 0.5 ? 1 : -1;
      const trendFactor = 1 + (randomTrend * i / 200);
      const volatility = (Math.random() - 0.5) * 0.06;
      
      return {
        date: date.toISOString().split('T')[0],
        price: basePrice * trendFactor * (1 + volatility),
        volume: Math.floor(Math.random() * 10000000) + 2000000
      };
    })
  };
});
