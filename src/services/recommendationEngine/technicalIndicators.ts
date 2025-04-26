import { apiUtils } from './apiUtils';
import { formatDate } from '../utils/dateUtils';

export class TechnicalIndicators {
  async fetchRSI(ticker: string): Promise<number | null> {
    try {
      const endDate = formatDate(new Date());
      const startDate = formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
      
      const data = await apiUtils.fetchPolygonAPI(`/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}`, {
        adjusted: "true",
        sort: "asc",
        limit: "30"
      });
      
      if (!data.results || data.results.length < 14) return null;
      
      const closes = data.results.map((bar: any) => bar.c);
      const gains: number[] = [];
      const losses: number[] = [];
      
      for (let i = 1; i < closes.length; i++) {
        const change = closes[i] - closes[i - 1];
        gains.push(Math.max(0, change));
        losses.push(Math.max(0, -change));
      }
      
      const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / 14;
      const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / 14;
      
      if (avgLoss === 0) return 100;
      
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      
      return rsi;
    } catch (error) {
      console.error("Error calculating RSI:", error);
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

      const recentVolumes = data.results.map((day: any) => day.v);
      const avgVolume = recentVolumes.reduce((sum: number, vol: number) => sum + vol, 0) / recentVolumes.length;
      
      const recentFiveDayVolumes = recentVolumes.slice(-5);
      const avgRecentVolume = recentFiveDayVolumes.reduce((sum: number, vol: number) => sum + vol, 0) / 5;
      
      const volumeRatio = avgRecentVolume / avgVolume;
      
      if (volumeRatio > 1.5) return 80;
      if (volumeRatio > 1.2) return 65;
      if (volumeRatio < 0.7) return 35;
      if (volumeRatio < 0.5) return 20;
      
      return 50;
    } catch (error) {
      console.error("Error fetching volume indicator:", error);
      return null;
    }
  }

  async fetchPriceToMA(ticker: string): Promise<number | null> {
    try {
      const endDate = formatDate(new Date());
      const startDate = formatDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000));
      
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
      
      const priceDiff = ((currentPrice - ma50) / ma50) * 100;
      
      if (priceDiff > 20) return 85;
      if (priceDiff > 10) return 70;
      if (priceDiff < -15) return 25;
      if (priceDiff < -7) return 40;
      
      return 50;
    } catch (error) {
      console.error("Error fetching price to MA:", error);
      return null;
    }
  }
}

export const technicalIndicators = new TechnicalIndicators();
