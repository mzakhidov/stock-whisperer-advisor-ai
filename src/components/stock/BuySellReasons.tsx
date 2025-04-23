
import React from 'react';
import { StockData } from '@/types/stock';
import { 
  ThumbsUp, 
  ThumbsDown, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

interface BuySellReasonsProps {
  stock: StockData;
}

const BuySellReasons: React.FC<BuySellReasonsProps> = ({ stock }) => {
  // Extract top factors and split them into buy/sell reasons based on their values
  const allMetrics = [
    ...stock.metrics.fundamental,
    ...stock.metrics.technical,
    ...stock.metrics.sentiment
  ];

  const buyReasons = allMetrics
    .filter(metric => metric.value >= 70)
    .slice(0, 4)
    .map(metric => metric.name);

  const sellReasons = allMetrics
    .filter(metric => metric.value <= 30)
    .slice(0, 4)
    .map(metric => metric.name);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Investment Considerations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-[#F2FCE2] border border-finance-green rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <ThumbsUp className="h-5 w-5 text-finance-green" />
            <h4 className="font-semibold text-finance-green">Reasons to Buy</h4>
          </div>
          <ul className="space-y-2">
            {buyReasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-finance-green mt-1" />
                <span>{reason}</span>
              </li>
            ))}
            {buyReasons.length === 0 && (
              <li className="flex items-start gap-2 text-gray-500">
                <ShieldCheck className="h-4 w-4 text-gray-500 mt-1" />
                <span>No strong buy signals at the moment</span>
              </li>
            )}
          </ul>
        </div>

        <div className="p-4 bg-red-50 border border-[#ea384c] rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <ThumbsDown className="h-5 w-5 text-[#ea384c]" />
            <h4 className="font-semibold text-[#ea384c]">Reasons to Sell</h4>
          </div>
          <ul className="space-y-2">
            {sellReasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2">
                <TrendingDown className="h-4 w-4 text-[#ea384c] mt-1" />
                <span>{reason}</span>
              </li>
            ))}
            {sellReasons.length === 0 && (
              <li className="flex items-start gap-2 text-gray-500">
                <AlertTriangle className="h-4 w-4 text-gray-500 mt-1" />
                <span>No significant sell signals</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BuySellReasons;

