import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StockData } from '@/types/stock';
import { getChangeColor, getRecommendationColor, getRecommendationTextColor } from '@/services/stockService';
import MetricBar from './MetricBar';
import FactorBubbles from './FactorBubbles';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StockCardProps {
  stock: StockData;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const priceChangeColor = getChangeColor(stock.change);
  const recommendationBgColor = getRecommendationColor(stock.recommendation);
  const recommendationTextColor = getRecommendationTextColor(stock.recommendation);

  // Combine all metrics to find the top factors by score
  const allMetrics = [
    ...stock.metrics.fundamental,
    ...stock.metrics.technical,
    ...stock.metrics.sentiment
  ];
  // Sort by value and get top 8 factors
  const topFactors = [...allMetrics].sort((a, b) => b.value - a.value).slice(0, 8);

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
          
          {/* Key Metrics Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Key Metrics Analysis</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-medium mb-2">Fundamental Factors</h4>
                <div className="space-y-2">
                  {stock.metrics.fundamental.map((metric) => (
                    <MetricBar key={metric.name} metric={metric} />
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-2">Technical Indicators</h4>
                <div className="space-y-2">
                  {stock.metrics.technical.map((metric) => (
                    <MetricBar key={metric.name} metric={metric} />
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-2">Market Sentiment</h4>
                <div className="space-y-2">
                  {stock.metrics.sentiment.map((metric) => (
                    <MetricBar key={metric.name} metric={metric} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
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
          
          {/* Analyst Ratings Section */}
          {stock.analystRatings && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Analyst Ratings</h3>
                <div className="flex h-4 mb-1">
                  {stock.analystRatings.buy > 0 && (
                    <div 
                      style={{ width: `${stock.analystRatings.buy / (stock.analystRatings.buy + stock.analystRatings.hold + stock.analystRatings.sell) * 100}%` }}
                      className="bg-finance-green"
                    />
                  )}
                  {stock.analystRatings.hold > 0 && (
                    <div 
                      style={{ width: `${stock.analystRatings.hold / (stock.analystRatings.buy + stock.analystRatings.hold + stock.analystRatings.sell) * 100}%` }}
                      className="bg-rating-hold"
                    />
                  )}
                  {stock.analystRatings.sell > 0 && (
                    <div 
                      style={{ width: `${stock.analystRatings.sell / (stock.analystRatings.buy + stock.analystRatings.hold + stock.analystRatings.sell) * 100}%` }}
                      className="bg-finance-red"
                    />
                  )}
                </div>
                <div className="flex justify-between text-xs text-gray-500 pt-1">
                  <span>Buy: {stock.analystRatings.buy}</span>
                  <span>Hold: {stock.analystRatings.hold}</span>
                  <span>Sell: {stock.analystRatings.sell}</span>
                </div>
              </div>
            </>
          )}
          
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
