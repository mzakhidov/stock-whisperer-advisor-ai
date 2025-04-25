
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
}

export const fundamentalIndicators = new FundamentalIndicators();
