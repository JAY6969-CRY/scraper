
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Code, Download, ExternalLink, TrendingUp } from 'lucide-react';

interface ScrapedDataDisplayProps {
  data: any[];
}

export const ScrapedDataDisplay: React.FC<ScrapedDataDisplayProps> = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState(0);

  if (!data || data.length === 0) {
    return (
      <Card className="backdrop-blur-lg bg-white/10 border-white/20">
        <CardContent className="pt-6 text-center">
          <p className="text-white/70">No data found</p>
        </CardContent>
      </Card>
    );
  }

  const downloadData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'moneycontrol-scraped-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Scraped Financial Data
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              {data.length} {data.length === 1 ? 'Page' : 'Pages'}
            </Badge>
          </CardTitle>
          <Button
            onClick={downloadData}
            variant="outline"
            size="sm"
            className="bg-white/5 border-white/20 hover:bg-white/10 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Download JSON
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pages List */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-3">Scraped Pages</h3>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {data.map((item, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedItem === index
                        ? 'bg-blue-500/20 border-blue-500/50'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedItem(index)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white truncate">
                            {item.metadata?.title || `Page ${index + 1}`}
                          </h4>
                          <p className="text-xs text-white/60 mt-1 truncate">
                            {item.metadata?.sourceURL || 'No URL'}
                          </p>
                        </div>
                        {item.metadata?.sourceURL && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(item.metadata.sourceURL, '_blank');
                            }}
                          >
                            <ExternalLink className="h-3 w-3 text-white/60" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Content Display */}
          <div className="lg:col-span-2">
            {data[selectedItem] && (
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/5">
                  <TabsTrigger value="content" className="text-white data-[state=active]:bg-white/20">
                    <FileText className="h-4 w-4 mr-2" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="metadata" className="text-white data-[state=active]:bg-white/20">
                    <Code className="h-4 w-4 mr-2" />
                    Metadata
                  </TabsTrigger>
                  <TabsTrigger value="raw" className="text-white data-[state=active]:bg-white/20">
                    <Code className="h-4 w-4 mr-2" />
                    Raw Data
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="mt-4">
                  <Card className="bg-white/5 border-white/20">
                    <CardContent className="p-4">
                      <ScrollArea className="h-96">
                        <div className="prose prose-invert max-w-none">
                          {data[selectedItem].markdown ? (
                            <pre className="whitespace-pre-wrap text-sm text-white/90 font-mono">
                              {data[selectedItem].markdown}
                            </pre>
                          ) : (
                            <div 
                              className="text-white/90"
                              dangerouslySetInnerHTML={{ 
                                __html: data[selectedItem].html || 'No content available' 
                              }}
                            />
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="metadata" className="mt-4">
                  <Card className="bg-white/5 border-white/20">
                    <CardContent className="p-4">
                      <ScrollArea className="h-96">
                        <pre className="text-sm text-white/90 font-mono whitespace-pre-wrap">
                          {JSON.stringify(data[selectedItem].metadata || {}, null, 2)}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="raw" className="mt-4">
                  <Card className="bg-white/5 border-white/20">
                    <CardContent className="p-4">
                      <ScrollArea className="h-96">
                        <pre className="text-sm text-white/90 font-mono whitespace-pre-wrap">
                          {JSON.stringify(data[selectedItem], null, 2)}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
