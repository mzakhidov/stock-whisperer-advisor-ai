
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

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center cursor-help">
            <span className="text-xs font-medium mb-1">{metric.name}</span>
            <div 
              className={`w-14 h-14 rounded-md flex items-center justify-center ${getColorClass(metric.value)} ${getTextColorClass(metric.value)}`}
            >
              <span className="text-lg font-bold">{metric.value}</span>
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
