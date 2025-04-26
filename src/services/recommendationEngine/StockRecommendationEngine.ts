
import { StockData, StockRecommendation, MetricScore } from "@/types/stock";
import { indicators } from './indicatorConfig';
import { apiUtils } from './apiUtils';
import { technicalIndicators } from './technicalIndicators';
import { fundamentalIndicators } from './fundamentalIndicators';
import { sentimentIndicators } from './sentimentIndicators';
import { marketIndicators } from './marketIndicators';
import { macroIndicators } from './macroIndicators';
import { ExternalDataCache, IndicatorResult, AnalysisResults, StockAnalysis } from './types';

export class StockRecommendationEngine {
  private externalDataCache: ExternalDataCache = {};
  private readonly cacheDuration = 30 * 60 * 1000; // 30 minutes

  private async updateExternalData(force = false): Promise<void> {
    const now = new Date();
    if (!force && this.externalDataCache.lastUpdated && 
        (now.getTime() - this.externalDataCache.lastUpdated.getTime()) < this.cacheDuration) {
      return;
    }

    try {
      // Fetch market indicators
      const [vixRate, bondYield, consumerSentiment] = await Promise.all([
        marketIndicators.fetchVIXRate(),
        marketIndicators.fetchBondYield(),
        marketIndicators.fetchConsumerSentiment()
      ]);

      // Fetch macro indicators
      const [inflationRate, unemploymentRate, gdpGrowth, fedFundsRate] = await Promise.all([
        macroIndicators.fetchInflationRate(),
        macroIndicators.fetchUnemploymentRate(),
        macroIndicators.fetchGDPGrowthRate(),
        macroIndicators.fetchFedFundsRate()
      ]);

      this.externalDataCache = {
        VIX_Rate: vixRate,
        Bond_Yield: bondYield,
        Consumer_Sentiment: consumerSentiment,
        Inflation_Rate: inflationRate,
        Unemployment_Rate: unemploymentRate,
        GDP_Growth_Rate: gdpGrowth,
        Fed_Funds_Rate: fedFundsRate,
        lastUpdated: now
      };
    } catch (error) {
      console.error("Error updating external data:", error);
      this.externalDataCache.lastUpdated = now;
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
    const [rsi, movingAverageCross] = await Promise.all([
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

    // Combine all indicator values
    const indicatorValues = {
      RSI: rsi,
      Moving_Average_Cross: movingAverageCross,
      PE_Ratio: stockData.peRatio,
      Annual_Growth_Rate: growthRate,
      Analyst_Price_Projection: priceProjection,
      CEO_Strength: ceoStrength,
      Latest_Company_News: newsSentiment,
      ...this.externalDataCache
    };

    // Remove lastUpdated from evaluation
    const { lastUpdated, ...evaluationValues } = indicatorValues;

    // Evaluate all indicators
    for (const [name, value] of Object.entries(evaluationValues)) {
      const [score, recommendation] = this.evaluateIndicator(name, value);
      results[name] = { value, score, recommendation };
      totalScore += score;

      if (value !== null) {
        factors.push({
          name,
          value: Math.min(100, Math.max(0, 50 + score * 25)),
          description: `${name.replace(/_/g, ' ')}: ${typeof value === 'number' ? value.toFixed(2) : 'N/A'}. ${recommendation}`
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
