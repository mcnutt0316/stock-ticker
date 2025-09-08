'use client';

import { useEffect, useState } from "react";


export default function Home(){
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('api/stocks?symbol=AAPL')
    .then(res => res.json())
    .then(data => {
      setStockData(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);
  if (loading) return <div>Loading...</div>;
  return(
    <div>
      <h1>Stock Ticker</h1>
      <pre>{JSON.stringify(stockData, null, 2)}</pre>
    </div>
  );
}


