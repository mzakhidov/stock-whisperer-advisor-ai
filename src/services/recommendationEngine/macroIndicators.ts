
import { apiUtils } from './apiUtils';
import { formatDate } from '../utils/dateUtils';

export class MacroIndicators {
  async fetchInflationRate(): Promise<number | null> {
    try {
      const endDate = formatDate(new Date());
      const startDate = formatDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000));
      
      const response = await apiUtils.fetchPolygonAPI('/reference/market/indices', {
        ticker: 'CPI',
        start_date: startDate,
        end_date: endDate,
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
      const endDate = formatDate(new Date());
      const startDate = formatDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000));
      
      const response = await apiUtils.fetchPolygonAPI('/reference/market/indices', {
        ticker: 'UNRATE',
        start_date: startDate,
        end_date: endDate,
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
      const endDate = formatDate(new Date());
      const startDate = formatDate(new Date(Date.now() - 180 * 24 * 60 * 60 * 1000));
      
      const response = await apiUtils.fetchPolygonAPI('/reference/market/indices', {
        ticker: 'GDP',
        start_date: startDate,
        end_date: endDate,
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

  async fetchMacroScore(): Promise<number | null> {
    try {
      const [inflation, unemployment, gdpGrowth, fedFunds] = await Promise.all([
        this.fetchInflationRate(),
        this.fetchUnemploymentRate(),
        this.fetchGDPGrowthRate(),
        this.fetchFedFundsRate()
      ]);
      
      if (inflation === null && unemployment === null && gdpGrowth === null && fedFunds === null) {
        return null;
      }
      
      let score = 0;
      let factorsCount = 0;
      
      // Inflation: Lower is better (within reason)
      if (inflation !== null) {
        if (inflation <= 2) score += 1;
        else if (inflation <= 3) score += 0.5;
        else if (inflation <= 4) score += 0;
        else if (inflation <= 6) score -= 0.5;
        else score -= 1;
        factorsCount++;
      }
      
      // Unemployment: Lower is better (within reason)
      if (unemployment !== null) {
        if (unemployment <= 3.5) score += 1;
        else if (unemployment <= 4.5) score += 0.5;
        else if (unemployment <= 5.5) score += 0;
        else if (unemployment <= 7) score -= 0.5;
        else score -= 1;
        factorsCount++;
      }
      
      // GDP Growth: Higher is better
      if (gdpGrowth !== null) {
        if (gdpGrowth >= 3) score += 1;
        else if (gdpGrowth >= 2) score += 0.5;
        else if (gdpGrowth >= 1) score += 0;
        else if (gdpGrowth >= 0) score -= 0.5;
        else score -= 1;
        factorsCount++;
      }
      
      // Fed Funds Rate: Middle range is better (not too high, not too low)
      if (fedFunds !== null) {
        if (fedFunds >= 2.5 && fedFunds <= 4) score += 0.5;
        else if (fedFunds > 4 && fedFunds <= 5) score += 0;
        else if (fedFunds > 5) score -= 0.5;
        else if (fedFunds < 1) score -= 0.5;
        factorsCount++;
      }
      
      return factorsCount > 0 ? score / factorsCount : 0;
    } catch (error) {
      console.error("Error calculating macro score:", error);
      return null;
    }
  }
}

export const macroIndicators = new MacroIndicators();
