
import { apiUtils } from './apiUtils';
import { formatDate } from '../utils/dateUtils';

export class MarketIndicators {
  async fetchBondYield(): Promise<number | null> {
    try {
      const response = await apiUtils.fetchPolygonAPI('/reference/rates/treasury', {
        type: '10Y',
        limit: '1'
      });
      return response.results?.[0]?.rate || null;
    } catch (error) {
      console.error("Error fetching bond yield:", error);
      return null;
    }
  }

  async fetchVIXRate(): Promise<number | null> {
    try {
      const response = await apiUtils.fetchPolygonAPI('/aggs/ticker/VIX/prev');
      return response.results?.[0]?.c || null;
    } catch (error) {
      console.error("Error fetching VIX rate:", error);
      return null;
    }
  }

  async fetchConsumerSentiment(): Promise<number | null> {
    try {
      const endDate = formatDate(new Date());
      const startDate = formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
      
      const response = await apiUtils.fetchPolygonAPI('/reference/market/indices', {
        ticker: 'UMCSENT',
        start_date: startDate,
        end_date: endDate
      });
      return response.results?.[0]?.value || null;
    } catch (error) {
      console.error("Error fetching consumer sentiment:", error);
      return null;
    }
  }
}

export const marketIndicators = new MarketIndicators();
