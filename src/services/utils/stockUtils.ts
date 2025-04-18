
import { StockRecommendation } from '@/types/stock';

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
