
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FinancialDataService, StockData, MutualFundData } from '@/utils/FinancialDataService';
import { Search, TrendingUp, TrendingDown, RefreshCw, Activity } from 'lucide-react';

export const FinancialDataViewer = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [fundData, setFundData] = useState<MutualFundData | null>(null);
  const [marketIndices, setMarketIndices] = useState<StockData[]>([]);
  const [popularStocks] = useState(FinancialDataService.getPopularStocks());

  useEffect(() => {
    loadMarketIndices();
  }, []);

  const loadMarketIndices = async () => {
    try {
      const indices = await FinancialDataService.getMarketIndices();
      setMarketIndices(indices);
    } catch (error) {
      console.error('Error loading market indices:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setStockData(null);
    setFundData(null);

    try {
      console.log('Searching for:', searchQuery);
      
      // Try as stock symbol first
      const stock = await FinancialDataService.getStockData(searchQuery.toUpperCase());
      if (stock) {
        setStockData(stock);
        toast({
          title: "Stock Data Loaded",
          description: `Found data for ${stock.name}`,
        });
      } else {
        // Try as ISIN for mutual fund
        const fund = await FinancialDataService.getMutualFundData(searchQuery);
        if (fund) {
          setFundData(fund);
          toast({
            title: "Fund Data Loaded",
            description: `Found data for ${fund.name}`,
          });
        } else {
          toast({
            title: "No Data Found",
            description: "No financial data found for the entered symbol/ISIN",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error searching financial data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch financial data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(num);
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  return (
    <div className="w-full max-w-6xl space-y-6">
      {/* Search Section */}
      <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="h-6 w-6 text-blue-400" />
            Financial Data Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter stock symbol (e.g., RELIANCE) or ISIN for mutual funds"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 pl-10"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Popular Stocks Quick Access */}
            <div className="space-y-2">
              <p className="text-sm text-white/70">Quick search popular stocks:</p>
              <div className="flex flex-wrap gap-2">
                {popularStocks.slice(0, 5).map((stock) => (
                  <Button
                    key={stock.symbol}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(stock.symbol)}
                    className="bg-white/5 border-white/20 hover:bg-white/10 text-white text-xs"
                  >
                    {stock.symbol}
                  </Button>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Market Indices */}
      {marketIndices.length > 0 && (
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Market Indices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketIndices.map((index) => (
                <div key={index.symbol} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white text-sm">{index.name}</h3>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                      {index.symbol}
                    </Badge>
                  </div>
                  <div className="text-xl font-bold text-white mb-1">
                    {formatNumber(index.price, 0)}
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${getChangeColor(index.change)}`}>
                    {getChangeIcon(index.change)}
                    <span>{formatNumber(index.change, 2)}</span>
                    <span>({formatNumber(index.changePercent, 2)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Data Display */}
      {stockData && (
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Stock Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{stockData.name}</h3>
                  <p className="text-white/60">Symbol: {stockData.symbol}</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">
                    {formatCurrency(stockData.price)}
                  </div>
                  <div className={`flex items-center gap-2 text-lg ${getChangeColor(stockData.change)}`}>
                    {getChangeIcon(stockData.change)}
                    <span>{formatNumber(stockData.change, 2)}</span>
                    <span>({formatNumber(stockData.changePercent, 2)}%)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 text-sm">Volume</p>
                    <p className="text-white font-medium">{formatNumber(stockData.volume, 0)}</p>
                  </div>
                  {stockData.marketCap && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-white/60 text-sm">Market Cap</p>
                      <p className="text-white font-medium">{formatCurrency(stockData.marketCap)}</p>
                    </div>
                  )}
                </div>
                <div className="text-xs text-white/50">
                  Last updated: {new Date(stockData.lastUpdated).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mutual Fund Data Display */}
      {fundData && (
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Mutual Fund Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{fundData.name}</h3>
                  <p className="text-white/60">ISIN: {fundData.isin}</p>
                  <p className="text-white/60">AMC: {fundData.amc}</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">
                    {formatCurrency(fundData.nav)}
                  </div>
                  <div className={`flex items-center gap-2 text-lg ${getChangeColor(fundData.change)}`}>
                    {getChangeIcon(fundData.change)}
                    <span>{formatNumber(fundData.change, 2)}</span>
                    <span>({formatNumber(fundData.changePercent, 2)}%)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-xs text-white/50">
                  Last updated: {new Date(fundData.lastUpdated).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
