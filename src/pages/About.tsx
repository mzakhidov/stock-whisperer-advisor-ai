
import React from "react";

export default function About() {
  return (
    <section className="py-16 bg-white min-h-[60vh]">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Updated image related to capital markets and investing */}
        <img
          src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=900&q=80"
          alt="Multiple monitors displaying stock market charts and financial graphs"
          className="rounded-xl shadow-md mb-8 w-full h-64 object-cover object-center"
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
          Whether you’re a beginner or a pro, AI Stock Whisperer empowers you with data-driven tools, a supportive community, and ongoing innovation to enhance your investing experience.
        </p>
      </div>
    </section>
  );
}

