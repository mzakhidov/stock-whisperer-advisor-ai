
import React from "react";
import CandleChart from "../components/CandleChart";

export default function About() {
  return (
    <section className="py-16 bg-white min-h-[60vh]">
      <div className="container mx-auto px-4 max-w-3xl">
        <img 
          src="/lovable-uploads/f197b024-f6c0-4f5b-8012-b40f6d5c10c7.png" 
          alt="Trading dashboard showing stock market analytics" 
          className="w-full h-auto mb-8 rounded-lg shadow-md"
        />
        <h1 className="text-3xl font-bold text-finance-navy mb-4">About AI Stock Whisperer</h1>
        <p className="text-gray-700 text-lg mb-6">
          <strong>AI Stock Whisperer</strong> is your advanced platform for smart stock discovery, insightful analytics, and actionable investing insights powered by artificial intelligence.
        </p>
        <ul className="list-disc ml-6 text-gray-700 mb-6">
          <li>
            <b>Real-Time Analysis:</b> Access live prices, statistics, and news about your favorite stocks.
          </li>
          <li>
            <b>AI-powered Signals:</b> Get buy/sell signals and risk assessments, tailored to your watchlist.
          </li>
          <li>
            <b>Personalized Dashboard:</b> Track your stocks, see advanced analytics, and monitor your investment journey.
          </li>
          <li>
            <b>Educational Resources:</b> Learn the basics or dive deep into market strategies through our tutorials and guides.
          </li>
        </ul>
        <p className="text-gray-700 text-base">
          Whether you're a beginner or a pro, AI Stock Whisperer empowers you with data-driven tools, a supportive community, and ongoing innovation to enhance your investing experience.
        </p>
      </div>
    </section>
  );
}
