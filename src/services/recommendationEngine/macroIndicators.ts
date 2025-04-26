
import { apiUtils } from './apiUtils';
import { formatDate } from '../utils/dateUtils';

export class MacroIndicators {
  async fetchInflationRate(): Promise<number | null> {
    try {
      const response = await apiUtils.fetchPolygonAPI('/reference/market/indices', {
        ticker: 'CPI',
        limit: '1'
      });
      return response.results?.[0]?.value || null;
    } catch (error) {
      console.error("Error fetching inflation rate:", error);
      return null;
    }
  }

  async fetchUnemploymentRate(): Promise<number | null> {
    try {
      const response = await apiUtils.fetchPolygonAPI('/reference/market/indices', {
        ticker: 'UNRATE',
        limit: '1'
      });
      return response.results?.[0]?.value || null;
    } catch (error) {
      console.error("Error fetching unemployment rate:", error);
      return null;
    }
  }

  async fetchGDPGrowthRate(): Promise<number | null> {
    try {
      const response = await apiUtils.fetchPolygonAPI('/reference/market/indices', {
        ticker: 'GDP',
        limit: '2'
      });
      
      if (response.results?.length >= 2) {
        const current = response.results[0].value;
        const previous = response.results[1].value;
        return ((current - previous) / previous) * 100;
      }
      return null;
    } catch (error) {
      console.error("Error fetching GDP growth rate:", error);
      return null;
    }
  }

  async fetchFedFundsRate(): Promise<number | null> {
    try {
      const response = await apiUtils.fetchPolygonAPI('/reference/rates/treasury', {
        type: 'FEDFUNDS',
        limit: '1'
      });
      return response.results?.[0]?.rate || null;
    } catch (error) {
      console.error("Error fetching fed funds rate:", error);
      return null;
    }
  }
}

export const macroIndicators = new MacroIndicators();
