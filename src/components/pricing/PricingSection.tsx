
import React from "react";
import PlanCard from "./PlanCard";
import PricingToggle from "./PricingToggle";
import { useAuth } from "@/contexts/AuthContext";
import { BadgeDollarSign, Package, PackagePlus, Badge } from "lucide-react";

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
    price: { monthly: "$14.95/mo", annually: "$149/yr" },
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
    price: { monthly: "$29.95/mo", annually: "$299/yr" },
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

interface PricingSectionProps {
  annual: boolean;
  setAnnual: (val: boolean) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ annual, setAnnual }) => {
  const { isAuthenticated } = useAuth();

  const computedPlans = plansData.map((plan) => {
    if (plan.name !== "Freemium") return plan;

    if (!isAuthenticated) {
      // Copy Plus CTA styling for Freemium with "Try For Free" text
      const plusPlan = plansData.find((p) => p.name === "Plus");
      return {
        ...plan,
        button: {
          ...plan.button,
          text: "Try For Free",
          variant: plusPlan!.button.variant,
          disabled: false,
          ctaColor: plusPlan!.button.ctaColor,
        },
      };
    } else {
      // Default "Current Plan" style (as before)
      return plan;
    }
  });

  return (
    <section>
      <PricingToggle annual={annual} setAnnual={setAnnual} />
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center relative">
        {computedPlans.map((plan) => (
          <div key={plan.name} className="relative w-full max-w-xs">
            {plan.name === "Plus" && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="inline-flex items-center rounded-full bg-purple-500 px-3 py-1 text-white text-xs font-semibold shadow-lg select-none">
                  Most Popular
                </span>
              </div>
            )}
            <PlanCard plan={plan} annual={annual} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;

