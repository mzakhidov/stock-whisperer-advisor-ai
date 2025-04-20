
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import MatrixIcons from '@/components/MatrixIcons';

export function HeroSection() {
  return (
    <header className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1470&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4)',
        }}
      />
      
      <div 
        className="absolute inset-0 z-10 bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-blue-900/80"
        style={{
          backgroundImage: 'linear-gradient(45deg, rgba(139, 92, 246, 0.5), rgba(14, 165, 233, 0.5), rgba(217, 70, 239, 0.5))',
        }}
      />
      
      <MatrixIcons />
      
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
              Try AI Stock Whisperer Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
