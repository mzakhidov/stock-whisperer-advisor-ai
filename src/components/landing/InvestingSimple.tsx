
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, LightbulbIcon, Target, Shield, BookOpen } from 'lucide-react';

export function InvestingSimple() {
  return (
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
  );
}
