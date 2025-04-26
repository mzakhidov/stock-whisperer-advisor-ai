import { API_KEYS, API_URLS } from '../apiConfig';
import { formatDate } from '../utils/dateUtils';

export class APIUtils {
  private apiCallsThisMinute: number = 0;
  private apiCallsResetTime: Date = new Date();
  private readonly apiRateLimit: number = 5;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue: boolean = false;

  async checkRateLimit(): Promise<boolean> {
    const now = new Date();
    
    if (now.getTime() - this.apiCallsResetTime.getTime() > 60000) {
      this.apiCallsThisMinute = 0;
      this.apiCallsResetTime = now;
      return true;
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

  async processFetchQueue() {
    if (this.isProcessingQueue) return;
    
    this.isProcessingQueue = true;
    
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        await request();
        // Add a small delay between requests to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    this.isProcessingQueue = false;
  }

  queueFetchRequest(fetchFn: () => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const data = await fetchFn();
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
      
      // Start processing the queue if it's not already running
      if (!this.isProcessingQueue) {
        this.processFetchQueue();
      }
    });
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
    
    return this.queueFetchRequest(async () => {
      await this.checkRateLimit();
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`API error (${response.status}): ${url}`);
          if (response.status === 404) {
            // For 404s, return empty data instead of throwing
            return { results: [] };
          }
          throw new Error(`Polygon API error: ${response.status} ${response.statusText}`);
        }
        
        return response.json();
      } catch (error) {
        console.error(`Error fetching from ${url}:`, error);
        throw error;
      }
    });
  }

  async fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 2): Promise<Response> {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) return response;
        
        // If we get rate limited, wait and retry
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after') || '5';
          const waitTime = parseInt(retryAfter, 10) * 1000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        // Other error statuses, throw
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          // Exponential backoff
          const waitTime = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    
    throw lastError;
  }
}

export const apiUtils = new APIUtils();
