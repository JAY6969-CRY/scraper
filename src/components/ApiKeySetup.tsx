
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FirecrawlService } from '@/utils/FirecrawlService';
import { Key, Check, X, Eye, EyeOff } from 'lucide-react';

export const ApiKeySetup = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const existingKey = FirecrawlService.getApiKey();
    if (existingKey) {
      setIsKeySet(true);
      setApiKey(existingKey);
    }
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setIsTestingKey(true);
    console.log('Testing Firecrawl API key...');
    
    try {
      const isValid = await FirecrawlService.testApiKey(apiKey);
      
      if (isValid) {
        FirecrawlService.saveApiKey(apiKey);
        setIsKeySet(true);
        toast({
          title: "Success",
          description: "API key saved and verified successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid API key. Please check and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error testing API key:', error);
      toast({
        title: "Error",
        description: "Failed to verify API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('firecrawl_api_key');
    setApiKey('');
    setIsKeySet(false);
    toast({
      title: "Success",
      description: "API key removed successfully",
    });
  };

  return (
    <Card className="w-full max-w-md backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-white">
          <Key className="h-5 w-5" />
          Firecrawl API Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isKeySet ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                <Check className="h-3 w-3 mr-1" />
                API Key Configured
              </Badge>
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Current API Key</Label>
              <div className="flex gap-2">
                <Input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  readOnly
                  className="bg-white/5 border-white/20 text-white/90"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowKey(!showKey)}
                  className="bg-white/5 border-white/20 hover:bg-white/10"
                >
                  {showKey ? <EyeOff className="h-4 w-4 text-white/70" /> : <Eye className="h-4 w-4 text-white/70" />}
                </Button>
              </div>
            </div>
            <Button
              onClick={handleRemoveKey}
              variant="destructive"
              className="w-full bg-red-500/20 hover:bg-red-500/30 border-red-500/30"
            >
              <X className="h-4 w-4 mr-2" />
              Remove API Key
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-white/80">
                Firecrawl API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="fc-your-api-key-here"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            <Button
              onClick={handleSaveApiKey}
              disabled={isTestingKey}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              {isTestingKey ? "Verifying..." : "Save & Verify API Key"}
            </Button>
            <p className="text-xs text-white/60 text-center">
              Get your API key from{' '}
              <a
                href="https://firecrawl.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                firecrawl.dev
              </a>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
