
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StockData, AnalystDetail } from '@/types/stock';
import { getChangeColor, getRecommendationColor, getRecommendationTextColor } from '@/services/stockService';
import MetricBar from './MetricBar';
import FactorBubbles from './FactorBubbles';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StockCardProps {
  stock: StockData;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const priceChangeColor = getChangeColor(stock.change);
  const recommendationBgColor = getRecommendationColor(stock.recommendation);
  const recommendationTextColor = getRecommendationTextColor(stock.recommendation);

  // Generate mock analyst details if not provided in stock data
  const mockAnalystDetails: AnalystDetail[] = stock.analystDetails || [
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

  // Combine all metrics to find the top factors by score
  const allMetrics = [
    ...stock.metrics.fundamental,
    ...stock.metrics.technical,
    ...stock.metrics.sentiment
  ];
  // Sort by value and get top 8 factors
  const topFactors = [...allMetrics].sort((a, b) => b.value - a.value).slice(0, 8);

  // Prepare data for pie chart
  const prepareAnalystRatingsData = () => {
    if (!stock.analystRatings) return [];

    return [
      { name: 'Buy', value: stock.analystRatings.buy, color: '#22c55e' }, // finance-green
      { name: 'Hold', value: stock.analystRatings.hold, color: '#f59e0b' }, // rating-hold
      { name: 'Sell', value: stock.analystRatings.sell, color: '#ef4444' }, // finance-red
    ].filter(item => item.value > 0);
  };

  const analystRatingsData = prepareAnalystRatingsData();

  // Function to get recommendation color for table rows
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

  // Function to get metric color class
  const getMetricColorClass = (value: number) => {
    if (value >= 80) return 'bg-rating-strongBuy text-white';
    if (value >= 60) return 'bg-rating-buy text-white';
    if (value >= 40) return 'bg-rating-hold text-black';
    if (value >= 20) return 'bg-rating-sell text-white';
    return 'bg-rating-strongSell text-white';
  };

  // Function to format metrics value with at most 1 decimal place
  const formatMetricValue = (value: number) => {
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  };

  return (
    <Card className="w-full border-2 border-gray-200 shadow-md overflow-hidden">
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

      <div className={`${recommendationBgColor} ${recommendationTextColor} py-3 px-4 text-center`}>
        <span className="text-lg font-bold">Recommendation: {stock.recommendation}</span>
      </div>

      <CardContent className="pt-4">
        <div className="space-y-6">
          {/* Bubble visualization of top factors */}
          <FactorBubbles factors={topFactors} />
          
          <Separator />
          
          {/* Key Metrics Section - Now as Tables */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Key Metrics Analysis</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium mb-3">Fundamental Factors</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Indicator</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead className="hidden md:table-cell">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stock.metrics.fundamental.map((metric) => (
                        <TableRow key={metric.name}>
                          <TableCell className="font-medium">{metric.name}</TableCell>
                          <TableCell>
                            <div className="flex justify-center items-center">
                              <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${getMetricColorClass(metric.value)}`}>
                                <span className="text-lg font-bold">{formatMetricValue(metric.value)}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{metric.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-3">Technical Indicators</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Indicator</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead className="hidden md:table-cell">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stock.metrics.technical.map((metric) => (
                        <TableRow key={metric.name}>
                          <TableCell className="font-medium">{metric.name}</TableCell>
                          <TableCell>
                            <div className="flex justify-center items-center">
                              <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${getMetricColorClass(metric.value)}`}>
                                <span className="text-lg font-bold">{formatMetricValue(metric.value)}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{metric.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-3">Market Sentiment</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Indicator</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead className="hidden md:table-cell">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stock.metrics.sentiment.map((metric) => (
                        <TableRow key={metric.name}>
                          <TableCell className="font-medium">{metric.name}</TableCell>
                          <TableCell>
                            <div className="flex justify-center items-center">
                              <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${getMetricColorClass(metric.value)}`}>
                                <span className="text-lg font-bold">{formatMetricValue(metric.value)}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{metric.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
          
          {/* Detailed Stats Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Detailed Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">P/E Ratio</span>
                  <p className="font-medium">{stock.peRatio?.toFixed(2) || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">RSI (14)</span>
                  <p className="font-medium">{stock.rsi?.toFixed(2) || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">50-Day MA</span>
                  <p className="font-medium">${stock.fiftyDayMA?.toFixed(2) || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">200-Day MA</span>
                  <p className="font-medium">${stock.twoHundredDayMA?.toFixed(2) || 'N/A'}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Growth Rate (YoY)</span>
                  <p className="font-medium">{stock.growthRate !== null ? `${stock.growthRate}%` : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Recent Earnings</span>
                  <p className={`font-medium ${
                    stock.recentEarnings === 'beat' ? 'text-finance-green' :
                    stock.recentEarnings === 'missed' ? 'text-finance-red' :
                    ''
                  }`}>
                    {stock.recentEarnings === 'beat' ? 'Beat Expectations' :
                     stock.recentEarnings === 'met' ? 'Met Expectations' :
                     stock.recentEarnings === 'missed' ? 'Missed Expectations' :
                     'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Market Sentiment</span>
                  <p className={`font-medium ${
                    stock.marketSentiment === 'Bullish' ? 'text-finance-green' :
                    stock.marketSentiment === 'Bearish' ? 'text-finance-red' :
                    ''
                  }`}>
                    {stock.marketSentiment || 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">CEO Rating</span>
                  <p className="font-medium">{stock.ceoRating ? `${stock.ceoRating}/5` : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Analyst Ratings Section - now using Pie Chart */}
          {stock.analystRatings && analystRatingsData.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Analyst Ratings</h3>
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
              </div>
            </>
          )}
          
          {/* Analyst Details Table Section */}
          <Separator className="my-6" />
          <div>
            <h3 className="text-lg font-semibold mb-3">Analyst Price Targets</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
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
                    <TableRow key={index}>
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
          
          {/* Recent News Section */}
          {stock.recentNews && stock.recentNews.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Recent News</h3>
                <div className="space-y-3">
                  {stock.recentNews.map((news, index) => (
                    <div key={index} className="border-l-4 pl-3 py-1 border-gray-300">
                      <p className="font-medium">{news.headline}</p>
                      <div className="flex justify-between text-sm">
                        <span className={`${
                          news.sentiment === 'positive' ? 'text-finance-green' :
                          news.sentiment === 'negative' ? 'text-finance-red' :
                          'text-gray-500'
                        }`}>
                          {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)} sentiment
                        </span>
                        <span className="text-gray-500">{news.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Disclaimer */}
          <div className="mt-6 text-xs text-gray-500 italic">
            <p>Disclaimer: This information is for educational purposes only and should not be considered financial advice. Always do your own research before making investment decisions.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockCard;
