
import React from 'react';
import { StockData } from '@/types/stock';
import MetricBar from '../MetricBar';

interface StockMetricsProps {
  stock: StockData;
}

const StockMetrics: React.FC<StockMetricsProps> = ({ stock }) => {
  // Combine all metrics and add competition
  const allMetrics = [
    ...stock.metrics.fundamental,
    ...stock.metrics.technical,
    ...stock.metrics.sentiment,
    {
      name: 'Competition',
      value: stock.industry === 'Technology' ? 85 : 65, // Higher competition in tech
      description: `Competition level in the ${stock.industry || 'industry'}. Higher score indicates stronger competitive position.`
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Key Metrics Analysis</h3>
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-1 p-1 bg-gray-100 rounded-lg">
        {allMetrics.map((metric, index) => (
          <MetricBar key={index} metric={metric} />
        ))}
      </div>
    </div>
  );
};

export default StockMetrics;
