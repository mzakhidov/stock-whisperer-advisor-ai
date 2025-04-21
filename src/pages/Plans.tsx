import React, { useState } from "react";
import { BadgeDollarSign, Package, PackagePlus } from "lucide-react";
import FAQAccordion from "../components/FAQAccordion";
import PlanCard from "../components/pricing/PlanCard";
import PlanComparisonTable from "../components/pricing/PlanComparisonTable";
import PricingToggle from "../components/pricing/PricingToggle";

const plansData = [
  {
    name: "Freemium",
    icon: <Package className="h-8 w-8 mb-2 text-primary" />,
    price: { monthly: "Free", annually: "Free" },
    features: [
      "Real-time quotes",
      "Basic analytics",
      "Watchlist (5 stocks)",
      "Email support",
    ],
    highlight: false,
    color: "bg-white border-primary",
    text: "text-primary",
    bodyTextColor: "text-gray-700",
    button: {
      text: "Current Plan",
      variant: "outline" as const,
      disabled: true,
      ctaColor:
        "bg-gray-200 text-gray-500 border border-gray-300 outline outline-2 outline-gray-400",
    },
  },
  {
    name: "Plus",
    icon: <BadgeDollarSign className="h-8 w-8 mb-2 text-white" />,
    price: {
      monthly: "$14.95/mo",
      annually: "$149/yr",
    },
    features: [
      "Unlimited watchlists",
      "Advanced analytics",
      "Priority email support",
      "Early access features",
    ],
    highlight: true,
    color: "bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 border-transparent shadow-lg",
    text: "text-white",
    bodyTextColor: "text-white",
    button: {
      text: "Start Plus",
      variant: "default" as const,
      disabled: false,
      ctaColor:
        "bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-400 text-white border border-white hover:brightness-105 shadow-lg outline outline-2 outline-white",
    },
  },
  {
    name: "Pro",
    icon: <PackagePlus className="h-8 w-8 mb-2 text-finance-navy" />,
    price: {
      monthly: "$29.95/mo",
      annually: "$299/yr",
    },
    features: [
      "All Plus features",
      "Export data",
      "AI-powered signals",
      "1:1 Portfolio review",
    ],
    highlight: false,
    color: "bg-white border-finance-navy",
    text: "text-finance-navy",
    bodyTextColor: "text-gray-700",
    button: {
      text: "Go Pro",
      variant: "outline" as const,
      disabled: false,
      ctaColor:
        "bg-gradient-to-r from-orange-400 via-pink-600 to-blue-500 text-white border border-blue-500 hover:brightness-105 shadow-lg outline outline-2 outline-blue-500",
    },
  },
];

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
        <PricingToggle annual={annual} setAnnual={setAnnual} />

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          {plansData.map((plan) => (
            <PlanCard plan={plan} key={plan.name} annual={annual} />
          ))}
        </div>

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
