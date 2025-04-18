import React from 'react';
import { StockData } from '@/types/stock';
import StockCard from './StockCard';
import MacroeconomicsCard from './MacroeconomicsCard';
import EarningsCard from './EarningsCard';
import PriceChart from './PriceChart';

interface EnhancedStockCardProps {
  stock: StockData;
}

const EnhancedStockCard: React.FC<EnhancedStockCardProps> = ({ stock }) => {
  const mockEarnings = [
    {
      date: "2024-03-15",
      period: "Q1 2024",
      actualEPS: 1.45,
      estimatedEPS: 1.30,
      surprise: 11.54,
      guidance: { low: 1.40, high: 1.55 }
    },
    {
      date: "2023-12-15",
      period: "Q4 2023",
      actualEPS: 1.38,
      estimatedEPS: 1.35,
      surprise: 2.22,
      guidance: { low: 1.35, high: 1.50 }
    },
    {
      date: "2023-09-15",
      period: "Q3 2023",
      actualEPS: 1.32,
      estimatedEPS: 1.40,
      surprise: -5.71,
      guidance: { low: 1.30, high: 1.45 }
    },
    {
      date: "2023-06-15",
      period: "Q2 2023",
      actualEPS: 1.28,
      estimatedEPS: 1.25,
      surprise: 2.40,
      guidance: { low: 1.25, high: 1.40 }
    }
  ];

  const mockPrices = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      price: stock.price * (0.95 + Math.random() * 0.1),
      volume: Math.floor(Math.random() * 1000000) + 500000
    };
  });

  return (
    <div className="space-y-6">
      <StockCard stock={stock} />
      <PriceChart data={stock.historicalPrices || mockPrices} />
      <EarningsCard earnings={stock.earningsHistory || mockEarnings} />
      <MacroeconomicsCard macroeconomics={stock.macroeconomics || {
        gdpGrowth: {
          name: 'GDP Growth',
          value: '2.5%',
          change: 0.3,
          trend: 'up' as const,
          period: 'Q4 2024'
        },
        unemploymentRate: {
          name: 'Unemployment Rate',
          value: '3.8%',
          change: -0.2,
          trend: 'down' as const,
          period: 'Mar 2024'
        },
        inflationRate: {
          name: 'Inflation Rate',
          value: '3.1%',
          change: -0.4,
          trend: 'down' as const,
          period: 'Mar 2024'
        },
        consumerSpending: {
          name: 'Consumer Spending',
          value: '+0.8%',
          change: 0.2,
          trend: 'up' as const,
          period: 'Feb 2024'
        },
        fedFundsRate: {
          name: 'Fed Funds Rate',
          value: '5.50%',
          change: 0,
          trend: 'neutral' as const,
          period: 'Mar 2024'
        }
      }} />
    </div>
  );
};

export default EnhancedStockCard;
