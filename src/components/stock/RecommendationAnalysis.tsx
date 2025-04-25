
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StockData, MetricScore } from '@/types/stock';
import { getRecommendationColor, getRecommendationTextColor } from '@/services/stockService';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface RecommendationAnalysisProps {
  stock: StockData;
  analysisFactors: MetricScore[];
}

const RecommendationAnalysis: React.FC<RecommendationAnalysisProps> = ({ 
  stock, 
  analysisFactors 
}) => {
  const recommendationBgColor = getRecommendationColor(stock.recommendation);
  const recommendationTextColor = getRecommendationTextColor(stock.recommendation);

  // Group factors into categories
  const technicalFactors = analysisFactors.filter(f => 
    ['RSI', 'MA Cross', 'Volume', '50DMA', '200DMA'].includes(f.name));
  
  const fundamentalFactors = analysisFactors.filter(f => 
    ['P/E', 'Earnings', 'Growth Rate', 'Cash Flow', 'Debt Ratio'].includes(f.name));
  
  const sentimentFactors = analysisFactors.filter(f => 
    ['News', 'Analysts', 'Insider Trading', 'Social Sentiment'].includes(f.name));
  
  const otherFactors = analysisFactors.filter(f => 
    !technicalFactors.includes(f) && 
    !fundamentalFactors.includes(f) && 
    !sentimentFactors.includes(f));

  return (
    <Card className="w-full border-2 border-gray-200 shadow-md overflow-hidden">
      <CardHeader className="bg-gray-50 pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>AI Recommendation Analysis</span>
          <Badge className={`${recommendationBgColor} ${recommendationTextColor} text-base py-1 px-3`}>
            {stock.recommendation}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-6">
          {/* Description of the recommendation */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm">
              Our AI engine analyzed {analysisFactors.length} different factors to generate this recommendation,
              including technical indicators, fundamental metrics, and market sentiment data.
            </p>
          </div>

          {/* Key Factors */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2" />
              Key Factors Influencing This Recommendation
            </h3>
            
            {fundamentalFactors.length > 0 && (
              <>
                <h4 className="font-medium text-sm text-gray-500 mb-2">Fundamental Factors</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {fundamentalFactors.map(factor => (
                    <div 
                      key={factor.name}
                      className="bg-gray-50 p-2 rounded flex flex-col"
                      title={factor.description}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{factor.name}</span>
                        <Badge
                          className={factor.value >= 60 ? 'bg-green-500' : 
                                    factor.value >= 40 ? 'bg-yellow-500' : 'bg-red-500'}
                        >
                          {factor.value >= 60 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : factor.value < 40 ? (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          ) : null}
                          {factor.value}/100
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 line-clamp-1">{factor.description}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {technicalFactors.length > 0 && (
              <>
                <h4 className="font-medium text-sm text-gray-500 mb-2">Technical Factors</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {technicalFactors.map(factor => (
                    <div 
                      key={factor.name}
                      className="bg-gray-50 p-2 rounded flex flex-col"
                      title={factor.description}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{factor.name}</span>
                        <Badge
                          className={factor.value >= 60 ? 'bg-green-500' : 
                                    factor.value >= 40 ? 'bg-yellow-500' : 'bg-red-500'}
                        >
                          {factor.value}/100
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 line-clamp-1">{factor.description}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {sentimentFactors.length > 0 && (
              <>
                <h4 className="font-medium text-sm text-gray-500 mb-2">Sentiment & Market Factors</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {sentimentFactors.map(factor => (
                    <div 
                      key={factor.name}
                      className="bg-gray-50 p-2 rounded flex flex-col"
                      title={factor.description}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{factor.name}</span>
                        <Badge
                          className={factor.value >= 60 ? 'bg-green-500' : 
                                    factor.value >= 40 ? 'bg-yellow-500' : 'bg-red-500'}
                        >
                          {factor.value}/100
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 line-clamp-1">{factor.description}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {otherFactors.length > 0 && (
              <>
                <h4 className="font-medium text-sm text-gray-500 mb-2">Other Factors</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {otherFactors.map(factor => (
                    <div 
                      key={factor.name}
                      className="bg-gray-50 p-2 rounded flex flex-col"
                      title={factor.description}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{factor.name}</span>
                        <Badge
                          className={factor.value >= 60 ? 'bg-green-500' : 
                                    factor.value >= 40 ? 'bg-yellow-500' : 'bg-red-500'}
                        >
                          {factor.value}/100
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 line-clamp-1">{factor.description}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* Disclaimer */}
          <div className="mt-6 text-xs text-gray-500 italic">
            <p>Disclaimer: This analysis is generated by an AI recommendation engine and should not be considered financial advice. 
              Always do your own research before making investment decisions.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationAnalysis;
