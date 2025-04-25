
import React from 'react';
import { Button } from '@/components/ui/button';

export type TimeRange = '1D' | '1W' | '1M' | 'YTD' | '1Y' | '5Y';

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeSelect: (range: TimeRange) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  onRangeSelect,
}) => {
  const ranges: TimeRange[] = ['1D', '1W', '1M', 'YTD', '1Y', '5Y'];

  return (
    <div className="flex gap-2 mb-4">
      {ranges.map((range) => (
        <Button
          key={range}
          variant={selectedRange === range ? "default" : "outline"}
          size="sm"
          onClick={() => onRangeSelect(range)}
        >
          {range}
        </Button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;
