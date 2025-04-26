
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
          "published_utc.gte": formatDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)),
          "published_utc.lte": formatDate(new Date())
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
        "published_utc.gte": startDate,
        "published_utc.lte": endDate
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

  async fetchInsiderTrading(ticker: string): Promise<number | null> {
    try {
      const endDate = formatDate(new Date());
      const startDate = formatDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));
      
      const data = await apiUtils.fetchPolygonAPI(`/reference/tickers/${ticker}/insiders`, {
        limit: "50",
        "reported_date.gte": startDate,
        "reported_date.lte": endDate
      });
      
      if (!data.results?.length) return null;
      
      let buyVolume = 0;
      let sellVolume = 0;
      
      data.results.forEach((trade: any) => {
        const shares = trade.shares || 0;
        if (trade.is_purchase) buyVolume += shares;
        else sellVolume += shares;
      });
      
      const totalVolume = buyVolume + sellVolume;
      if (totalVolume === 0) return null;
      
      const buyRatio = buyVolume / totalVolume;
      
      // Convert to a score
      if (buyRatio > 0.8) return 90; // Strong insider buying
      if (buyRatio > 0.6) return 70;
      if (buyRatio > 0.4) return 50; // Neutral
      if (buyRatio > 0.2) return 30;
      return 10; // Strong insider selling
    } catch (error) {
      console.error("Error fetching insider trading:", error);
      return null;
    }
  }

  async fetchMarketSentiment(): Promise<number | null> {
    try {
      const [vixData, newsData] = await Promise.all([
        apiUtils.fetchPolygonAPI('/aggs/ticker/VIX/prev'),
        apiUtils.fetchPolygonAPI('/reference/news', {
          limit: "20",
          order: "desc",
          sort: "published_utc"
        })
      ]);
      
      const vixValue = vixData.results?.[0]?.c || null;
      
      // Calculate sentiment from VIX (Volatility Index)
      let vixSentiment = 0;
      if (vixValue !== null) {
        if (vixValue < 15) vixSentiment = 20; // Very low volatility, extreme complacency
        else if (vixValue < 20) vixSentiment = 10; // Low volatility, market complacent
        else if (vixValue < 25) vixSentiment = 0; // Normal volatility
        else if (vixValue < 30) vixSentiment = -10; // High volatility, moderate fear
        else vixSentiment = -20; // Very high volatility, extreme fear
      }
      
      // Calculate sentiment from market news
      let newsSentiment = 0;
      if (newsData.results) {
        const marketTerms = ["market", "stock", "index", "S&P", "Nasdaq", "Dow"];
        const positiveWords = ["up", "rise", "gain", "positive", "rally", "bullish", "growth"];
        const negativeWords = ["down", "fall", "drop", "negative", "decline", "bearish", "fear"];
        
        let marketNewsCount = 0;
        let positiveCount = 0;
        let negativeCount = 0;
        
        newsData.results.forEach((article: any) => {
          if (article.title) {
            const title = article.title.toLowerCase();
            const isMarketNews = marketTerms.some(term => title.includes(term.toLowerCase()));
            
            if (isMarketNews) {
              marketNewsCount++;
              if (positiveWords.some(word => title.includes(word))) positiveCount++;
              if (negativeWords.some(word => title.includes(word))) negativeCount++;
            }
          }
        });
        
        if (marketNewsCount > 0) {
          if (positiveCount > negativeCount * 1.5) newsSentiment = 10;
          else if (positiveCount > negativeCount) newsSentiment = 5;
          else if (negativeCount > positiveCount * 1.5) newsSentiment = -10;
          else if (negativeCount > positiveCount) newsSentiment = -5;
        }
      }
      
      return vixSentiment + newsSentiment;
    } catch (error) {
      console.error("Error fetching market sentiment:", error);
      return null;
    }
  }
}

export const sentimentIndicators = new SentimentIndicators();
