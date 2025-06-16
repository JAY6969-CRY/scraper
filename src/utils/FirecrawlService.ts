
import FirecrawlApp from '@mendable/firecrawl-js';

interface ErrorResponse {
  success: false;
  error: string;
}

interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('Firecrawl API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing Firecrawl API key...');
      this.firecrawlApp = new FirecrawlApp({ apiKey });
      
      // Test with a simple scrape to verify the API key
      const testResponse = await this.firecrawlApp.scrapeUrl('https://example.com');
      console.log('API key test response:', testResponse);
      
      return testResponse.success;
    } catch (error) {
      console.error('Error testing Firecrawl API key:', error);
      return false;
    }
  }

  static async crawlWebsite(url: string): Promise<{ success: boolean; error?: string; data?: any }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'API key not found' };
    }

    try {
      console.log('Starting crawl for MoneyControl URL:', url);
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      // Optimized crawl settings for MoneyControl
      const crawlResponse = await this.firecrawlApp.crawlUrl(url, {
        limit: 10, // Limit pages to avoid excessive usage
        scrapeOptions: {
          formats: ['markdown', 'html'],
          onlyMainContent: true, // Focus on main content
          includeTags: ['title', 'meta', 'h1', 'h2', 'h3', 'p', 'div', 'span', 'table'],
          excludeTags: ['script', 'style', 'nav', 'footer', 'header'],
        },
        allowBackwardCrawling: false,
        allowExternalContentLinks: false,
      }) as CrawlResponse;

      if (!crawlResponse.success) {
        console.error('Crawl failed:', (crawlResponse as ErrorResponse).error);
        return { 
          success: false, 
          error: (crawlResponse as ErrorResponse).error || 'Failed to crawl MoneyControl website' 
        };
      }

      const successResponse = crawlResponse as CrawlStatusResponse;
      console.log('Crawl completed successfully:', {
        status: successResponse.status,
        completed: successResponse.completed,
        total: successResponse.total,
        creditsUsed: successResponse.creditsUsed,
        dataLength: successResponse.data?.length || 0
      });

      return { 
        success: true,
        data: successResponse
      };
    } catch (error) {
      console.error('Error during MoneyControl crawl:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to Firecrawl API' 
      };
    }
  }
}
