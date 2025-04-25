
import React from 'react';
import { StockData } from '@/types/stock';
import StockCard from './StockCard';
import MacroeconomicsCard from './MacroeconomicsCard';
import EarningsCard from './EarningsCard';
import PriceChart from './PriceChart';
import AboutSection from './AboutSection';
import BuySellReasons from './stock/BuySellReasons';

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
    description: stock.description || "No company description available",
    industry: stock.industry || "Technology",
    mainProducts: stock.mainProducts || ["Various Products"]
  };

  // Generate mock earnings history data if not present
  const earningsData = stock.earningsHistory || [
    {
      date: "2025-01-30",
      period: "Q1 2025",
      actualEPS: 1.88,
      estimatedEPS: 1.82,
      surprise: 3.29,
      guidance: {
        low: 1.92,
        high: 2.05
      }
    },
    {
      date: "2024-10-28",
      period: "Q4 2024",
      actualEPS: 1.75,
      estimatedEPS: 1.78,
      surprise: -1.69,
      guidance: null
    },
    {
      date: "2024-07-25",
      period: "Q3 2024",
      actualEPS: 1.69,
      estimatedEPS: 1.65,
      surprise: 2.42,
      guidance: {
        low: 1.70,
        high: 1.80
      }
    },
    {
      date: "2024-04-30",
      period: "Q2 2024",
      actualEPS: 1.52,
      estimatedEPS: 1.50,
      surprise: 1.33,
      guidance: {
        low: 1.60,
        high: 1.70
      }
    }
  ];

  // Generate mock historical prices data if not present
  const priceData = stock.historicalPrices || Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    
    // Generate somewhat realistic price movements
    const basePrice = stock.price * 0.8;
    const trendFactor = 1 + (i / 100); // Upward trend
    const volatility = (Math.random() - 0.5) * 0.1; // Random fluctuation
    
    return {
      date: date.toISOString().split('T')[0],
      price: basePrice * trendFactor * (1 + volatility),
      volume: Math.floor(Math.random() * 10000000) + 5000000
    };
  });

  // Generate mock macroeconomics data if not present
  const macroData = stock.macroeconomics || {
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
      <AboutSection 
        name={stock.name}
        description={aboutInfo.description}
        industry={aboutInfo.industry}
        mainProducts={aboutInfo.mainProducts}
      />
      <BuySellReasons stock={stock} />
      <PriceChart data={priceData} />
      <StockCard stock={stock} />
      <EarningsCard earnings={earningsData} />
      <MacroeconomicsCard macroeconomics={macroData} />
    </div>
  );
};

export default EnhancedStockCard;
