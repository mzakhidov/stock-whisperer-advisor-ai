
import React, { useState, useEffect } from 'react';
import { StockData } from '@/types/stock';
import StockCard from './StockCard';
import MacroeconomicsCard from './MacroeconomicsCard';
import EarningsCard from './EarningsCard';
import PriceChart from './PriceChart';
import AboutSection from './AboutSection';
import BuySellReasons from './stock/BuySellReasons';
import RecentNewsSection from './stock/RecentNewsSection';
import RecommendationAnalysis from './stock/RecommendationAnalysis';
import { toast } from 'sonner';

interface EnhancedStockCardProps {
  stock: StockData;
}

const EnhancedStockCard: React.FC<EnhancedStockCardProps> = ({ stock }) => {
  const [showAnalysisLoading, setShowAnalysisLoading] = useState<boolean>(false);
  const [analysisExpanded, setAnalysisExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (stock.metrics.aiAnalysisFactors?.length === 0 && !showAnalysisLoading) {
      setShowAnalysisLoading(true);
      
      // Show toast for analysis generation
      toast.info("Generating detailed stock analysis...", {
        duration: 3000,
      });
      
      // After a certain time (to show the loading state)
      const timer = setTimeout(() => {
        setShowAnalysisLoading(false);
      }, 2500); // Show loading state for 2.5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [stock]);

  const aboutInfo = {
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
  
  const hasAiAnalysis = stock.metrics.aiAnalysisFactors && stock.metrics.aiAnalysisFactors.length > 0;

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
      
      {showAnalysisLoading ? (
        <div className="p-6 border-2 border-gray-200 rounded-lg shadow-md bg-gray-50 animate-pulse">
          <div className="h-6 w-1/3 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-full bg-gray-300 rounded mb-3"></div>
          <div className="h-4 w-5/6 bg-gray-300 rounded mb-6"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-300 rounded"></div>
            <div className="h-24 bg-gray-300 rounded"></div>
            <div className="h-24 bg-gray-300 rounded"></div>
            <div className="h-24 bg-gray-300 rounded"></div>
            <div className="h-24 bg-gray-300 rounded"></div>
            <div className="h-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      ) : hasAiAnalysis ? (
        <RecommendationAnalysis 
          stock={stock} 
          analysisFactors={stock.metrics.aiAnalysisFactors} 
        />
      ) : null}
      
      <StockCard stock={stock} />
      <EarningsCard earnings={earningsData} />
      <MacroeconomicsCard macroeconomics={macroData} />
      <RecentNewsSection news={stock.recentNews} />
    </div>
  );
};

export default EnhancedStockCard;
