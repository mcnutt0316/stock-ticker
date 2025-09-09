import { StockData, MarketStackResponse, MarketStackData, PartialStockData } from '@/types/stock';

/**
 * Parse MarketStack API response or normalized StockData
 */
export function parseStockData(data: StockData | MarketStackResponse, symbol: string): StockData {
  // If it's already normalized StockData, return as-is
  if (isStockData(data)) {
    return data;
  }

  // If it's MarketStack API response, parse it
  if (isMarketStackResponse(data)) {
    return parseMarketStackData(data, symbol);
  }

  // Fallback: create minimal StockData with what we have
  return createFallbackStockData(symbol);
}

/**
 * Type guard to check if data is already normalized StockData
 */
function isStockData(data: any): data is StockData {
  return data && typeof data === 'object' && 
         'currentPrice' in data && 
         'symbol' in data;
}

/**
 * Type guard to check if data is MarketStack API response
 */
function isMarketStackResponse(data: any): data is MarketStackResponse {
  return data && typeof data === 'object' && 
         'data' in data && 
         Array.isArray(data.data) && 
         'pagination' in data;
}

/**
 * Parse MarketStack API response to normalized StockData
 */
function parseMarketStackData(response: MarketStackResponse, symbol: string): StockData {
  if (!response.data || response.data.length === 0) {
    return createFallbackStockData(symbol);
  }

  const marketData = response.data[0]; // Get the most recent data point
  
  // Calculate price change (using adj_close vs close for accuracy)
  const currentPrice = marketData.adj_close || marketData.close;
  const previousClose = marketData.adj_open || marketData.open;
  const change = currentPrice - previousClose;
  const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

  return {
    symbol: marketData.symbol || symbol,
    companyName: undefined, // MarketStack doesn't provide company name in basic plan
    currentPrice,
    previousClose,
    open: marketData.adj_open || marketData.open,
    high: marketData.adj_high || marketData.high,
    low: marketData.adj_low || marketData.low,
    volume: marketData.adj_volume || marketData.volume,
    change,
    changePercent,
    lastUpdated: marketData.date,
    currency: getCurrencyFromSymbol(marketData.symbol || symbol),
    exchange: marketData.exchange || 'Unknown',
    marketStatus: getMarketStatus(marketData.symbol || symbol)
  };
}

/**
 * Create fallback StockData when parsing fails
 */
function createFallbackStockData(symbol: string): StockData {
  return {
    symbol,
    companyName: undefined,
    currentPrice: 0,
    previousClose: 0,
    open: 0,
    high: 0,
    low: 0,
    volume: 0,
    change: 0,
    changePercent: 0,
    lastUpdated: new Date().toISOString(),
    currency: getCurrencyFromSymbol(symbol),
    exchange: 'Unknown'
  };
}

/**
 * Determine currency based on stock symbol/exchange
 */
function getCurrencyFromSymbol(symbol: string): string {
  // Common patterns for different markets
  if (symbol.endsWith('.TO')) return 'CAD'; // Toronto Stock Exchange
  if (symbol.endsWith('.L')) return 'GBP';   // London Stock Exchange
  if (symbol.endsWith('.PA')) return 'EUR';  // Euronext Paris
  if (symbol.endsWith('.T')) return 'JPY';   // Tokyo Stock Exchange
  if (symbol.endsWith('.HK')) return 'HKD';  // Hong Kong Stock Exchange
  if (symbol.endsWith('.AX')) return 'AUD';  // Australian Securities Exchange
  
  // Crypto patterns
  if (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('-USD')) {
    return 'USD'; // Most crypto is quoted in USD
  }
  
  // Default to USD for most US stocks
  return 'USD';
}

/**
 * Determine market status (simplified - would need real-time market hours in production)
 */
function getMarketStatus(symbol: string): 'open' | 'closed' | 'pre-market' | 'after-hours' | undefined {
  // This is a simplified implementation
  // In production, you'd check actual market hours based on exchange
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  // Weekend
  if (day === 0 || day === 6) return 'closed';
  
  // US market hours (EST) - simplified
  if (symbol.match(/^[A-Z]{1,5}$/)) { // Likely US stock
    if (hour >= 9 && hour < 16) return 'open';
    if (hour >= 4 && hour < 9) return 'pre-market';
    if (hour >= 16 && hour < 20) return 'after-hours';
    return 'closed';
  }
  
  return undefined; // Unknown for international markets
}