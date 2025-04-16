
import React from 'react';
import { MetricScore } from '@/types/stock';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricBarProps {
  metric: MetricScore;
}

const MetricBar: React.FC<MetricBarProps> = ({ metric }) => {
  const getColorClass = (value: number) => {
    if (value >= 80) return 'bg-rating-strongBuy';
    if (value >= 60) return 'bg-rating-buy';
    if (value >= 40) return 'bg-rating-hold';
    if (value >= 20) return 'bg-rating-sell';
    return 'bg-rating-strongSell';
  };

  const getTextColorClass = (value: number) => {
    if (value >= 40) return 'text-white';
    return 'text-white';
  };

  // Format the value to have at most 1 decimal place
  const formattedValue = Number.isInteger(metric.value) 
    ? metric.value 
    : metric.value.toFixed(1);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center cursor-help hover:scale-105 transition-transform duration-300">
            <span className="text-sm font-semibold mb-2 text-gray-700 truncate w-24 text-center">{metric.name}</span>
            <div 
              className={`
                w-24 h-24 rounded-xl flex items-center justify-center 
                shadow-md border-2 border-opacity-20 border-gray-300
                ${getColorClass(metric.value)} 
                ${getTextColorClass(metric.value)}
                transform hover:shadow-lg overflow-hidden
              `}
            >
              <span className="text-2xl font-bold">{formattedValue}</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm">
          <p>{metric.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MetricBar;
