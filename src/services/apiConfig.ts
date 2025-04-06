
// API configuration for stock data providers
export const API_KEYS = {
  ALPHA_VANTAGE: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || '',
  FINANCIAL_MODELING_PREP: import.meta.env.VITE_FMP_API_KEY || '',
  POLYGON: import.meta.env.VITE_POLYGON_API_KEY || '',
};

// Check if API keys are configured
export const checkApiKeys = (): boolean => {
  return (
    !!API_KEYS.ALPHA_VANTAGE || 
    !!API_KEYS.FINANCIAL_MODELING_PREP || 
    !!API_KEYS.POLYGON
  );
};

// Base URLs for different API providers
export const API_URLS = {
  ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
  FINANCIAL_MODELING_PREP: 'https://financialmodelingprep.com/api/v3',
  POLYGON: 'https://api.polygon.io/v2',
};
