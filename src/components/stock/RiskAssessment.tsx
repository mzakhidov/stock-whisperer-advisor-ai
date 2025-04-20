
import React from 'react';
import { StockData } from '@/types/stock';
import { ShieldCheck, ShieldHalf, ShieldAlert } from 'lucide-react';

interface RiskAssessmentProps {
  stock: StockData;
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ stock }) => {
  const calculateRiskLevel = (stock: StockData) => {
    const allMetrics = [
      ...stock.metrics.fundamental,
      ...stock.metrics.technical,
      ...stock.metrics.sentiment
    ];
    
    const averageScore = allMetrics.reduce((sum, metric) => sum + metric.value, 0) / allMetrics.length;
    
    if (averageScore >= 80) return { level: 'Low', color: 'text-green-500', icon: ShieldCheck };
    if (averageScore >= 65) return { level: 'Medium Low', color: 'text-emerald-500', icon: ShieldCheck };
    if (averageScore >= 50) return { level: 'Medium', color: 'text-yellow-500', icon: ShieldHalf };
    if (averageScore >= 35) return { level: 'High', color: 'text-orange-500', icon: ShieldAlert };
    return { level: 'Very High', color: 'text-red-500', icon: ShieldAlert };
  };

  const riskLevel = calculateRiskLevel(stock);
  const RiskIcon = riskLevel.icon;

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
      <div className="flex items-center space-x-3">
        <RiskIcon className={`h-6 w-6 ${riskLevel.color}`} />
        <div>
          <span className={`font-semibold ${riskLevel.color}`}>
            {riskLevel.level} Risk
          </span>
          <p className="text-sm text-gray-600">
            Based on comprehensive analysis of market metrics and company performance
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;
