
import React from 'react';
import { StockData } from '@/types/stock';
import BuySellReasons from './BuySellReasons';

interface StockMetricsProps {
  stock: StockData;
}

const StockMetrics: React.FC<StockMetricsProps> = ({ stock }) => {
  const getMetricColorClass = (value: number) => {
    if (value >= 80) return 'bg-rating-strongBuy text-white';
    if (value >= 60) return 'bg-rating-buy text-white';
    if (value >= 40) return 'bg-rating-hold text-black';
    if (value >= 20) return 'bg-rating-sell text-white';
    return 'bg-rating-strongSell text-white';
  };

  const formatMetricValue = (value: number) => {
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  };

  const allMetrics = [
    ...stock.metrics.fundamental,
    ...stock.metrics.technical,
    ...stock.metrics.sentiment
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Key Metrics Analysis</h3>
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-1 p-1 bg-gray-100 rounded-lg">
        {allMetrics.map((metric, index) => (
          <div
            key={index}
            className={`
              ${getMetricColorClass(metric.value)}
              p-2 rounded flex flex-col items-center justify-center
              aspect-square transition-all duration-200 hover:scale-[1.02]
              cursor-help relative group
            `}
          >
            <div className="text-xs font-medium text-center mb-1 line-clamp-2">
              {metric.name}
            </div>
            <div className="text-lg font-bold">
              {formatMetricValue(metric.value)}
            </div>
            <div className="absolute invisible group-hover:visible bg-black/90 text-white p-2 rounded text-xs w-48 z-10 bottom-full left-1/2 -translate-x-1/2 mb-2">
              {metric.description}
            </div>
          </div>
        ))}
      </div>

      <BuySellReasons stock={stock} />
    </div>
  );
};

export default StockMetrics;
