
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StockData } from '@/types/stock';
import { getRecommendationColor, getRecommendationTextColor } from '@/services/stockService';
import StockHeader from './stock/StockHeader';
import RiskAssessment from './stock/RiskAssessment';
import StockMetrics from './stock/StockMetrics';
import AnalystRatings from './stock/AnalystRatings';
import FactorBubbles from './FactorBubbles';

interface StockCardProps {
  stock: StockData;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const recommendationBgColor = getRecommendationColor(stock.recommendation);
  const recommendationTextColor = getRecommendationTextColor(stock.recommendation);

  // Sort by value and get top 8 factors
  const allMetrics = [
    ...stock.metrics.fundamental,
    ...stock.metrics.technical,
    ...stock.metrics.sentiment
  ];
  const topFactors = [...allMetrics].sort((a, b) => b.value - a.value).slice(0, 8);

  return (
    <Card className="w-full border-2 border-gray-200 shadow-md overflow-hidden">
      <StockHeader stock={stock} />

      <div className={`${recommendationBgColor} ${recommendationTextColor} py-3 px-4 text-center`}>
        <span className="text-lg font-bold">Recommendation: {stock.recommendation}</span>
      </div>

      <CardContent className="pt-4">
        <div className="space-y-6">
          <RiskAssessment stock={stock} />
          <FactorBubbles factors={topFactors} />
          
          <Separator />
          <StockMetrics stock={stock} />
          
          <AnalystRatings stock={stock} />

          {/* Recent News Section - Making it more prominent */}
          {stock.recentNews && stock.recentNews.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-primary/20 my-6">
              <h3 className="text-xl font-bold mb-4 text-primary">Recent News</h3>
              <div className="space-y-3">
                {stock.recentNews.map((news, index) => (
                  <div key={index} className="border-l-4 pl-3 py-2 border-gray-300 hover:bg-gray-50 transition-colors">
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
