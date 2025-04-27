import React from "react";
import { BookOpen, TrendingUp, DollarSign, Lightbulb } from "lucide-react";

export default function Learn() {
  return (
    <section className="py-16 bg-white min-h-[70vh]">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center mb-6">
          <BookOpen className="h-8 w-8 text-finance-navy mr-3" />
          <h1 className="text-3xl font-bold text-finance-navy">Learn: Stock Market Basics</h1>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-finance-green mb-2 flex items-center"><TrendingUp className="h-6 w-6 mr-2" />What is the Stock Market?</h2>
          <p className="text-gray-700 text-base">
            The stock market is a place where shares (ownership units) of companies are bought and sold. It serves as a platform for investors to participate in the growth of businesses and for companies to raise funds for expansion.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-finance-navy mb-2 flex items-center"><Lightbulb className="h-6 w-6 mr-2" />How to Start Learning About Stocks?</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li><b>Understand the Basics:</b> Learn key concepts such as stocks, bonds, indices, dividends, and market orders.</li>
            <li><b>Read and Research:</b> Use books, articles, and online courses to build foundational knowledge. Explore beginner guides and reliable finance news sources.</li>
            <li><b>Follow the Markets:</b> Observe how the market works day-to-day, track major indices (like the S&amp;P 500), and read about leading companies.</li>
            <li><b>Practice With Simulators:</b> Many platforms let you simulate trading with virtual money to practice in a risk-free environment.</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-finance-green mb-2 flex items-center"><DollarSign className="h-6 w-6 mr-2" />How Can You Start Investing?</h2>
          <ol className="list-decimal ml-6 text-gray-700">
            <li><b>Set Your Goals:</b> Define why you want to invest (e.g., retirement, buying a home, building wealth).</li>
            <li><b>Choose a Brokerage:</b> Open an account with a trusted stockbroker. Many now offer app-based investing with low or no fees.</li>
            <li><b>Start Small:</b> Begin with an amount you can afford to lose, and focus on long-term growth instead of quick wins.</li>
            <li><b>Diversify:</b> Don’t put all your money into one stock! Spread your investments across different sectors and asset types.</li>
            <li><b>Keep Learning:</b> Stay curious—continue reading, practicing, and possibly seek advice from trusted sources.</li>
          </ol>
        </div>

        <div className="border border-finance-navy rounded-lg p-4 bg-finance-lightGray text-finance-gray mb-6">
          <p>
            <b>Remember:</b> Investing always involves risks, but learning the basics is a great step toward making smart, confident decisions for your financial future!
          </p>
        </div>

        <div className="mt-8 w-full">
          <img 
            src="/lovable-uploads/084072da-0e00-436f-bf6b-9cd57c5fdbd4.png" 
            alt="Stock market trading dashboard with financial analytics" 
            className="w-full h-auto rounded-lg shadow-md object-cover"
          />
        </div>
      </div>
    </section>
  );
}
