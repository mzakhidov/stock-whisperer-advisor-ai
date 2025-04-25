
import { Indicators } from './types';

export const indicators: Indicators = {
  // Internal Indicators (Weight: 1)
  'RSI': { weight: 1, buyThreshold: 30, sellThreshold: 80, buyBelow: true, sellAbove: true },
  'PE_Ratio': { weight: 1, buyThreshold: 25, sellThreshold: 40, buyBelow: true, sellAbove: true },
  'Annual_Growth_Rate': { weight: 1, buyThreshold: 15, sellThreshold: 10, buyBelow: false, sellAbove: false },
  'Analyst_Rating': { weight: 1, buyThreshold: 4, sellThreshold: 2, buyBelow: false, sellAbove: false },
  'Analyst_Price_Projection': { weight: 1, buyThreshold: 50, sellThreshold: 0, buyBelow: false, sellAbove: false },
  'CEO_Strength': { weight: 1, buyThreshold: 4, sellThreshold: 2, buyBelow: false, sellAbove: false },
  'Moving_Average_Cross': { weight: 1, buyThreshold: 1, sellThreshold: -1, buyBelow: false, sellAbove: false },
  'Earnings_Beat_History': { weight: 1, buyThreshold: 3, sellThreshold: 1, buyBelow: false, sellAbove: false },
  'Company_Guidance': { weight: 1, buyThreshold: 1, sellThreshold: -1, buyBelow: false, sellAbove: false },
  'Latest_Company_News': { weight: 1, buyThreshold: 1, sellThreshold: -1, buyBelow: false, sellAbove: false },
  
  // External Indicators (Weight: 0.5)
  'Market_Sentiment': { weight: 0.5, buyThreshold: -20, sellThreshold: 20, buyBelow: true, sellAbove: true },
  'Macroeconomics': { weight: 0.5, buyThreshold: 1, sellThreshold: -1, buyBelow: false, sellAbove: false },
  'Bond_Yield': { weight: 0.5, buyThreshold: 4.2, sellThreshold: 5, buyBelow: true, sellAbove: true },
  'Inflation_Rate': { weight: 0.5, buyThreshold: 3, sellThreshold: 4, buyBelow: true, sellAbove: true },
  'Unemployment_Rate': { weight: 0.5, buyThreshold: 4, sellThreshold: 4, buyBelow: true, sellAbove: true },
  'Consumer_Spending': { weight: 0.5, buyThreshold: 0, sellThreshold: 0, buyBelow: false, sellAbove: false },
  'Consumer_Sentiment': { weight: 0.5, buyThreshold: 100, sellThreshold: 80, buyBelow: false, sellAbove: false },
  'Fed_Funds_Rate': { weight: 0.5, buyThreshold: 4, sellThreshold: 5, buyBelow: true, sellAbove: true },
  'VIX_Rate': { weight: 0.5, buyThreshold: 20, sellThreshold: 40, buyBelow: true, sellAbove: true },
  'GDP_Growth_Rate': { weight: 0.5, buyThreshold: 0, sellThreshold: 0, buyBelow: false, sellAbove: false }
};
