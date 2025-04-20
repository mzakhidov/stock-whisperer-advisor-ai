
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { StockData } from '@/types/stock';

interface CompetitorsTableProps {
  stock: StockData;
}

const CompetitorsTable = ({ stock }: CompetitorsTableProps) => {
  // Mock data for competitors based on the stock's industry
  const competitors = {
    'Technology': [
      { ticker: 'MSFT', name: 'Microsoft', price: 402.75, peRatio: 37.2, rsi: 58.4, change: 1.2 },
      { ticker: 'GOOGL', name: 'Alphabet', price: 157.45, peRatio: 25.1, rsi: 52.7, change: -0.8 },
      { ticker: 'META', name: 'Meta', price: 505.32, peRatio: 34.8, rsi: 61.2, change: 2.1 }
    ],
    'Consumer Electronics': [
      { ticker: 'SONY', name: 'Sony', price: 86.24, peRatio: 18.5, rsi: 48.9, change: -0.5 },
      { ticker: 'SSNLF', name: 'Samsung', price: 45.67, peRatio: 15.2, rsi: 51.3, change: 0.7 },
      { ticker: 'HPQ', name: 'HP', price: 29.85, peRatio: 12.8, rsi: 45.6, change: -1.1 }
    ],
    'E-Commerce': [
      { ticker: 'WMT', name: 'Walmart', price: 162.38, peRatio: 28.4, rsi: 54.2, change: 0.9 },
      { ticker: 'TGT', name: 'Target', price: 168.92, peRatio: 24.6, rsi: 49.8, change: -0.4 },
      { ticker: 'COST', name: 'Costco', price: 731.45, peRatio: 45.8, rsi: 62.3, change: 1.5 }
    ],
    // Add more industries as needed
  };

  const industryCompetitors = competitors[stock.industry as keyof typeof competitors] || [];

  if (!industryCompetitors.length) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Industry Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead className="text-right">P/E Ratio</TableHead>
              <TableHead className="text-right">RSI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { 
                ticker: stock.ticker, 
                name: stock.name, 
                price: stock.price, 
                peRatio: stock.peRatio || '-', 
                rsi: stock.rsi || '-',
                change: stock.change
              },
              ...industryCompetitors
            ].map((company) => (
              <TableRow key={company.ticker}>
                <TableCell className="font-medium">{company.ticker}</TableCell>
                <TableCell>{company.name}</TableCell>
                <TableCell className="text-right">
                  ${company.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`flex items-center justify-end ${company.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {company.change >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(company.change).toFixed(2)}%
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {typeof company.peRatio === 'number' ? company.peRatio.toFixed(1) : company.peRatio}
                </TableCell>
                <TableCell className="text-right">
                  {typeof company.rsi === 'number' ? company.rsi.toFixed(1) : company.rsi}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CompetitorsTable;
