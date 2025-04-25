
import { apiUtils } from './apiUtils';
import { formatDate } from '../utils/dateUtils';

export class TechnicalIndicators {
  async fetchRSI(ticker: string): Promise<number | null> {
    try {
      const endDate = formatDate(new Date());
      const startDate = formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
      
      const data = await apiUtils.fetchPolygonAPI(`/indicators/rsi/${ticker}`, {
        timespan: "day",
        adjusted: "true",
        window: "14",
        series_type: "close",
        order: "desc",
        start_date: startDate,
        end_date: endDate
      });
      
      if (data.results?.values?.[0]) {
        return data.results.values[0].value;
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching RSI:", error);
      return null;
    }
  }

  async fetchMovingAverages(ticker: string): Promise<number> {
    try {
      const endDate = formatDate(new Date());
      const startDate = formatDate(new Date(Date.now() - 210 * 24 * 60 * 60 * 1000));
      
      const [ma50Data, ma200Data] = await Promise.all([
        apiUtils.fetchPolygonAPI(`/indicators/sma/${ticker}`, {
          timespan: "day",
          adjusted: "true",
          window: "50",
          series_type: "close",
          order: "desc",
          limit: "10",
          start_date: startDate,
          end_date: endDate
        }),
        apiUtils.fetchPolygonAPI(`/indicators/sma/${ticker}`, {
          timespan: "day",
          adjusted: "true",
          window: "200",
          series_type: "close",
          order: "desc",
          limit: "10",
          start_date: startDate,
          end_date: endDate
        })
      ]);
      
      if (ma50Data.results?.values?.[0] && ma200Data.results?.values?.[0]) {
        const currentMa50 = ma50Data.results.values[0].value;
        const currentMa200 = ma200Data.results.values[0].value;
        const prevMa50 = ma50Data.results.values[1]?.value;
        const prevMa200 = ma200Data.results.values[1]?.value;
        
        if (prevMa50 && prevMa200) {
          if (prevMa50 <= prevMa200 && currentMa50 > currentMa200) return 1;
          if (prevMa50 >= prevMa200 && currentMa50 < currentMa200) return -1;
        }
        
        return currentMa50 > currentMa200 ? 0.5 : -0.5;
      }
      
      return 0;
    } catch (error) {
      console.error("Error fetching moving averages:", error);
      return 0;
    }
  }
}

export const technicalIndicators = new TechnicalIndicators();
