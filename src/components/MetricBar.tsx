
import React, { useState } from 'react';
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

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{metric.name}</span>
        <span className="text-sm font-medium">{metric.value}/100</span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden cursor-help">
              <div 
                className={`h-2.5 rounded-full ${getColorClass(metric.value)}`} 
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-sm">
            <p>{metric.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default MetricBar;
