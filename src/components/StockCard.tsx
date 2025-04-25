
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
    ...(stock.metrics.fundamental || []),
    ...(stock.metrics.technical || []),
    ...(stock.metrics.sentiment || []),
    ...(stock.metrics.aiAnalysisFactors || []),
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
