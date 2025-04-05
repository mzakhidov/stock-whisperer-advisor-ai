
import React from 'react';
import { MetricScore } from '@/types/stock';

interface FactorBubblesProps {
  factors: MetricScore[];
}

const FactorBubbles: React.FC<FactorBubblesProps> = ({ factors }) => {
  // Sort factors by value (highest first) to ensure most important ones are more prominent
  const sortedFactors = [...factors].sort((a, b) => b.value - a.value);
  
  return (
    <div className="py-4">
      <h3 className="text-lg font-semibold mb-3">Key Influencing Factors</h3>
      <div className="flex flex-wrap justify-center gap-3 p-2">
        {sortedFactors.map((factor) => {
          // Calculate size based on factor value (40-100 range)
          const minSize = 40;
          const maxSize = 100;
          const size = minSize + ((factor.value / 100) * (maxSize - minSize));
          
          // Determine color based on value
          const getColor = (value: number) => {
            if (value >= 80) return 'bg-rating-strongBuy text-white';
            if (value >= 60) return 'bg-rating-buy text-white';
            if (value >= 40) return 'bg-rating-hold text-black';
            if (value >= 20) return 'bg-rating-sell text-white';
            return 'bg-rating-strongSell text-white';
          };
          
          return (
            <div
              key={factor.name}
              className={`rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105 ${getColor(factor.value)}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                fontSize: `${12 + (factor.value / 100) * 6}px`,
              }}
              title={`${factor.name}: ${factor.description}`}
            >
              <div className="text-center p-2 font-medium leading-tight">
                {factor.name}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-center text-gray-500 mt-2">
        Bubble size represents factor importance in recommendation
      </p>
    </div>
  );
};

export default FactorBubbles;
