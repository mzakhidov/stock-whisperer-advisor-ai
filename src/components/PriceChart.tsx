
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format, subDays, subWeeks, subMonths, subYears, startOfYear } from 'date-fns';
import TimeRangeSelector, { TimeRange } from './TimeRangeSelector';

interface PriceChartProps {
  data: {
    date: string;
    price: number;
    volume: number;
  }[];
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1M');

  const getFilteredData = () => {
    const today = new Date();
    let startDate = new Date();

    switch (selectedRange) {
      case '1D':
        startDate = subDays(today, 1);
        break;
      case '1W':
        startDate = subWeeks(today, 1);
        break;
      case '1M':
        startDate = subMonths(today, 1);
        break;
      case 'YTD':
        startDate = startOfYear(today);
        break;
      case '1Y':
        startDate = subYears(today, 1);
        break;
      case '5Y':
        startDate = subYears(today, 5);
        break;
    }

    return data.filter(item => new Date(item.date) >= startDate);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (selectedRange === '1D') {
      return format(date, 'HH:mm');
    }
    if (selectedRange === '1W' || selectedRange === '1M') {
      return format(date, 'MMM d');
    }
    return format(date, 'MMM yyyy');
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const filteredData = getFilteredData();

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Price History</CardTitle>
          <TimeRangeSelector 
            selectedRange={selectedRange} 
            onRangeSelect={setSelectedRange}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                minTickGap={50}
              />
              <YAxis
                tickFormatter={formatPrice}
                domain={['auto', 'auto']}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                labelFormatter={(label) => formatDate(label as string)}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#0ea5e9"
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
