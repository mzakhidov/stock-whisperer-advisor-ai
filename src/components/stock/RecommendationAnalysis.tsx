
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StockData, MetricScore } from '@/types/stock';
import { getRecommendationColor, getRecommendationTextColor } from '@/services/stockService';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RecommendationAnalysisProps {
  stock: StockData;
  analysisFactors: MetricScore[];
}

const RecommendationAnalysis: React.FC<RecommendationAnalysisProps> = ({ 
  stock, 
  analysisFactors 
}) => {
  const [showAll, setShowAll] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const recommendationBgColor = getRecommendationColor(stock.recommendation);
  const recommendationTextColor = getRecommendationTextColor(stock.recommendation);

  // Group factors into categories
  const technicalFactors = analysisFactors.filter(f => 
    ['RSI', 'Moving Average Cross', 'Volume', 'Price To MA', '50DMA', '200DMA'].includes(f.name));
  
  const fundamentalFactors = analysisFactors.filter(f => 
    ['PE Ratio', 'Annual Growth Rate', 'Analyst Price Projection', 'Earnings Beat History', 
     'Company Guidance', 'Analyst Rating', 'Cash Flow', 'Debt Ratio'].includes(f.name));
  
  const sentimentFactors = analysisFactors.filter(f => 
    ['CEO Strength', 'Latest Company News', 'Insider Trading', 
     'Market Sentiment', 'Social Sentiment'].includes(f.name));
     
  const marketFactors = analysisFactors.filter(f => 
    ['VIX Rate', 'Bond Yield', 'Consumer Sentiment', 'Consumer Spending'].includes(f.name));
  
  const macroFactors = analysisFactors.filter(f => 
    ['Macroeconomics', 'Inflation Rate', 'Unemployment Rate', 'GDP Growth Rate', 
     'Fed Funds Rate'].includes(f.name));
  
  const otherFactors = analysisFactors.filter(f => 
    !technicalFactors.includes(f) && 
    !fundamentalFactors.includes(f) && 
    !sentimentFactors.includes(f) &&
    !marketFactors.includes(f) &&
    !macroFactors.includes(f));
    
  const displayedFactors = showAll ? analysisFactors : analysisFactors.slice(0, 12);
  
  // Filter factors based on active filter
  const getFilteredFactors = () => {
    if (!activeFilter) return displayedFactors;
    
    switch (activeFilter) {
      case 'technical': return technicalFactors;
      case 'fundamental': return fundamentalFactors;
      case 'sentiment': return sentimentFactors;
      case 'market': return marketFactors;
      case 'macro': return macroFactors;
      default: return displayedFactors;
    }
  };
  
  const filteredFactors = getFilteredFactors();

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
              including technical indicators, fundamental metrics, market sentiment, and macroeconomic data.
            </p>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={!activeFilter ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setActiveFilter(null)}
            >
              All
            </Badge>
            <Badge 
              variant={activeFilter === 'technical' ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setActiveFilter('technical')}
            >
              Technical ({technicalFactors.length})
            </Badge>
            <Badge 
              variant={activeFilter === 'fundamental' ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setActiveFilter('fundamental')}
            >
              Fundamental ({fundamentalFactors.length})
            </Badge>
            <Badge 
              variant={activeFilter === 'sentiment' ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setActiveFilter('sentiment')}
            >
              Sentiment ({sentimentFactors.length})
            </Badge>
            <Badge 
              variant={activeFilter === 'market' ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setActiveFilter('market')}
            >
              Market ({marketFactors.length})
            </Badge>
            <Badge 
              variant={activeFilter === 'macro' ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setActiveFilter('macro')}
            >
              Macroeconomic ({macroFactors.length})
            </Badge>
          </div>

          {/* Key Factors */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2" />
              Key Factors Influencing This Recommendation
            </h3>
            
            {filteredFactors.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {filteredFactors.map(factor => (
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
                        {Math.round(factor.value)}/100
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 line-clamp-1">{factor.description}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-gray-500">No factors found for this filter</p>
              </div>
            )}
            
            {analysisFactors.length > 12 && !activeFilter && (
              <div className="text-center mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? 'Show Fewer Factors' : 'Show All Factors'}
                </Button>
              </div>
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
