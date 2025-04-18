
import React from 'react';
import { StockData } from '@/types/stock';
import StockCard from './StockCard';
import MacroeconomicsCard from './MacroeconomicsCard';

interface EnhancedStockCardProps {
  stock: StockData;
}

const EnhancedStockCard: React.FC<EnhancedStockCardProps> = ({ stock }) => {
  const mockMacroData = {
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
  };

  return (
    <div className="space-y-6">
      <StockCard stock={stock} />
      <MacroeconomicsCard macroeconomics={mockMacroData} />
    </div>
  );
};

export default EnhancedStockCard;
