
import { API_KEYS, API_URLS } from '../apiConfig';

export const fetchStockOverview = async (ticker: string): Promise<any | null> => {
  try {
    if (API_KEYS.POLYGON) {
      const response = await fetch(
        `${API_URLS.POLYGON}/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${API_KEYS.POLYGON}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const quote = data.results[0];
        const previousClose = quote.c;
        const currentPrice = quote.c;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;
        
        const companyResponse = await fetch(
          `${API_URLS.POLYGON}/reference/tickers/${ticker}?apiKey=${API_KEYS.POLYGON}`
        );
        const companyData = await companyResponse.json();
        
        let industry = null;
        let description = null;
        let mainProducts = null;
        if (companyData.results) {
          industry = companyData.results.sic_description || companyData.results.standard_industrial_classification?.industry_title;
          description = companyData.results.description;
        }
        
        return {
          name: companyData.results?.name || ticker,
          price: currentPrice,
          change: change,
          changePercent: changePercent,
          description,
          industry,
          mainProducts
        };
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching stock overview:", error);
    return null;
  }
};
