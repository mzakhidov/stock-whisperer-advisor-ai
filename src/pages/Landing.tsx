
import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { RecommendationLevels } from '@/components/landing/RecommendationLevels';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { DetailedIndicators } from '@/components/landing/DetailedIndicators';
import { InvestingSimple } from '@/components/landing/InvestingSimple';
import { CustomerTestimonials } from '@/components/CustomerTestimonials';
import { CTASection } from '@/components/landing/CTASection';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <RecommendationLevels />
      <FeaturesSection />
      <DetailedIndicators />
      <InvestingSimple />
      <CustomerTestimonials />
      <CTASection />
    </div>
  );
};

export default Landing;
