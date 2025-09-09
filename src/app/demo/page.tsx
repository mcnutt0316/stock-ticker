'use client';

import { useState } from "react";
import StockCard from "@/components/StockCard";
import { MarketStackResponse } from "@/types/stock";

// Mock data for testing different scenarios
const mockStockData: Record<string, MarketStackResponse> = {
  AAPL: {
    pagination: { limit: 1, offset: 0, count: 1, total: 1 },
    data: [{
      open: 150.00,
      high: 155.50,
      low: 149.20,
      close: 154.12,
      volume: 89234567,
      adj_high: 155.50,
      adj_low: 149.20,
      adj_close: 154.12,
      adj_open: 150.00,
      adj_volume: 89234567,
      split_factor: 1,
      dividend: 0,
      symbol: 'AAPL',
      exchange: 'NASDAQ',
      date: new Date().toISOString()
    }]
  },
  GOOGL: {
    pagination: { limit: 1, offset: 0, count: 1, total: 1 },
    data: [{
      open: 2800.00,
      high: 2850.75,
      low: 2790.30,
      close: 2845.20,
      volume: 1234567,
      adj_high: 2850.75,
      adj_low: 2790.30,
      adj_close: 2845.20,
      adj_open: 2800.00,
      adj_volume: 1234567,
      split_factor: 1,
      dividend: 0,
      symbol: 'GOOGL',
      exchange: 'NASDAQ',
      date: new Date().toISOString()
    }]
  },
  TSLA: {
    pagination: { limit: 1, offset: 0, count: 1, total: 1 },
    data: [{
      open: 245.00,
      high: 248.90,
      low: 240.15,
      close: 242.80,
      volume: 45678901,
      adj_high: 248.90,
      adj_low: 240.15,
      adj_close: 242.80,
      adj_open: 245.00,
      adj_volume: 45678901,
      split_factor: 1,
      dividend: 0,
      symbol: 'TSLA',
      exchange: 'NASDAQ',
      date: new Date().toISOString()
    }]
  }
};

export default function DemoPage() {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [variant, setVariant] = useState<'compact' | 'default' | 'expanded'>('default');
  const [showLoading, setShowLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const stocks = ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'AMZN', 'META'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
            Stock Cards Demo
          </h1>
          
          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex gap-2">
              <label className="font-semibold text-gray-700">Layout:</label>
              <button
                onClick={() => setLayout('grid')}
                className={`px-3 py-1 rounded ${layout === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`px-3 py-1 rounded ${layout === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                List
              </button>
            </div>
            
            <div className="flex gap-2">
              <label className="font-semibold text-gray-700">Variant:</label>
              <button
                onClick={() => setVariant('compact')}
                className={`px-3 py-1 rounded ${variant === 'compact' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              >
                Compact
              </button>
              <button
                onClick={() => setVariant('default')}
                className={`px-3 py-1 rounded ${variant === 'default' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              >
                Default
              </button>
              <button
                onClick={() => setVariant('expanded')}
                className={`px-3 py-1 rounded ${variant === 'expanded' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              >
                Expanded
              </button>
            </div>
            
            <div className="flex gap-2">
              <label className="font-semibold text-gray-700">States:</label>
              <button
                onClick={() => setShowLoading(!showLoading)}
                className={`px-3 py-1 rounded ${showLoading ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
              >
                Loading
              </button>
              <button
                onClick={() => setShowError(!showError)}
                className={`px-3 py-1 rounded ${showError ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
              >
                Error
              </button>
            </div>
          </div>
        </div>

        {/* Stock Cards Container */}
        <div className={`
          ${layout === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'flex flex-col max-w-2xl mx-auto gap-4'
          }
        `}>
          {stocks.map((symbol, index) => (
            <StockCard
              key={symbol}
              symbol={symbol}
              stockData={mockStockData[symbol] || null}
              loading={showLoading}
              error={showError ? `Failed to load ${symbol} data` : null}
              variant={variant}
              className={layout === 'list' ? 'w-full' : ''}
            />
          ))}
        </div>

        {/* Additional Examples Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Special States Examples
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Loading Example */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Loading State</h3>
              <StockCard
                symbol="NVDA"
                stockData={null}
                loading={true}
                variant="default"
              />
            </div>

            {/* Error Examples */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Network Error</h3>
              <StockCard
                symbol="INVALID"
                stockData={null}
                loading={false}
                error="Network connection failed to reach API endpoint"
                variant="default"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">API Key Error</h3>
              <StockCard
                symbol="TEST"
                stockData={null}
                loading={false}
                error="API key not configured or limit exceeded"
                variant="default"
              />
            </div>

            {/* Empty Example */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Empty State</h3>
              <StockCard
                symbol="EMPTY"
                stockData={null}
                loading={false}
                error={null}
                variant="default"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}