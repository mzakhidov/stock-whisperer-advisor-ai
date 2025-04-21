
import React from "react";

type Plan = {
  name: string;
  icon: React.ReactNode;
  price: { monthly: string; annually: string };
  features: string[];
  highlight: boolean;
  color: string;
  text: string;
  bodyTextColor: string;
  button: {
    text: string;
    variant: "default" | "outline";
    disabled: boolean;
    ctaColor: string;
  };
};

interface PlanCardProps {
  plan: Plan;
  annual: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, annual }) => (
  <div
    className={`flex flex-col items-center border-2 ${plan.color} rounded-2xl px-8 py-10 w-full max-w-xs hover:scale-105 transition-transform duration-300 ${
      plan.highlight ? "ring-4 ring-violet-200" : ""
    }`}
  >
    {plan.icon}
    <h2 className={`text-2xl font-bold mb-2 ${plan.text}`}>{plan.name}</h2>
    <div className={`text-xl font-semibold mb-4 ${plan.text}`}>
      {annual ? plan.price.annually : plan.price.monthly}
    </div>
    <ul className={`text-sm mb-6 w-full ${plan.bodyTextColor}`}>
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
        w-[95%] px-6 py-3 rounded-lg font-semibold text-base text-center
        ${plan.button.ctaColor}
        ${plan.button.disabled ? "cursor-not-allowed opacity-50" : ""}
        transition-colors duration-200 outline-2 outline-offset-2
      `}
      style={{ outlineColor: "transparent" }}
    >
      {plan.button.text}
    </button>
  </div>
);

export default PlanCard;
