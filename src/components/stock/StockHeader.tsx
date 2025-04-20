
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { getChangeColor } from '@/services/stockService';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { StockData } from '@/types/stock';

interface StockHeaderProps {
  stock: StockData;
}

const StockHeader: React.FC<StockHeaderProps> = ({ stock }) => {
  const priceChangeColor = getChangeColor(stock.change);

  return (
    <CardHeader className="bg-finance-navy text-white pb-2">
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="text-xl md:text-2xl font-bold">
            {stock.ticker}
          </CardTitle>
          <p className="text-gray-300 text-sm">{stock.name}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xl md:text-2xl font-bold">${stock.price.toFixed(2)}</span>
          <div className={`flex items-center ${priceChangeColor}`}>
            {stock.change >= 0 ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm">
              {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
    </CardHeader>
  );
};

export default StockHeader;
