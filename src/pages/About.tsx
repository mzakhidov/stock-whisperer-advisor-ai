
import React from "react";

export default function About() {
  return (
    <section className="py-16 bg-white min-h-[60vh]">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Wall Street Bull image */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Charging_Bull_statue_in_Bowling_Green_Park%2C_NYC_-_January_2006.jpg/900px-Charging_Bull_statue_in_Bowling_Green_Park%2C_NYC_-_January_2006.jpg"
          alt="Wall Street Bull statue, symbolizing the stock market"
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
