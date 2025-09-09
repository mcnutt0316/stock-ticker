'use client';

import { useEffect, useState } from "react";
import StockCard from "@/components/StockCard";
import { MarketStackResponse } from "@/types/stock";


export default function Home(){
  const [stockData, setStockData] = useState<MarketStackResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('api/stocks?symbol=AAPL')
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      setStockData(data);
      setLoading(false);
      setError(null);
    })
    .catch(err => {
      console.error('Failed to fetch stock data:', err);
      setError(err.message || 'Failed to fetch stock data');
      setLoading(false);
    });
  }, []);
  return(
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Stock Ticker</h1>
        <StockCard 
          symbol="AAPL"
          stockData={stockData}
          loading={loading}
          error={error}
          variant="default"
        />
      </div>
    </div>
  );
}


