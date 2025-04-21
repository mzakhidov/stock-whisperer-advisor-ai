
import React, { useState } from "react";
import PricingSection from "../components/pricing/PricingSection";
import PlanComparisonTable from "../components/pricing/PlanComparisonTable";
import FAQAccordion from "../components/FAQAccordion";

// Split out clearly for easier refactor and future maintenance
const comparisonFeatures = [
  {
    feature: "Real-time quotes",
    Freemium: true,
    Plus: true,
    Pro: true,
  },
  {
    feature: "Basic analytics",
    Freemium: true,
    Plus: true,
    Pro: true,
  },
  {
    feature: "Unlimited watchlists",
    Freemium: false,
    Plus: true,
    Pro: true,
  },
  {
    feature: "Advanced analytics",
    Freemium: false,
    Plus: true,
    Pro: true,
  },
  {
    feature: "AI-powered signals",
    Freemium: false,
    Plus: false,
    Pro: true,
  },
  {
    feature: "Watchlist limit",
    Freemium: "5",
    Plus: "Unlimited",
    Pro: "Unlimited",
  },
  {
    feature: "Support",
    Freemium: "Email",
    Plus: "Priority Email",
    Pro: "1:1 Portfolio review",
  },
  {
    feature: "Export data",
    Freemium: false,
    Plus: false,
    Pro: true,
  },
  {
    feature: "Early access features",
    Freemium: false,
    Plus: true,
    Pro: true,
  }
];

const faq = [
  {
    q: "Can I switch between monthly and annual billing any time?",
    a: "Yes! You can switch your billing cycle any time without losing your data or preferences."
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "All users can try Plus and Pro features free for 7 days—no credit card required."
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit cards, PayPal, and Apple Pay."
  },
  {
    q: "Can I cancel my upgrade at any time?",
    a: "Absolutely! Plans are flexible. Cancel anytime; you'll retain access until your current period ends."
  },
  {
    q: "Will I lose my watchlists if I downgrade?",
    a: "No, your watchlists are safe! You may need to remove lists if limits change."
  }
];

export default function Plans() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="py-14 bg-gray-50 min-h-[60vh]">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-finance-navy mb-3">
          Choose Your Plan
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Upgrade anytime – transparent pricing, no hidden fees.
        </p>
        <PricingSection annual={annual} setAnnual={setAnnual} />
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4 text-center text-finance-navy">Compare Plans</h2>
          <PlanComparisonTable comparisonFeatures={comparisonFeatures} />
        </div>
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-finance-navy">Frequently Asked Questions</h2>
          <FAQAccordion faq={faq} />
        </div>
      </div>
    </section>
  );
}
