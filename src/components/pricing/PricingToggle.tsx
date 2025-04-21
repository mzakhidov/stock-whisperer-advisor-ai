
import React from "react";
import { Switch } from "@/components/ui/switch";

interface PricingToggleProps {
  annual: boolean;
  setAnnual: (checked: boolean) => void;
}

const PricingToggle: React.FC<PricingToggleProps> = ({ annual, setAnnual }) => (
  <div className="flex items-center justify-center gap-3 mb-10">
    <span className={`font-semibold transition-colors ${!annual ? "text-violet-600" : "text-gray-500"}`}>Monthly</span>
    <Switch checked={annual} onCheckedChange={setAnnual} />
    <span className={`font-semibold transition-colors ${annual ? "text-violet-600" : "text-gray-500"}`}>Annually</span>
    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
      Save 17% on Annual!
    </span>
  </div>
);

export default PricingToggle;
