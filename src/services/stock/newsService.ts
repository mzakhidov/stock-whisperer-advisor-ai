
import { API_KEYS, API_URLS } from '../apiConfig';

export const fetchStockNews = async (ticker: string): Promise<any[] | null> => {
  try {
    if (API_KEYS.POLYGON) {
      const response = await fetch(
        `${API_URLS.POLYGON}/reference/news?ticker=${ticker}&order=desc&limit=10&sort=published_utc&apiKey=${API_KEYS.POLYGON}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results.map((article: any) => {
          const title = article.title.toLowerCase();
          let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
          
          const positiveWords = ["up", "rise", "gain", "positive", "buy", "bullish", 
            "growth", "success", "innovation", "profit", "beat", "exceed", "strong"];
          
          const negativeWords = ["down", "fall", "drop", "negative", "sell", "bearish", 
            "loss", "fail", "bankruptcy", "weak", "miss", "below", "poor"];
          
          const hasPositiveWords = positiveWords.some(word => title.includes(word));
          const hasNegativeWords = negativeWords.some(word => title.includes(word));
          
          if (hasPositiveWords && !hasNegativeWords) sentiment = 'positive';
          if (hasNegativeWords && !hasPositiveWords) sentiment = 'negative';
          
          return {
            headline: article.title,
            sentiment: sentiment,
            date: new Date(article.published_utc).toISOString().split('T')[0],
            url: article.article_url
          };
        });
      }
    }
    return [];
  } catch (error) {
    console.error("Error fetching stock news:", error);
    return null;
  }
};
