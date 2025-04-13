
import React from 'react';
import { MetricScore } from '@/types/stock';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { ChevronUp, ChevronDown, MinusIcon } from "lucide-react";

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

  const getIndicator = (value: number) => {
    if (value >= 60) return <ChevronUp className="h-4 w-4 text-rating-strongBuy" />;
    if (value <= 40) return <ChevronDown className="h-4 w-4 text-rating-strongSell" />;
    return <MinusIcon className="h-4 w-4 text-rating-hold" />;
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          {getIndicator(metric.value)}
          <span className="text-sm font-medium">{metric.name}</span>
        </div>
        <span className="text-sm font-medium">{metric.value}/100</span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help">
              <Progress 
                value={metric.value} 
                className={`h-2 ${getColorClass(metric.value)}`}
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
