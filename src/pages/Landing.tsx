import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, TrendingUp, BarChart, LineChart, DollarSign, 
  Landmark, Layers, GanttChart, PieChart, 
  UserCheck, Newspaper, Users, BarChart4, 
  LightbulbIcon, Target, Shield, BookOpen 
} from 'lucide-react';
import MatrixIcons from '@/components/MatrixIcons';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Dynamic Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1470&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4)',
          }}
        />
        
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 z-10 bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-blue-900/80"
          style={{
            backgroundImage: 'linear-gradient(45deg, rgba(139, 92, 246, 0.5), rgba(14, 165, 233, 0.5), rgba(217, 70, 239, 0.5))',
          }}
        />
        
        {/* Matrix Icons Animation */}
        <MatrixIcons />
        
        {/* Content */}
        <div className="container px-4 mx-auto relative z-30">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white animate-fade-in">
              AI Stock Whisperer
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light animate-fade-in delay-100">
              Smart analysis for smarter investing decisions.
              Get data-driven recommendations backed by comprehensive metrics.
            </p>
            <Link to="/dashboard">
              <Button 
                size="lg" 
                className="bg-white text-finance-navy hover:bg-gray-100 hover:scale-105 transform transition-all duration-200 font-semibold px-8 py-6 text-lg animate-fade-in delay-200"
              >
                Try It Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Recommendation Levels Section */}
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

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-finance-navy">
            Make Informed Investment Decisions
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
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
                <AspectRatio ratio={16/9} className="bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1554260570-9140fd3b7614?q=80&w=1470&auto=format&fit=crop"
                    alt="Financial statements and reports"
                    className="rounded-b-lg object-cover w-full h-full"
                  />
                </AspectRatio>
              </div>
            </div>

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
                <AspectRatio ratio={16/9} className="bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1470&auto=format&fit=crop"
                    alt="Stock market charts and technical analysis"
                    className="rounded-b-lg object-cover w-full h-full"
                  />
                </AspectRatio>
              </div>
            </div>

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
                <AspectRatio ratio={16/9} className="bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1470&auto=format&fit=crop"
                    alt="Social media and news analytics"
                    className="rounded-b-lg object-cover w-full h-full"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Indicators Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-finance-navy">
            Our Comprehensive Analysis Indicators
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Stock Whisperer analyzes over 20 key metrics across three categories to generate accurate stock recommendations.
          </p>
          
          <div className="grid md:grid-cols-3 gap-10">
            {/* Fundamental Indicators */}
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
            
            {/* Technical Indicators */}
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
            
            {/* Sentiment Indicators */}
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

      {/* Investing Made Simple Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-finance-navy">
            Investing Made Simple
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            We believe everyone deserves the opportunity to build wealth through smart investing. 
            Our platform makes it easy to understand and act on investment opportunities.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-none">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <LightbulbIcon className="h-6 w-6 text-finance-navy" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-finance-navy">Clear Insights</h3>
                <p className="text-gray-600">
                  Transform complex market data into clear, actionable insights that help you make informed decisions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-none">
              <CardContent className="pt-6">
                <div className="rounded-full bg-purple-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-finance-navy" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-finance-navy">Focused Strategy</h3>
                <p className="text-gray-600">
                  Focus on what matters - solid companies with strong fundamentals and positive market sentiment.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-blue-50 border-none">
              <CardContent className="pt-6">
                <div className="rounded-full bg-pink-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-finance-navy" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-finance-navy">Risk Management</h3>
                <p className="text-gray-600">
                  Understand potential risks and make decisions that align with your investment comfort level.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-none">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-finance-navy" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-finance-navy">Learn & Grow</h3>
                <p className="text-gray-600">
                  Build your investment knowledge with our easy-to-understand metrics and educational resources.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Link to="/dashboard">
              <Button 
                size="lg" 
                className="bg-finance-navy hover:bg-blue-900 text-white font-semibold px-8"
              >
                Start Your Investment Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
