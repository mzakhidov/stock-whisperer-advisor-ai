
import { MetricScore, StockRecommendation } from '@/types/stock';

export const generateRecommendation = (metrics: MetricScore[]): StockRecommendation => {
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
