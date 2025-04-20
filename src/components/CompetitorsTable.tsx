
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
  // Expanded mock data for competitors based on various industries
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
    'Software': [
      { ticker: 'CRM', name: 'Salesforce', price: 295.32, peRatio: 42.8, rsi: 57.3, change: 1.8 },
      { ticker: 'ADBE', name: 'Adobe', price: 504.62, peRatio: 40.1, rsi: 56.8, change: 0.6 },
      { ticker: 'INTU', name: 'Intuit', price: 624.85, peRatio: 55.7, rsi: 62.1, change: 2.3 }
    ],
    'Retail': [
      { ticker: 'AMZN', name: 'Amazon', price: 182.45, peRatio: 64.3, rsi: 63.5, change: 2.1 },
      { ticker: 'HD', name: 'Home Depot', price: 342.18, peRatio: 23.1, rsi: 51.2, change: -0.3 },
      { ticker: 'TJX', name: 'TJX Companies', price: 101.75, peRatio: 27.6, rsi: 55.7, change: 0.9 }
    ],
    'Financial Services': [
      { ticker: 'JPM', name: 'JPMorgan Chase', price: 198.52, peRatio: 12.1, rsi: 53.4, change: 0.7 },
      { ticker: 'BAC', name: 'Bank of America', price: 40.25, peRatio: 11.2, rsi: 48.9, change: -0.4 },
      { ticker: 'GS', name: 'Goldman Sachs', price: 445.30, peRatio: 15.8, rsi: 52.1, change: 0.5 }
    ]
  };

  // Default industry competitors for if no match is found
  const defaultCompetitors = [
    { ticker: 'MSFT', name: 'Microsoft', price: 402.75, peRatio: 37.2, rsi: 58.4, change: 1.2 },
    { ticker: 'AMZN', name: 'Amazon', price: 182.45, peRatio: 64.3, rsi: 63.5, change: 2.1 },
    { ticker: 'JPM', name: 'JPMorgan Chase', price: 198.52, peRatio: 12.1, rsi: 53.4, change: 0.7 },
    { ticker: 'WMT', name: 'Walmart', price: 162.38, peRatio: 28.4, rsi: 54.2, change: 0.9 }
  ];

  let industryCompetitors = competitors[stock.industry as keyof typeof competitors] || [];
  
  // If no industry match is found, use default competitors
  if (!industryCompetitors.length) {
    industryCompetitors = defaultCompetitors;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Industry Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
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
                    ${typeof company.price === 'number' ? company.price.toFixed(2) : company.price}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`flex items-center justify-end ${company.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {company.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {typeof company.change === 'number' ? Math.abs(company.change).toFixed(2) : company.change}%
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
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorsTable;
