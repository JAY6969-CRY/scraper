
interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  lastUpdated: string;
}

interface MutualFundData {
  isin: string;
  name: string;
  amc: string;
  nav: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

interface ETFData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  lastUpdated: string;
}

export class FinancialDataService {
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static stockCache = new Map<string, { data: StockData; timestamp: number }>();
  private static fundCache = new Map<string, { data: MutualFundData; timestamp: number }>();

  // Popular Indian stocks for demo
  private static POPULAR_STOCKS = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd' },
    { symbol: 'TCS', name: 'Tata Consultancy Services Ltd' },
    { symbol: 'INFY', name: 'Infosys Ltd' },
    { symbol: 'HDFC', name: 'HDFC Bank Ltd' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd' },
    { symbol: 'SBIN', name: 'State Bank of India' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd' },
    { symbol: 'ITC', name: 'ITC Ltd' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd' },
    { symbol: 'LT', name: 'Larsen & Toubro Ltd' }
  ];

  static async getStockData(symbol: string): Promise<StockData | null> {
    console.log(`Fetching stock data for ${symbol}`);
    
    // Check cache first
    const cached = this.stockCache.get(symbol);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`Returning cached data for ${symbol}`);
      return cached.data;
    }

    try {
      // Since we can't use real APIs in demo, we'll generate mock data
      const stockInfo = this.POPULAR_STOCKS.find(s => s.symbol === symbol) || 
                       { symbol, name: `${symbol} Ltd` };
      
      const mockData: StockData = {
        symbol: stockInfo.symbol,
        name: stockInfo.name,
        price: Math.random() * 3000 + 100, // Random price between 100-3100
        change: (Math.random() - 0.5) * 100, // Random change between -50 to +50
        changePercent: (Math.random() - 0.5) * 10, // Random % change between -5% to +5%
        volume: Math.floor(Math.random() * 1000000) + 10000,
        marketCap: Math.random() * 500000 + 10000,
        lastUpdated: new Date().toISOString()
      };

      // Cache the data
      this.stockCache.set(symbol, { data: mockData, timestamp: Date.now() });
      
      console.log(`Stock data fetched for ${symbol}:`, mockData);
      return mockData;
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      return null;
    }
  }

  static async getMutualFundData(isin: string): Promise<MutualFundData | null> {
    console.log(`Fetching mutual fund data for ${isin}`);
    
    // Check cache first
    const cached = this.fundCache.get(isin);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`Returning cached fund data for ${isin}`);
      return cached.data;
    }

    try {
      // Mock mutual fund data
      const mockData: MutualFundData = {
        isin,
        name: `Sample Mutual Fund (${isin.slice(-4)})`,
        amc: ['SBI', 'HDFC', 'ICICI', 'Aditya Birla', 'UTI'][Math.floor(Math.random() * 5)],
        nav: Math.random() * 100 + 10, // Random NAV between 10-110
        change: (Math.random() - 0.5) * 5, // Random change between -2.5 to +2.5
        changePercent: (Math.random() - 0.5) * 3, // Random % change between -1.5% to +1.5%
        lastUpdated: new Date().toISOString()
      };

      // Cache the data
      this.fundCache.set(isin, { data: mockData, timestamp: Date.now() });
      
      console.log(`Mutual fund data fetched for ${isin}:`, mockData);
      return mockData;
    } catch (error) {
      console.error(`Error fetching mutual fund data for ${isin}:`, error);
      return null;
    }
  }

  static async getMarketIndices(): Promise<StockData[]> {
    console.log('Fetching market indices data');
    
    const indices = [
      { symbol: 'NIFTY50', name: 'Nifty 50' },
      { symbol: 'SENSEX', name: 'BSE Sensex' },
      { symbol: 'BANKNIFTY', name: 'Bank Nifty' },
      { symbol: 'NIFTYIT', name: 'Nifty IT' }
    ];

    const results: StockData[] = [];
    
    for (const index of indices) {
      const data = await this.getStockData(index.symbol);
      if (data) {
        results.push({
          ...data,
          name: index.name,
          price: data.price * 100, // Scale up for indices
          marketCap: undefined // Indices don't have market cap
        });
      }
    }

    return results;
  }

  static getPopularStocks(): { symbol: string; name: string }[] {
    return this.POPULAR_STOCKS;
  }

  static clearCache(): void {
    this.stockCache.clear();
    this.fundCache.clear();
    console.log('Financial data cache cleared');
  }
}

export type { StockData, MutualFundData, ETFData };
