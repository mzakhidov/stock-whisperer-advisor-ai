
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle, Minus } from 'lucide-react';
import { EarningsResult } from '@/types/stock';

interface EarningsCardProps {
  earnings: EarningsResult[];
}

const EarningsCard: React.FC<EarningsCardProps> = ({ earnings }) => {
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Earnings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {earnings.map((result, index) => (
            <div
              key={index}
              className="flex flex-col space-y-2 p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">{result.period}</span>
                  <p className="font-medium">{result.date}</p>
                </div>
                {result.actualEPS > result.estimatedEPS ? (
                  <ArrowUpCircle className="h-6 w-6 text-green-500" />
                ) : result.actualEPS < result.estimatedEPS ? (
                  <ArrowDownCircle className="h-6 w-6 text-red-500" />
                ) : (
                  <Minus className="h-6 w-6 text-gray-500" />
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Actual EPS</span>
                  <p className="font-medium">${result.actualEPS.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Estimated EPS</span>
                  <p className="font-medium">${result.estimatedEPS.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Surprise:</span>
                <span className={`font-medium ${
                  result.surprise > 0 ? 'text-green-600' :
                  result.surprise < 0 ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {result.surprise > 0 ? '+' : ''}{result.surprise.toFixed(2)}%
                </span>
              </div>
              
              {result.guidance && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Next Quarter Guidance:</span>
                  <p className="font-medium">
                    ${result.guidance.low.toFixed(2)} - ${result.guidance.high.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsCard;
