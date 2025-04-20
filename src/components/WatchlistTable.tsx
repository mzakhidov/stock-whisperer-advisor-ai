
import React from 'react';
import { StockData } from '@/types/stock';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getChangeColor } from '@/services/stockService';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface WatchlistTableProps {
  stocks: StockData[];
  onSelectStock: (ticker: string) => void;
}

const WatchlistTable: React.FC<WatchlistTableProps> = ({ stocks, onSelectStock }) => {
  if (!stocks.length) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">No stocks in your watchlist yet.</p>
        <p className="text-sm text-gray-400 mt-2">Add stocks to your watchlist to track them here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead className="text-right">P/E Ratio</TableHead>
            <TableHead className="text-right">RSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => {
            const priceChangeColor = getChangeColor(stock.change);
            return (
              <TableRow 
                key={stock.ticker}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSelectStock(stock.ticker)}
              >
                <TableCell className="font-medium">{stock.ticker}</TableCell>
                <TableCell>{stock.name}</TableCell>
                <TableCell className="text-right">${stock.price.toFixed(2)}</TableCell>
                <TableCell className={`text-right ${priceChangeColor} flex items-center justify-end`}>
                  {stock.change >= 0 ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
                </TableCell>
                <TableCell className="text-right">{stock.peRatio?.toFixed(2) || 'N/A'}</TableCell>
                <TableCell className="text-right">{stock.rsi?.toFixed(2) || 'N/A'}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WatchlistTable;
