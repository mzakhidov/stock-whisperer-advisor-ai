
import { apiUtils } from './apiUtils';
import { formatDate } from '../utils/dateUtils';

export class SentimentIndicators {
  async fetchCEOStrength(ticker: string): Promise<number | null> {
    try {
      const [companyInfo, news] = await Promise.all([
        apiUtils.fetchPolygonAPI(`/reference/tickers/${ticker}`),
        apiUtils.fetchPolygonAPI(`/reference/news`, {
          ticker,
          order: "desc",
          limit: "50",
          sort: "published_utc",
          published_utc: {
            gte: formatDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)),
            lte: formatDate(new Date())
          }
        })
      ]);
      
      if (!companyInfo.results) return null;
      
      let ceoNewsCount = 0;
      let positiveMentions = 0;
      
      if (news.results && companyInfo.results.branding?.ceo) {
        const ceoName = companyInfo.results.branding.ceo;
        
        news.results.forEach((article: any) => {
          if (article.description?.includes(ceoName)) {
            ceoNewsCount++;
            
            const positiveWords = ["positive", "growth", "success", "innovation", 
              "leadership", "profit", "beat", "exceed", "strong", "vision"];
            
            if (positiveWords.some(word => 
              article.description.toLowerCase().includes(word))) {
              positiveMentions++;
            }
          }
        });
      }
      
      return ceoNewsCount > 0 ? 1 + Math.min(4, Math.round((positiveMentions / ceoNewsCount) * 4)) : 3;
    } catch (error) {
      console.error("Error fetching CEO strength:", error);
      return null;
    }
  }

  async fetchNewsSentiment(ticker: string): Promise<number | null> {
    try {
      const endDate = formatDate(new Date());
      const startDate = formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
      
      const news = await apiUtils.fetchPolygonAPI(`/reference/news`, {
        ticker,
        order: "desc",
        limit: "20",
        sort: "published_utc",
        published_utc: {
          gte: startDate,
          lte: endDate
        }
      });
      
      if (!news.results?.length) return null;
      
      const positiveWords = ["up", "rise", "gain", "positive", "buy", "bullish", 
        "growth", "success", "innovation", "profit", "beat", "exceed", "strong"];
      
      const negativeWords = ["down", "fall", "drop", "negative", "sell", "bearish", 
        "loss", "fail", "bankruptcy", "weak", "miss", "below", "poor"];
      
      let positiveCount = 0;
      let negativeCount = 0;
      
      news.results.forEach((article: any) => {
        if (article.title) {
          const title = article.title.toLowerCase();
          if (positiveWords.some(word => title.includes(word))) positiveCount++;
          if (negativeWords.some(word => title.includes(word))) negativeCount++;
        }
      });
      
      if (positiveCount + negativeCount > 0) {
        if (positiveCount > negativeCount * 2) return 1;
        if (negativeCount > positiveCount * 2) return -1;
        if (positiveCount > negativeCount) return 0.5;
        if (negativeCount > positiveCount) return -0.5;
      }
      
      return 0;
    } catch (error) {
      console.error("Error fetching news sentiment:", error);
      return null;
    }
  }
}

export const sentimentIndicators = new SentimentIndicators();
