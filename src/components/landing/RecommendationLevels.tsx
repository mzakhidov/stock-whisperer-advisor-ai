
import React from 'react';
import { TrendingUp, ArrowRight, GanttChart, BarChart, LineChart } from 'lucide-react';

export function RecommendationLevels() {
  return (
    <section className="py-14 bg-gray-50">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-finance-navy">
          Our 5-Level Stock Recommendation System
        </h2>
        <div className="grid md:grid-cols-5 gap-4">
          <div className="bg-rating-strongBuy text-white p-5 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" /> Strong Buy
            </h3>
            <p className="text-sm">
              Exceptional growth prospects with strong fundamentals, technical signals, and positive market sentiment.
            </p>
          </div>
          <div className="bg-rating-buy text-white p-5 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <ArrowRight className="mr-2 h-5 w-5" /> Buy
            </h3>
            <p className="text-sm">
              Strong potential for price appreciation with solid metrics across multiple analysis dimensions.
            </p>
          </div>
          <div className="bg-rating-hold text-black p-5 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <GanttChart className="mr-2 h-5 w-5" /> Hold
            </h3>
            <p className="text-sm">
              Balanced risk-reward profile. Consider maintaining current positions but monitor for changes.
            </p>
          </div>
          <div className="bg-rating-sell text-white p-5 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <BarChart className="mr-2 h-5 w-5" /> Sell
            </h3>
            <p className="text-sm">
              Deteriorating metrics suggesting increased risk. Consider reducing positions in these stocks.
            </p>
          </div>
          <div className="bg-rating-strongSell text-white p-5 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <LineChart className="mr-2 h-5 w-5" /> Strong Sell
            </h3>
            <p className="text-sm">
              Significant red flags across multiple indicators. High risk of continued price deterioration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
