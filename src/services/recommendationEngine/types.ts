
import { MetricScore, StockRecommendation } from "@/types/stock";

export interface IndicatorConfig {
  weight: number;
  buyThreshold: number;
  sellThreshold: number;
  buyBelow: boolean;
  sellAbove: boolean;
}

export interface Indicators {
  [key: string]: IndicatorConfig;
}

export interface IndicatorResult {
  value: number | null;
  score: number;
  recommendation: string;
}

export interface AnalysisResults {
  [key: string]: IndicatorResult;
}

export interface ExternalDataCache {
  [key: string]: number | null | Date;
  lastUpdated?: Date;
}

export interface StockAnalysis {
  score: number;
  recommendation: StockRecommendation;
  results: AnalysisResults;
  factors: MetricScore[];
}
