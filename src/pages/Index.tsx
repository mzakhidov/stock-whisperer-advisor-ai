
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StockSearch from '@/components/StockSearch';
import StockCardSkeleton from '@/components/StockCardSkeleton';
import { getStockData } from '@/services/stockService';
import { StockData } from '@/types/stock';
import { toast } from "sonner";
import { API_KEYS, checkApiKeys } from '@/services/apiConfig';
import EnhancedStockCard from '@/components/EnhancedStockCard';
import CompetitorsTable from '@/components/CompetitorsTable';
import WatchlistTable from '@/components/WatchlistTable';
import { Button } from '@/components/ui/button';
import { List, Bookmark } from 'lucide-react';

const Index = () => {
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasFetchedInitial, setHasFetchedInitial] = useState<boolean>(false);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState<StockData[]>([]);
  const [activeTab, setActiveTab] = useState("search");

  const fetchStockData = async (ticker: string) => {
    setIsLoading(true);
    try {
      setUsingMockData(!checkApiKeys());
      
      const data = await getStockData(ticker);
      if (data) {
        setSelectedStock(data);
        setHasFetchedInitial(true);
        setActiveTab("search");
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

  const addToWatchlist = () => {
    if (!selectedStock) return;
    
    if (watchlist.some(stock => stock.ticker === selectedStock.ticker)) {
      toast.error('This stock is already in your watchlist');
      return;
    }
    
    setWatchlist(prev => [...prev, selectedStock]);
    toast.success(`Added ${selectedStock.ticker} to your watchlist`);
  };

  useEffect(() => {
    if (!hasFetchedInitial) {
      fetchStockData('AAPL');
    }
  }, [hasFetchedInitial]);

  return (
    <div className="flex flex-col min-h-screen bg-finance-lightGray">
      <main className="flex-1 container py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="search" className="flex items-center gap-2">
              Search
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              My Watchlist
              {watchlist.length > 0 && (
                <span className="ml-2 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                  {watchlist.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <StockSearch onSelectStock={handleSelectStock} />
              </div>
              {selectedStock && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addToWatchlist}
                  className="flex-shrink-0"
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Add to Watchlist
                </Button>
              )}
            </div>
            
            {usingMockData && (
              <div className="mt-2 p-2 bg-amber-100 border border-amber-300 rounded text-amber-800 text-sm">
                <p>
                  <strong>⚠️ Using mock data:</strong> To display real stock data, add API keys for Alpha Vantage, 
                  Financial Modeling Prep, or Polygon in your environment variables.
                </p>
              </div>
            )}

            {!hasFetchedInitial && !isLoading ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">
                  Enter a stock ticker symbol or company name to see analysis
                </p>
              </div>
            ) : isLoading ? (
              <StockCardSkeleton />
            ) : selectedStock ? (
              <div className="space-y-6">
                <EnhancedStockCard stock={selectedStock} />
                <CompetitorsTable stock={selectedStock} />
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-lg text-gray-500">
                  No stock data found. Please try another ticker symbol.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="watchlist">
            <WatchlistTable 
              stocks={watchlist}
              onSelectStock={(ticker) => {
                handleSelectStock(ticker);
                setActiveTab("search");
              }}
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            AI Stock Whisperer provides recommendations based on multiple financial metrics.
            {usingMockData && " Currently using mock data for demonstration purposes."}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
