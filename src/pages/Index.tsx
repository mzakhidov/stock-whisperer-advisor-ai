import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StockSearch from '@/components/StockSearch';
import StockCard from '@/components/StockCard';
import StockCardSkeleton from '@/components/StockCardSkeleton';
import { getStockData } from '@/services/stockService';
import { StockData } from '@/types/stock';
import { toast } from "sonner";

const Index = () => {
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasFetchedInitial, setHasFetchedInitial] = useState<boolean>(false);

  const fetchStockData = async (ticker: string) => {
    setIsLoading(true);
    try {
      const data = await getStockData(ticker);
      if (data) {
        setSelectedStock(data);
        setHasFetchedInitial(true);
      } else {
        // If null was returned, the error toast is already shown by the service
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

  // Default to loading AAPL on first render
  useEffect(() => {
    if (!hasFetchedInitial) {
      fetchStockData('AAPL');
    }
  }, [hasFetchedInitial]);

  return (
    <div className="flex flex-col min-h-screen bg-finance-lightGray">
      <Header />
      
      <main className="flex-1 container py-8 px-4">
        <div className="mb-8">
          <StockSearch onSelectStock={handleSelectStock} />
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
          <StockCard stock={selectedStock} />
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
            All data shown is simulated for demonstration purposes.
          </p>
        </div>
      </main>
      
      <footer className="bg-finance-navy text-white py-4 text-center text-sm">
        <p>© 2025 Stock Whisperer | Smart analysis for smarter investing</p>
      </footer>
    </div>
  );
};

export default Index;
