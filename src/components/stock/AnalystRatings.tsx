
import React from 'react';
import { StockData } from '@/types/stock';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Separator } from '@/components/ui/separator';

interface AnalystRatingsProps {
  stock: StockData;
}

const AnalystRatings: React.FC<AnalystRatingsProps> = ({ stock }) => {
  const getRecommendationClassName = (recommendation: string) => {
    switch(recommendation) {
      case 'Strong Buy': return 'text-rating-strongBuy font-semibold';
      case 'Buy': return 'text-rating-buy font-semibold';
      case 'Hold': return 'text-rating-hold font-semibold';
      case 'Sell': return 'text-rating-sell font-semibold';
      case 'Strong Sell': return 'text-rating-strongSell font-semibold';
      default: return '';
    }
  };

  const prepareAnalystRatingsData = () => {
    if (!stock.analystRatings) return [];

    return [
      { name: 'Buy', value: stock.analystRatings.buy, color: '#22c55e' },
      { name: 'Hold', value: stock.analystRatings.hold, color: '#f59e0b' },
      { name: 'Sell', value: stock.analystRatings.sell, color: '#ef4444' },
    ].filter(item => item.value > 0);
  };

  const analystRatingsData = prepareAnalystRatingsData();
  const mockAnalystDetails = stock.analystDetails || [
    {
      name: "Sarah Johnson",
      company: "Morgan Stanley",
      recommendation: "Buy",
      priceTarget: stock.price * 1.15,
      date: "2025-03-15"
    },
    {
      name: "Michael Chen",
      company: "Goldman Sachs",
      recommendation: stock.recommendation,
      priceTarget: stock.price * 1.12,
      date: "2025-03-10"
    },
    {
      name: "Emily Williams",
      company: "JP Morgan",
      recommendation: "Hold",
      priceTarget: stock.price * 1.05,
      date: "2025-03-05"
    },
    {
      name: "Robert Garcia",
      company: "Bank of America",
      recommendation: stock.recommendation === "Strong Buy" ? "Buy" : stock.recommendation,
      priceTarget: stock.price * 1.08,
      date: "2025-02-28"
    },
    {
      name: "Jennifer Liu",
      company: "Citigroup",
      recommendation: stock.recommendation === "Sell" ? "Hold" : stock.recommendation,
      priceTarget: stock.price * 1.10,
      date: "2025-02-22"
    }
  ];

  if (!stock.analystRatings || analystRatingsData.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-2 border-purple-200 my-6">
      <h3 className="text-xl font-bold mb-4 text-[#9b87f5]">Analyst Ratings</h3>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analystRatingsData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {analystRatingsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} analysts`, 'Count']}
                contentStyle={{ background: 'white', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2 mt-4 md:mt-0">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#22c55e] rounded-full mr-2"></div>
            <span>Buy: {stock.analystRatings.buy} analysts</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#f59e0b] rounded-full mr-2"></div>
            <span>Hold: {stock.analystRatings.hold} analysts</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#ef4444] rounded-full mr-2"></div>
            <span>Sell: {stock.analystRatings.sell} analysts</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-[#9b87f5]">Analyst Price Targets</h3>
        <div className="rounded-md border-2 border-purple-200 shadow-lg">
          <Table>
            <TableHeader className="bg-purple-50">
              <TableRow>
                <TableHead>Analyst</TableHead>
                <TableHead>Firm</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Price Target</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAnalystDetails.map((analyst, index) => (
                <TableRow key={index} className="hover:bg-purple-50">
                  <TableCell className="font-medium">{analyst.name}</TableCell>
                  <TableCell>{analyst.company}</TableCell>
                  <TableCell className={getRecommendationClassName(analyst.recommendation)}>
                    {analyst.recommendation}
                  </TableCell>
                  <TableCell className="text-right">${analyst.priceTarget.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{analyst.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>
              Latest analyst price targets and recommendations for {stock.ticker}
            </TableCaption>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AnalystRatings;
