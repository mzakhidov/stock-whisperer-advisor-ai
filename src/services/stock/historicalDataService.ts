
import { API_KEYS, API_URLS } from '../apiConfig';

export const fetchHistoricalPrices = async (ticker: string): Promise<any[] | null> => {
  try {
    if (API_KEYS.POLYGON) {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 365);
      const startDateStr = startDate.toISOString().split('T')[0];
      
      const response = await fetch(
        `${API_URLS.POLYGON}/aggs/ticker/${ticker}/range/1/day/${startDateStr}/${endDate}?adjusted=true&sort=asc&limit=365&apiKey=${API_KEYS.POLYGON}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results.map((bar: any) => {
          const date = new Date(bar.t);
          return {
            date: date.toISOString().split('T')[0],
            price: bar.c,
            volume: bar.v
          };
        });
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching historical prices:", error);
    return null;
  }
};
