
import React from 'react';
import { 
  Layers, Landmark, TrendingUp, BarChart4, 
  PieChart, LineChart, GanttChart, 
  UserCheck, Newspaper, Users 
} from 'lucide-react';

export function DetailedIndicators() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-finance-navy">
          Our Comprehensive Analysis Indicators
        </h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Stock Whisperer analyzes over 20 key metrics across three categories to generate accurate stock recommendations.
        </p>
        
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-blue-100 p-3 mr-3">
                <Layers className="h-6 w-6 text-finance-navy" />
              </div>
              <h3 className="text-xl font-bold text-finance-navy">Fundamental Indicators</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-2 mt-1">
                  <Landmark className="h-4 w-4 text-finance-navy" />
                </div>
                <div>
                  <span className="font-semibold block">P/E Ratio</span>
                  <span className="text-sm text-gray-600">Assesses if a stock is overvalued or undervalued relative to earnings</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-2 mt-1">
                  <TrendingUp className="h-4 w-4 text-finance-navy" />
                </div>
                <div>
                  <span className="font-semibold block">Growth Rate</span>
                  <span className="text-sm text-gray-600">Evaluates the company's revenue and earnings trajectory</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-2 mt-1">
                  <BarChart4 className="h-4 w-4 text-finance-navy" />
                </div>
                <div>
                  <span className="font-semibold block">Earnings Quality</span>
                  <span className="text-sm text-gray-600">Analyzes consistency and predictability of earnings results</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-blue-100 p-3 mr-3">
                <PieChart className="h-6 w-6 text-finance-navy" />
              </div>
              <h3 className="text-xl font-bold text-finance-navy">Technical Indicators</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-2 mt-1">
                  <BarChart className="h-4 w-4 text-finance-navy" />
                </div>
                <div>
                  <span className="font-semibold block">RSI (Relative Strength Index)</span>
                  <span className="text-sm text-gray-600">Identifies overbought or oversold conditions in the market</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-2 mt-1">
                  <LineChart className="h-4 w-4 text-finance-navy" />
                </div>
                <div>
                  <span className="font-semibold block">Moving Averages</span>
                  <span className="text-sm text-gray-600">Tracks price trends and potential support/resistance levels</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-2 mt-1">
                  <GanttChart className="h-4 w-4 text-finance-navy" />
                </div>
                <div>
                  <span className="font-semibold block">Volume Analysis</span>
                  <span className="text-sm text-gray-600">Evaluates trading volume to confirm price movements</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-blue-100 p-3 mr-3">
                <Users className="h-6 w-6 text-finance-navy" />
              </div>
              <h3 className="text-xl font-bold text-finance-navy">Sentiment Indicators</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-2 mt-1">
                  <UserCheck className="h-4 w-4 text-finance-navy" />
                </div>
                <div>
                  <span className="font-semibold block">Analyst Ratings</span>
                  <span className="text-sm text-gray-600">Compiles and weighs professional analyst recommendations</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-2 mt-1">
                  <Newspaper className="h-4 w-4 text-finance-navy" />
                </div>
                <div>
                  <span className="font-semibold block">News Sentiment</span>
                  <span className="text-sm text-gray-600">Analyzes tone and impact of recent news coverage</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-2 mt-1">
                  <Users className="h-4 w-4 text-finance-navy" />
                </div>
                <div>
                  <span className="font-semibold block">Insider Activity</span>
                  <span className="text-sm text-gray-600">Tracks buying and selling patterns of company insiders</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
