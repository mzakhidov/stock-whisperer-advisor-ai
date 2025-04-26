
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

  async fetchVolumeIndicator(ticker: string): Promise<number | null> {
    try {
      const endDate = formatDate(new Date());
      const startDate = formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
      
      const data = await apiUtils.fetchPolygonAPI(`/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?adjusted=true&sort=asc&limit=30`);
      
      if (!data.results || data.results.length < 5) return null;

      // Calculate average volume for the last 30 days
      const recentVolumes = data.results.map((day: any) => day.v);
      const avgVolume = recentVolumes.reduce((sum: number, vol: number) => sum + vol, 0) / recentVolumes.length;
      
      // Get the most recent 5 days
      const recentFiveDayVolumes = recentVolumes.slice(-5);
      const avgRecentVolume = recentFiveDayVolumes.reduce((sum: number, vol: number) => sum + vol, 0) / 5;
      
      // Compare recent volume to average volume
      const volumeRatio = avgRecentVolume / avgVolume;
      
      if (volumeRatio > 1.5) return 80; // High volume is bullish
      if (volumeRatio > 1.2) return 65;
      if (volumeRatio < 0.7) return 35; // Low volume is bearish
      if (volumeRatio < 0.5) return 20;
      
      return 50; // Neutral
    } catch (error) {
      console.error("Error fetching volume indicator:", error);
      return null;
    }
  }

  async fetchPriceToMA(ticker: string): Promise<number | null> {
    try {
      const endDate = formatDate(new Date());
      const startDate = formatDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000));
      
      // Get current price and 50-day moving average
      const [priceData, ma50Data] = await Promise.all([
        apiUtils.fetchPolygonAPI(`/aggs/ticker/${ticker}/prev?adjusted=true`),
        apiUtils.fetchPolygonAPI(`/indicators/sma/${ticker}`, {
          timespan: "day",
          adjusted: "true",
          window: "50",
          series_type: "close",
          order: "desc",
          limit: "1",
          start_date: startDate,
          end_date: endDate
        })
      ]);
      
      if (!priceData.results?.[0] || !ma50Data.results?.values?.[0]) return null;
      
      const currentPrice = priceData.results[0].c;
      const ma50 = ma50Data.results.values[0].value;
      
      // Calculate percentage difference
      const priceDiff = ((currentPrice - ma50) / ma50) * 100;
      
      // Score based on the difference
      if (priceDiff > 20) return 85; // Strong uptrend
      if (priceDiff > 10) return 70;
      if (priceDiff < -15) return 25; // Strong downtrend
      if (priceDiff < -7) return 40;
      
      return 50; // Neutral
    } catch (error) {
      console.error("Error fetching price to MA:", error);
      return null;
    }
  }
}

export const technicalIndicators = new TechnicalIndicators();
