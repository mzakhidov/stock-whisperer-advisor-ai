
import { StockData, StockRecommendation, MetricScore } from "@/types/stock";
import { indicators } from './indicatorConfig';
import { apiUtils } from './apiUtils';
import { technicalIndicators } from './technicalIndicators';
import { fundamentalIndicators } from './fundamentalIndicators';
import { sentimentIndicators } from './sentimentIndicators';
import { ExternalDataCache, IndicatorResult, AnalysisResults, StockAnalysis } from './types';

export class StockRecommendationEngine {
  private externalDataCache: ExternalDataCache = {};
  private externalDataTimestamp: Date | null = null;

  private async updateExternalData(force = false): Promise<void> {
    if (!force && this.externalDataTimestamp && 
        (new Date().getTime() - this.externalDataTimestamp.getTime()) < 86400000) {
      return;
    }

    try {
      const externalData: ExternalDataCache = {};

      // Fetch VIX for market sentiment
      const vixData = await apiUtils.fetchPolygonAPI(`/aggs/ticker/VIX/prev`);
      if (vixData.results?.[0]) {
        externalData['Market_Sentiment'] = Math.max(-100, Math.min(100, (25 - vixData.results[0].c) * 5));
      }

      // Fetch major indices for macroeconomic health
      const indicesData = await apiUtils.fetchPolygonAPI(`/snapshot/locale/us/markets/indices/tickers`);
      if (indicesData.tickers) {
        const indices = indicesData.tickers.filter((index: any) => 
          ['SPY', 'QQQ', 'DIA', 'IWM'].includes(index.ticker));
        
        const avgChange = indices.reduce((sum: number, index: any) => {
          if (index.day?.c && index.prevDay?.c) {
            return sum + ((index.day.c - index.prevDay.c) / index.prevDay.c);
          }
          return sum;
        }, 0) / indices.length;
        
        externalData['Macroeconomics'] = Math.max(-1, Math.min(1, avgChange * 50));
      }

      // Store the data and timestamp
      this.externalDataCache = externalData;
      this.externalDataTimestamp = new Date();
    } catch (error) {
      console.error("Error updating external data:", error);
      this.externalDataCache = {};
      this.externalDataTimestamp = new Date();
    }
  }

  private evaluateIndicator(indicatorName: string, value: number | null): [number, string] {
    if (value === null) return [0, "Neutral (No Data)"];
    
    const indicator = indicators[indicatorName];
    if (!indicator) return [0, "Neutral (Unknown Indicator)"];
    
    const { weight, buyThreshold, sellThreshold, buyBelow, sellAbove } = indicator;
    
    if ((buyBelow && value <= buyThreshold) || (!buyBelow && value >= buyThreshold)) {
      return [weight, "Buy"];
    }
    
    if ((sellAbove && value >= sellThreshold) || (!sellAbove && value <= sellThreshold)) {
      return [-weight, "Sell"];
    }
    
    return [0, "Neutral"];
  }

  public async analyzeStock(stockData: StockData): Promise<StockAnalysis> {
    await this.updateExternalData();
    
    const results: AnalysisResults = {};
    let totalScore = 0;
    const factors: MetricScore[] = [];

    // Fetch and evaluate technical indicators
    const [rsiValue, maValue] = await Promise.all([
      technicalIndicators.fetchRSI(stockData.ticker),
      technicalIndicators.fetchMovingAverages(stockData.ticker)
    ]);

    // Fetch and evaluate fundamental indicators
    const [growthRate, priceProjection] = await Promise.all([
      fundamentalIndicators.fetchAnnualGrowthRate(stockData.ticker),
      fundamentalIndicators.fetchAnalystPriceProjections(stockData.ticker, stockData.price)
    ]);

    // Fetch and evaluate sentiment indicators
    const [ceoStrength, newsSentiment] = await Promise.all([
      sentimentIndicators.fetchCEOStrength(stockData.ticker),
      sentimentIndicators.fetchNewsSentiment(stockData.ticker)
    ]);

    // Evaluate all indicators and calculate total score
    const indicatorValues = {
      RSI: rsiValue,
      Moving_Average_Cross: maValue,
      Annual_Growth_Rate: growthRate,
      Analyst_Price_Projection: priceProjection,
      CEO_Strength: ceoStrength,
      Latest_Company_News: newsSentiment,
      ...this.externalDataCache
    };

    for (const [name, value] of Object.entries(indicatorValues)) {
      const [score, recommendation] = this.evaluateIndicator(name, value);
      results[name] = { value, score, recommendation };
      totalScore += score;

      if (value !== null) {
        factors.push({
          name,
          value: Math.min(100, Math.max(0, 50 + score * 25)),
          description: `${name}: ${value.toFixed(1)}. ${recommendation}`
        });
      }
    }

    // Determine final recommendation
    let recommendation: StockRecommendation;
    if (totalScore >= 3) recommendation = "Strong Buy";
    else if (totalScore >= 1) recommendation = "Buy";
    else if (totalScore <= -3) recommendation = "Strong Sell";
    else if (totalScore <= -1) recommendation = "Sell";
    else recommendation = "Hold";

    return { score: totalScore, recommendation, results, factors };
  }
}

const stockRecommendationEngine = new StockRecommendationEngine();
export default stockRecommendationEngine;
