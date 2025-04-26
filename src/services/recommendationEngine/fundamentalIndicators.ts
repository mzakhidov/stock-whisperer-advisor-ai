
import { apiUtils } from './apiUtils';

export class FundamentalIndicators {
  async fetchAnnualGrowthRate(ticker: string): Promise<number | null> {
    try {
      const data = await apiUtils.fetchPolygonAPI(`/reference/financials/${ticker}`, {
        limit: "8",
        type: "Q"
      });
      
      if (!data.results || data.results.length < 4) return null;
      
      const sortedResults = [...data.results].sort((a: any, b: any) => 
        new Date(b.filing_date).getTime() - new Date(a.filing_date).getTime());
      
      const recentFourQuarters = sortedResults.slice(0, 4);
      const previousFourQuarters = sortedResults.slice(4, 8);
      
      const recentRevenue = recentFourQuarters.reduce((sum: number, q: any) => 
        sum + (q.financials?.income_statement?.revenues?.value || 0), 0);
      
      const previousRevenue = previousFourQuarters.reduce((sum: number, q: any) => 
        sum + (q.financials?.income_statement?.revenues?.value || 0), 0);
      
      return previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : null;
    } catch (error) {
      console.error("Error fetching annual growth rate:", error);
      return null;
    }
  }

  async fetchAnalystPriceProjections(ticker: string, currentPrice: number): Promise<number | null> {
    try {
      const data = await apiUtils.fetchPolygonAPI(`/snapshot/locale/us/markets/stocks/tickers/${ticker}`);
      
      if (data.ticker?.price_target?.average && currentPrice > 0) {
        return ((data.ticker.price_target.average - currentPrice) / currentPrice) * 100;
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching analyst price projections:", error);
      return null;
    }
  }

  async fetchEarningsBeatHistory(ticker: string): Promise<number | null> {
    try {
      const data = await apiUtils.fetchPolygonAPI(`/reference/financials/${ticker}`, {
        limit: "4",
        type: "Q"
      });
      
      if (!data.results?.length) return null;
      
      let beatsCount = 0;
      data.results.forEach((q: any) => {
        const actual = q.financials?.income_statement?.eps?.value;
        const estimate = q.financials?.income_statement?.eps?.estimate;
        if (actual > estimate) beatsCount++;
      });
      
      return beatsCount;
    } catch (error) {
      console.error("Error fetching earnings beat history:", error);
      return null;
    }
  }

  async fetchCompanyGuidance(ticker: string): Promise<number | null> {
    try {
      const data = await apiUtils.fetchPolygonAPI(`/reference/financials/${ticker}/guidance`, {
        limit: "1"
      });
      
      if (!data.results?.length) return null;
      
      const guidance = data.results[0];
      const midpoint = (guidance.high + guidance.low) / 2;
      const actual = guidance.actual || guidance.previous;
      
      return actual ? ((midpoint - actual) / actual) * 100 : null;
    } catch (error) {
      console.error("Error fetching company guidance:", error);
      return null;
    }
  }
}

export const fundamentalIndicators = new FundamentalIndicators();
