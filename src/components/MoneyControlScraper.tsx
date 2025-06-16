
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FirecrawlService } from '@/utils/FirecrawlService';
import { ScrapedDataDisplay } from '@/components/ScrapedDataDisplay';
import { Globe, Search, TrendingUp, DollarSign } from 'lucide-react';

interface ScrapeResult {
  success: boolean;
  status?: string;
  completed?: number;
  total?: number;
  creditsUsed?: number;
  expiresAt?: string;
  data?: any[];
}

export const MoneyControlScraper = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('https://www.moneycontrol.com/');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrapeResult, setScrapeResult] = useState<ScrapeResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const apiKey = FirecrawlService.getApiKey();
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please set your Firecrawl API key first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setScrapeResult(null);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 500);
    
    try {
      console.log('Starting scrape for MoneyControl URL:', url);
      const result = await FirecrawlService.crawlWebsite(url);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "MoneyControl data scraped successfully!",
        });
        setScrapeResult(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to scrape website",
          variant: "destructive",
        });
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error scraping MoneyControl:', error);
      toast({
        title: "Error",
        description: "Failed to scrape MoneyControl website",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Scraper Form */}
      <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-xl">
            <Globe className="h-6 w-6 text-blue-400" />
            MoneyControl Data Scraper
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url" className="text-white/80 font-medium">
                MoneyControl URL
              </Label>
              <div className="relative">
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 pl-10"
                  placeholder="https://www.moneycontrol.com/..."
                  required
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              </div>
            </div>

            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white/70">
                  <span>Scraping in progress...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium py-3 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <TrendingUp className="h-4 w-4 mr-2 animate-pulse" />
                  Scraping MoneyControl...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Start Scraping
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Display */}
      {scrapeResult && (
        <div className="space-y-4">
          {/* Stats Overview */}
          <Card className="backdrop-blur-lg bg-white/10 border-white/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{scrapeResult.completed || 0}</div>
                  <div className="text-sm text-white/70">Pages Scraped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{scrapeResult.total || 0}</div>
                  <div className="text-sm text-white/70">Total Pages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{scrapeResult.creditsUsed || 0}</div>
                  <div className="text-sm text-white/70">Credits Used</div>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                    {scrapeResult.status || 'Completed'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scraped Data */}
          <ScrapedDataDisplay data={scrapeResult.data} />
        </div>
      )}
    </div>
  );
};
