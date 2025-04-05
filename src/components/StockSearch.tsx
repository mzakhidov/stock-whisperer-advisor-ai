import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { searchStocks } from '@/services/stockService';
import { StockData } from '@/types/stock';
import { toast } from "sonner";

interface StockSearchProps {
  onSelectStock: (ticker: string) => void;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSelectStock }) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleSearch = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchStocks(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Error searching stocks:', error);
        toast.error('Error searching for stocks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(handleSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSelectStock(query.trim());
      setShowResults(false);
    }
  };

  const handleSelect = (ticker: string) => {
    setQuery(ticker);
    onSelectStock(ticker);
    setShowResults(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            placeholder="Enter stock ticker or company name (e.g., AAPL, Apple)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            className="w-full pl-4 pr-10 py-2 border-2 border-gray-200 focus:border-finance-navy rounded-md"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-finance-navy rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <Button 
          type="submit" 
          className="bg-finance-navy hover:bg-blue-900 text-white"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      {showResults && results.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute z-10 left-0 right-0 mt-1 bg-white shadow-lg rounded-md overflow-hidden"
        >
          <ul className="divide-y divide-gray-100">
            {results.map((stock) => (
              <li 
                key={stock.ticker}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleSelect(stock.ticker)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-medium text-finance-navy">{stock.ticker}</span>
                    <span className="text-sm text-gray-500">{stock.name}</span>
                  </div>
                  <div 
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      stock.recommendation === 'Strong Buy' ? 'bg-rating-strongBuy text-white' :
                      stock.recommendation === 'Buy' ? 'bg-rating-buy text-white' :
                      stock.recommendation === 'Hold' ? 'bg-rating-hold text-black' :
                      stock.recommendation === 'Sell' ? 'bg-rating-sell text-white' :
                      'bg-rating-strongSell text-white'
                    }`}
                  >
                    {stock.recommendation}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StockSearch;
