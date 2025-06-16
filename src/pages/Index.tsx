
import React from 'react';
import { MoneyControlScraper } from '@/components/MoneyControlScraper';
import { ApiKeySetup } from '@/components/ApiKeySetup';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
              MoneyControl Scraper
            </h1>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Extract financial data from MoneyControl website with advanced web scraping technology
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 pb-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* API Key Setup */}
            <div className="flex justify-center">
              <ApiKeySetup />
            </div>
            
            {/* Scraper Interface */}
            <div className="flex justify-center">
              <MoneyControlScraper />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-blue-300">
          <p>Powered by Firecrawl API • Built with React & TypeScript</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
