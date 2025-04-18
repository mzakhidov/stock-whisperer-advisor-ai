
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MacroIndicator } from '@/types/stock';

interface MacroeconomicsCardProps {
  macroeconomics: {
    gdpGrowth: MacroIndicator;
    unemploymentRate: MacroIndicator;
    inflationRate: MacroIndicator;
    consumerSpending: MacroIndicator;
    fedFundsRate: MacroIndicator;
  };
}

const MacroeconomicsCard: React.FC<MacroeconomicsCardProps> = ({ macroeconomics }) => {
  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const indicators = [
    { key: 'gdpGrowth', label: 'GDP Growth' },
    { key: 'unemploymentRate', label: 'Unemployment Rate' },
    { key: 'inflationRate', label: 'Inflation Rate (CPI)' },
    { key: 'consumerSpending', label: 'Consumer Spending' },
    { key: 'fedFundsRate', label: 'Fed Funds Rate' },
  ] as const;

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Macroeconomic Indicators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {indicators.map(({ key, label }) => {
            const indicator = macroeconomics[key];
            return (
              <div key={key} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  {getTrendIcon(indicator.trend)}
                  <span className="font-medium text-gray-700">{label}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{indicator.period}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{indicator.value}</span>
                    <span className={`text-sm ${
                      indicator.change > 0 ? 'text-green-500' : 
                      indicator.change < 0 ? 'text-red-500' : 
                      'text-gray-500'
                    }`}>
                      {formatChange(indicator.change)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MacroeconomicsCard;
