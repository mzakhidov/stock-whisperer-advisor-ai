import React from 'react';
import { DollarSign, BarChart, LineChart } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-finance-navy">
          Make Informed Investment Decisions
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Fundamental Analysis */}
          <div className="flex flex-col bg-gray-50 rounded-lg shadow-sm border border-gray-100">
            <div className="p-6">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-finance-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-finance-navy">Fundamental Analysis</h3>
              <p className="text-gray-600">
                Evaluate financial metrics like P/E ratio, growth rate, and earnings to understand a company's intrinsic value.
              </p>
            </div>
            <div className="mt-auto">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <img
                  src="/lovable-uploads/b5980423-f934-4208-80ff-842377f782e7.png"
                  alt="Financial analysis with calculator and charts"
                  className="rounded-b-lg object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          </div>
          {/* Technical Analysis */}
          <div className="flex flex-col bg-gray-50 rounded-lg shadow-sm border border-gray-100">
            <div className="p-6">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-finance-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-finance-navy">Technical Analysis</h3>
              <p className="text-gray-600">
                Examine price movements, patterns, and key indicators like RSI and moving averages to time your investments.
              </p>
            </div>
            <div className="mt-auto">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1470&auto=format&fit=crop"
                  alt="Upward trending candlestick chart"
                  className="rounded-b-lg object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          </div>
          {/* Sentiment Analysis */}
          <div className="flex flex-col bg-gray-50 rounded-lg shadow-sm border border-gray-100">
            <div className="p-6">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-finance-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-finance-navy">Sentiment Analysis</h3>
              <p className="text-gray-600">
                Gauge market sentiment through analyst ratings, news sentiment, and insider trading to predict price movements.
              </p>
            </div>
            <div className="mt-auto">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <img
                  src="/lovable-uploads/f9203722-18fa-4b8e-a146-61d1257dc150.png"
                  alt="Latest market news and sentiment analysis"
                  className="rounded-b-lg object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
