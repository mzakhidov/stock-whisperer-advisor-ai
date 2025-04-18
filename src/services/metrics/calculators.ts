
export const calculateGrowthValue = (ratios: any): number => {
  const revenueGrowth = ratios.netIncomePerShare > 0 ? 70 : 30;
  const profitMargin = ratios.netProfitMargin || 0;
  const profitMarginScore = profitMargin > 0.2 ? 80 : 
                           profitMargin > 0.1 ? 65 : 
                           profitMargin > 0.05 ? 50 : 30;
  
  return Math.round((revenueGrowth + profitMarginScore) / 2);
};

export const calculateEarningsQuality = (ratios: any): number => {
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
