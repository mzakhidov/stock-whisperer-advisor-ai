
import { StockData, StockRecommendation } from "../types/stock";
import { toast } from "@/components/ui/sonner";

// Mock database of stocks
const stocksDatabase: Record<string, StockData> = {
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
        headline: 'Microsoft's AI Integration Driving New Customer Adoption',
        sentiment: 'positive',
        date: '2025-03-18',
      },
      {
        headline: 'New Microsoft 365 Features Receive Positive User Feedback',
        sentiment: 'positive',
        date: '2025-03-10',
      },
    ],
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
        headline: 'Amazon's Logistics Network Expansion Continues',
        sentiment: 'positive',
        date: '2025-03-20',
      },
      {
        headline: 'Retail Sales Growth Slows but Profitability Improves',
        sentiment: 'neutral',
        date: '2025-03-12',
      },
    ],
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
  };
});

// Service functions
export const searchStocks = async (query: string): Promise<StockData[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!query) return [];
  
  query = query.toUpperCase();
  
  return Object.values(stocksDatabase).filter(
    stock => stock.ticker.includes(query) || stock.name.toUpperCase().includes(query)
  ).slice(0, 5); // Limit to 5 results
};

export const getStockData = async (ticker: string): Promise<StockData | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  ticker = ticker.toUpperCase();
  
  // If stock not found, show error toast
  if (!stocksDatabase[ticker]) {
    toast.error("Stock not found. Please try a different ticker symbol.");
    return null;
  }
  
  return stocksDatabase[ticker];
};

// Get recommendation color based on the recommendation
export const getRecommendationColor = (recommendation: StockRecommendation): string => {
  switch (recommendation) {
    case 'Strong Buy':
      return 'bg-rating-strongBuy';
    case 'Buy':
      return 'bg-rating-buy';
    case 'Hold':
      return 'bg-rating-hold';
    case 'Sell':
      return 'bg-rating-sell';
    case 'Strong Sell':
      return 'bg-rating-strongSell';
    default:
      return 'bg-gray-500';
  }
};

// Get recommendation text color
export const getRecommendationTextColor = (recommendation: StockRecommendation): string => {
  switch (recommendation) {
    case 'Strong Buy':
    case 'Buy':
      return 'text-white';
    case 'Hold':
      return 'text-black';
    case 'Sell':
    case 'Strong Sell':
      return 'text-white';
    default:
      return 'text-white';
  }
};

// Get change color
export const getChangeColor = (change: number): string => {
  return change >= 0 ? 'text-finance-green' : 'text-finance-red';
};
