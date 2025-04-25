
import { API_KEYS, API_URLS } from '../apiConfig';
import { formatDate } from '../utils/dateUtils';

export class APIUtils {
  private apiCallsThisMinute: number = 0;
  private apiCallsResetTime: Date = new Date();
  private readonly apiRateLimit: number = 5;

  async checkRateLimit(): Promise<boolean> {
    const now = new Date();
    
    if (now.getTime() - this.apiCallsResetTime.getTime() > 60000) {
      this.apiCallsThisMinute = 0;
      this.apiCallsResetTime = now;
    }
    
    if (this.apiCallsThisMinute >= this.apiRateLimit) {
      const waitTime = 60000 - (now.getTime() - this.apiCallsResetTime.getTime());
      console.log(`Rate limit hit. Waiting ${waitTime}ms before next call`);
      await new Promise(resolve => setTimeout(resolve, waitTime + 100));
      this.apiCallsThisMinute = 0;
      this.apiCallsResetTime = new Date();
    }
    
    this.apiCallsThisMinute++;
    return true;
  }

  async fetchPolygonAPI(endpoint: string, params: {[key: string]: string} = {}): Promise<any> {
    if (!API_KEYS.POLYGON) {
      throw new Error("Polygon API key not configured");
    }
    
    params = { ...params, apiKey: API_KEYS.POLYGON };
    
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    const url = `${API_URLS.POLYGON}${endpoint}${endpoint.includes('?') ? '&' : '?'}${queryString}`;
    
    await this.checkRateLimit();
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
}

export const apiUtils = new APIUtils();
