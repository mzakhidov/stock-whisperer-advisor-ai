
import { toast } from "sonner";

export const API_KEYS = {
  POLYGON: 'y7iYoAv_1cUgmWPIkLJsl2pdH3WRKtXR',
  ALPHA_VANTAGE: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || '02V6O6M89LT95YSU',
  FINANCIAL_MODELING_PREP: import.meta.env.VITE_FMP_API_KEY || '',
};

export const API_URLS = {
  POLYGON: 'https://api.polygon.io/v2',
  ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
  FINANCIAL_MODELING_PREP: 'https://financialmodelingprep.com/api/v3',
};

export const checkApiKeys = (): boolean => {
  const hasKeys = 
    !!API_KEYS.POLYGON || 
    !!API_KEYS.ALPHA_VANTAGE || 
    !!API_KEYS.FINANCIAL_MODELING_PREP;
  
  if (!hasKeys) {
    toast.warning(
      "No API keys configured. Using mock data. " + 
      "Configure keys in project settings for real-time data."
    );
  }
  
  return hasKeys;
};

export const getPreferredApiKey = () => {
  if (API_KEYS.POLYGON) return 'POLYGON';
  if (API_KEYS.FINANCIAL_MODELING_PREP) return 'FINANCIAL_MODELING_PREP';
  if (API_KEYS.ALPHA_VANTAGE) return 'ALPHA_VANTAGE';
  return null;
};
