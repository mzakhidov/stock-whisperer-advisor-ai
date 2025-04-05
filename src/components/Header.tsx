
import React from 'react';

const Header = () => {
  return (
    <header className="flex flex-col items-center justify-center py-6 bg-finance-navy text-white">
      <div className="container px-4">
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Stock Whisperer
          </h1>
          <p className="text-sm md:text-base text-gray-300 italic">
            Smart analysis for smarter investing
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
