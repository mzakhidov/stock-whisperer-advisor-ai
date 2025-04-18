import React from 'react';
import { StockData } from '@/types/stock';
import StockCard from './StockCard';
import MacroeconomicsCard from './MacroeconomicsCard';
import EarningsCard from './EarningsCard';
import PriceChart from './PriceChart';
import AboutSection from './AboutSection';

interface EnhancedStockCardProps {
  stock: StockData;
}

const EnhancedStockCard: React.FC<EnhancedStockCardProps> = ({ stock }) => {
  const mockDescription = {
    'AAPL': {
      description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers cutting-edge technology products and services, including the iPhone, iPad, Mac, Apple Watch, and Apple TV.",
      industry: "Consumer Electronics",
      mainProducts: ["iPhone", "Mac", "iPad", "Wearables", "Services"]
    },
    'MSFT': {
      description: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates through cloud computing, software licensing, and hardware manufacturing.",
      industry: "Software - Infrastructure",
      mainProducts: ["Azure", "Windows", "Office 365", "LinkedIn", "Xbox"]
    },
    // Add more mock descriptions as needed
  };

  const aboutInfo = mockDescription[stock.ticker as keyof typeof mockDescription] || {
    description: stock.description,
    industry: stock.industry,
    mainProducts: stock.mainProducts
  };

  return (
    <div className="space-y-6">
      <AboutSection 
        name={stock.name}
        description={aboutInfo.description}
        industry={aboutInfo.industry}
        mainProducts={aboutInfo.mainProducts}
      />
      <PriceChart data={stock.historicalPrices} />
      <StockCard stock={stock} />
      <EarningsCard earnings={stock.earningsHistory} />
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
