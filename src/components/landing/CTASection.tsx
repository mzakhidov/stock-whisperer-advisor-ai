
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-16 bg-finance-lightGray">
      <div className="container px-4 mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-finance-navy">
          Ready to Make Smarter Investment Decisions with AI Stock Whisperer?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          AI Stock Whisperer combines fundamental, technical, and sentiment analysis to provide clear investment recommendations.
        </p>
        <Link to="/dashboard">
          <Button size="lg" className="bg-finance-navy hover:bg-blue-900 text-white font-semibold px-8">
            Get Started with AI Stock Whisperer
          </Button>
        </Link>
      </div>
    </section>
  );
}
