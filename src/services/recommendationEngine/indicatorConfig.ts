
import { Indicators } from './types';

export const indicators: Indicators = {
  // Technical Indicators (Weight: 1)
  'RSI': { weight: 1, buyThreshold: 30, sellThreshold: 80, buyBelow: true, sellAbove: true },
  'Moving_Average_Cross': { weight: 1, buyThreshold: 1, sellThreshold: -1, buyBelow: false, sellAbove: false },
  'Volume': { weight: 0.8, buyThreshold: 70, sellThreshold: 30, buyBelow: false, sellAbove: false },
  'Price_To_MA': { weight: 0.8, buyThreshold: 70, sellThreshold: 30, buyBelow: false, sellAbove: false },

  // Fundamental Indicators (Weight: 1)
  'PE_Ratio': { weight: 1, buyThreshold: 70, sellThreshold: 30, buyBelow: false, sellAbove: false },
  'Annual_Growth_Rate': { weight: 1, buyThreshold: 15, sellThreshold: 5, buyBelow: false, sellAbove: false },
  'Analyst_Price_Projection': { weight: 1, buyThreshold: 10, sellThreshold: -5, buyBelow: false, sellAbove: false },
  'Earnings_Beat_History': { weight: 0.8, buyThreshold: 3, sellThreshold: 1, buyBelow: false, sellAbove: false },
  'Company_Guidance': { weight: 0.8, buyThreshold: 5, sellThreshold: -5, buyBelow: false, sellAbove: false },
  'Analyst_Rating': { weight: 0.9, buyThreshold: 4, sellThreshold: 2, buyBelow: false, sellAbove: false },
  
  // Sentiment Indicators (Weight: 0.8)
  'CEO_Strength': { weight: 0.8, buyThreshold: 4, sellThreshold: 2, buyBelow: false, sellAbove: false },
  'Latest_Company_News': { weight: 0.8, buyThreshold: 0.5, sellThreshold: -0.5, buyBelow: false, sellAbove: false },
  'Insider_Trading': { weight: 0.9, buyThreshold: 70, sellThreshold: 30, buyBelow: false, sellAbove: false },
  'Market_Sentiment': { weight: 0.8, buyThreshold: 5, sellThreshold: -5, buyBelow: false, sellAbove: false },
  
  // External Market Indicators (Weight: 0.5 to 0.7)
  'VIX_Rate': { weight: 0.7, buyThreshold: 15, sellThreshold: 30, buyBelow: true, sellAbove: true },
  'Bond_Yield': { weight: 0.6, buyThreshold: 3.5, sellThreshold: 5, buyBelow: true, sellAbove: true },
  'Consumer_Sentiment': { weight: 0.5, buyThreshold: 90, sellThreshold: 70, buyBelow: false, sellAbove: false },
  'Consumer_Spending': { weight: 0.5, buyThreshold: 0.3, sellThreshold: -0.3, buyBelow: false, sellAbove: false },
  
  // Macroeconomic Indicators (Weight: 0.5)
  'Macroeconomics': { weight: 0.7, buyThreshold: 0.5, sellThreshold: -0.5, buyBelow: false, sellAbove: false },
  'Inflation_Rate': { weight: 0.5, buyThreshold: 2.5, sellThreshold: 4, buyBelow: true, sellAbove: true },
  'Unemployment_Rate': { weight: 0.5, buyThreshold: 4, sellThreshold: 5.5, buyBelow: true, sellAbove: true },
  'GDP_Growth_Rate': { weight: 0.6, buyThreshold: 2, sellThreshold: 0, buyBelow: false, sellAbove: false },
  'Fed_Funds_Rate': { weight: 0.5, buyThreshold: 3, sellThreshold: 5.5, buyBelow: true, sellAbove: true }
};
