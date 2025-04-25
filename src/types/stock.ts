
export type StockRecommendation = 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';

export type MetricScore = {
  name: string;
  value: number; // 0-100 scale
  description: string;
};

export type AnalystDetail = {
  name: string;
  company: string;
  recommendation: StockRecommendation;
  priceTarget: number;
  date: string;
};

export type MacroIndicator = {
  name: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  period: string;
};

export type EarningsResult = {
  date: string;
  period: string;
  actualEPS: number;
  estimatedEPS: number;
  surprise: number;
  guidance: {
    low: number;
    high: number;
  } | null;
};

export type StockData = {
  ticker: string;
  name: string;
  description?: string; // Added description field
  mainProducts?: string[]; // Added main products/services
  industry?: string; // Added industry field
  price: number;
  change: number;
  changePercent: number;
  recommendation: StockRecommendation;
  metrics: {
    fundamental: MetricScore[];
    technical: MetricScore[];
    sentiment: MetricScore[];
    aiAnalysisFactors?: MetricScore[]; // Added AI analysis factors
  };
  peRatio: number | null;
  rsi: number | null;
  fiftyDayMA: number | null;
  twoHundredDayMA: number | null;
  analystRatings: {
    buy: number;
    hold: number;
    sell: number;
  } | null;
  growthRate: number | null;
  recentEarnings: 'beat' | 'met' | 'missed' | null;
  ceoRating: number | null;
  marketSentiment: 'Bullish' | 'Neutral' | 'Bearish' | null;
  recentNews: {
    headline: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    date: string;
  }[] | null;
  analystDetails?: AnalystDetail[];
  macroeconomics?: {
    gdpGrowth: MacroIndicator;
    unemploymentRate: MacroIndicator;
    inflationRate: MacroIndicator;
    consumerSpending: MacroIndicator;
    fedFundsRate: MacroIndicator;
  };
  earningsHistory: EarningsResult[];
  historicalPrices: {
    date: string;
    price: number;
    volume: number;
  }[];
};
