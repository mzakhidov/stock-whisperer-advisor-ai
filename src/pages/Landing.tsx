
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, BarChart, LineChart } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-finance-navy to-blue-900 text-white py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Stock Whisperer
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light">
              Smart analysis for smarter investing decisions.
              Get data-driven recommendations backed by comprehensive metrics.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="bg-white text-finance-navy hover:bg-gray-100 font-semibold px-8">
                Try It Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-finance-navy">
            Make Informed Investment Decisions
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-finance-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-finance-navy">Fundamental Analysis</h3>
              <p className="text-gray-600">
                Evaluate financial metrics like P/E ratio, growth rate, and earnings to understand a company's intrinsic value.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-finance-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-finance-navy">Technical Analysis</h3>
              <p className="text-gray-600">
                Examine price movements, patterns, and key indicators like RSI and moving averages to time your investments.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-finance-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-finance-navy">Sentiment Analysis</h3>
              <p className="text-gray-600">
                Gauge market sentiment through analyst ratings, news sentiment, and insider trading to predict price movements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-finance-lightGray">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-finance-navy">
            Ready to Make Smarter Investment Decisions?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Stock Whisperer combines fundamental, technical, and sentiment analysis to provide clear investment recommendations.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-finance-navy hover:bg-blue-900 text-white font-semibold px-8">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-finance-navy text-white py-12 mt-auto">
        <div className="container px-4 mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Stock Whisperer</h2>
            <p className="text-gray-400 mb-6">Smart analysis for smarter investing</p>
            <p className="text-sm text-gray-500">
              © 2025 Stock Whisperer | All data shown is simulated for demonstration purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
