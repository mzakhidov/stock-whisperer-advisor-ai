
import React, { useState } from "react";
import { BadgeDollarSign, Package, PackagePlus } from "lucide-react";
import { Switch } from "@/components/ui/switch";

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
    button: {
      text: "Current Plan",
      variant: "outline" as const,
      disabled: true,
    },
  },
  {
    name: "Plus",
    icon: <BadgeDollarSign className="h-8 w-8 mb-2 text-violet-600" />,
    price: {
      monthly: "$9/mo",
      annually: "$90/yr", // 17% off (was $108)
    },
    features: [
      "Unlimited watchlists",
      "Advanced analytics",
      "Priority email support",
      "Early access features",
    ],
    highlight: true,
    color: "bg-violet-600 border-violet-600 shadow-lg",
    text: "text-white",
    button: {
      text: "Start Plus",
      variant: "default" as const,
      disabled: false,
    },
  },
  {
    name: "Pro",
    icon: <PackagePlus className="h-8 w-8 mb-2 text-finance-navy" />,
    price: {
      monthly: "$19/mo",
      annually: "$190/yr", // 17% off (was $228)
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
    button: {
      text: "Go Pro",
      variant: "outline" as const,
      disabled: false,
    },
  },
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
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={`font-semibold transition-colors ${!annual ? "text-violet-600" : "text-gray-500"}`}>Monthly</span>
          <Switch checked={annual} onCheckedChange={setAnnual} />
          <span className={`font-semibold transition-colors ${annual ? "text-violet-600" : "text-gray-500"}`}>Annually</span>
          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Save 17% on Annual!
          </span>
        </div>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          {plansData.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col items-center border-2 ${plan.color} rounded-2xl px-8 py-10 w-full max-w-xs hover:scale-105 transition-transform duration-300 ${
                plan.highlight ? "ring-4 ring-violet-200" : ""
              }`}
            >
              {plan.icon}
              <h2 className={`text-2xl font-bold mb-2 ${plan.text}`}>{plan.name}</h2>
              <div className={`text-xl font-semibold mb-4 ${plan.text}`}>
                {annual ? plan.price.annually : plan.price.monthly}
              </div>
              <ul className="text-sm mb-6 text-gray-700 w-full">
                {plan.features.map((feature) => (
                  <li key={feature} className="py-1 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2 inline-block"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                disabled={plan.button.disabled}
                className={`
                  w-full px-6 py-3 rounded font-semibold text-base
                  ${plan.button.variant === "default"
                  ? "bg-white text-violet-600 border border-violet-600 hover:bg-violet-100"
                  : "border border-gray-300 text-gray-900 bg-transparent hover:bg-gray-100"}
                  ${plan.button.disabled ? "cursor-not-allowed opacity-50" : ""}
                  transition-colors duration-200
                `}
              >
                {plan.button.text}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
