import React, { useState, useEffect } from 'react';
import StockSearch from '@/components/StockSearch';
import StockCard from '@/components/StockCard';
import StockCardSkeleton from '@/components/StockCardSkeleton';
import { getStockData } from '@/services/stockService';
import { StockData } from '@/types/stock';
import { toast } from "sonner";
import { API_KEYS, checkApiKeys } from '@/services/apiConfig';
import EnhancedStockCard from '@/components/EnhancedStockCard';
import CompetitorsTable from '@/components/CompetitorsTable';

const Index = () => {
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasFetchedInitial, setHasFetchedInitial] = useState<boolean>(false);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);

  const fetchStockData = async (ticker: string) => {
    setIsLoading(true);
    try {
      setUsingMockData(!checkApiKeys());
      
      const data = await getStockData(ticker);
      if (data) {
        setSelectedStock(data);
        setHasFetchedInitial(true);
      } else {
        if (hasFetchedInitial) {
          setSelectedStock(null);
        }
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      toast.error('Error fetching stock data. Please try again.');
      if (hasFetchedInitial) {
        setSelectedStock(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectStock = (ticker: string) => {
    fetchStockData(ticker);
  };

  useEffect(() => {
    if (!hasFetchedInitial) {
      fetchStockData('AAPL');
    }
  }, [hasFetchedInitial]);

  return (
    <div className="flex flex-col min-h-screen bg-finance-lightGray">
      <main className="flex-1 container py-8 px-4">
        <div className="mb-8">
          <StockSearch onSelectStock={handleSelectStock} />
          
          {usingMockData && (
            <div className="mt-2 p-2 bg-amber-100 border border-amber-300 rounded text-amber-800 text-sm">
              <p>
                <strong>⚠️ Using mock data:</strong> To display real stock data, add API keys for Alpha Vantage, 
                Financial Modeling Prep, or Polygon in your environment variables.
              </p>
            </div>
          )}
        </div>
        
        {!hasFetchedInitial && !isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">
              Enter a stock ticker symbol or company name to see analysis
            </p>
          </div>
        ) : isLoading ? (
          <StockCardSkeleton />
        ) : selectedStock ? (
          <>
            <EnhancedStockCard stock={selectedStock} />
            <CompetitorsTable stock={selectedStock} />
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-lg text-gray-500">
              No stock data found. Please try another ticker symbol.
            </p>
          </div>
        )}
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Stock Whisperer provides recommendations based on multiple financial metrics.
            {usingMockData && " Currently using mock data for demonstration purposes."}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
