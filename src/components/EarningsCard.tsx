
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpCircle, ArrowDownCircle, Minus } from 'lucide-react';
import { EarningsResult } from '@/types/stock';

interface EarningsCardProps {
  earnings: EarningsResult[] | undefined;
}

const EarningsCard: React.FC<EarningsCardProps> = ({ earnings }) => {
  // If earnings data is undefined or empty, show placeholder message
  if (!earnings || earnings.length === 0) {
    return (
      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No earnings data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Earnings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actual EPS</TableHead>
                <TableHead className="text-right">Est. EPS</TableHead>
                <TableHead className="text-right">Surprise</TableHead>
                <TableHead className="text-right">Guidance</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earnings.map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{result.period}</TableCell>
                  <TableCell>{result.date}</TableCell>
                  <TableCell className="text-right">${result.actualEPS.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${result.estimatedEPS.toFixed(2)}</TableCell>
                  <TableCell className={`text-right ${
                    result.surprise > 0 ? 'text-green-600' :
                    result.surprise < 0 ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {result.surprise > 0 ? '+' : ''}{result.surprise.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {result.guidance ? 
                      `$${result.guidance.low.toFixed(2)} - $${result.guidance.high.toFixed(2)}` : 
                      'N/A'}
                  </TableCell>
                  <TableCell>
                    {result.actualEPS > result.estimatedEPS ? (
                      <ArrowUpCircle className="h-5 w-5 text-green-500" />
                    ) : result.actualEPS < result.estimatedEPS ? (
                      <ArrowDownCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Minus className="h-5 w-5 text-gray-500" />
                    )}
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

export default EarningsCard;
