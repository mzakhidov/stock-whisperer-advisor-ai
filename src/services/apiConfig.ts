
import { toast } from "sonner";

export const API_KEYS = {
  ALPHA_VANTAGE: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || '',
  FINANCIAL_MODELING_PREP: import.meta.env.VITE_FMP_API_KEY || '',
  POLYGON: import.meta.env.VITE_POLYGON_API_KEY || '',
};

export const checkApiKeys = (): boolean => {
  const hasKeys = 
    !!API_KEYS.ALPHA_VANTAGE || 
    !!API_KEYS.FINANCIAL_MODELING_PREP || 
    !!API_KEYS.POLYGON;
  
  if (!hasKeys) {
    toast.warning(
      "No API keys configured. Using mock stock data. " + 
      "Configure keys in project settings for real-time data."
    );
  }
  
  return hasKeys;
};

export const getPreferredApiKey = () => {
  if (API_KEYS.FINANCIAL_MODELING_PREP) return 'FINANCIAL_MODELING_PREP';
  if (API_KEYS.ALPHA_VANTAGE) return 'ALPHA_VANTAGE';
  if (API_KEYS.POLYGON) return 'POLYGON';
  return null;
};
