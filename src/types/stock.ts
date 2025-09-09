// MarketStack API response structure
export interface MarketStackResponse {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: MarketStackData[];
}

// Individual stock data from MarketStack API
export interface MarketStackData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adj_high: number;
  adj_low: number;
  adj_close: number;
  adj_open: number;
  adj_volume: number;
  split_factor: number;
  dividend: number;
  symbol: string;
  exchange: string;
  date: string;
}

// Normalized stock data for component use
export interface StockData {
  symbol: string;
  companyName?: string;
  currentPrice: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  currency: string;
  exchange: string;
  marketStatus?: 'open' | 'closed' | 'pre-market' | 'after-hours';
}

// Component props interface
export interface StockCardProps {
  symbol: string;
  stockData: StockData | MarketStackResponse | null;
  loading?: boolean;
  error?: string | null;
  variant?: 'compact' | 'default' | 'expanded';
  showExtendedHours?: boolean;
  className?: string;
}

// Error state interface
export interface StockError {
  message: string;
  code?: string;
  type?: 'network' | 'data' | 'critical' | 'api';
  retryable?: boolean;
  details?: string;
}

// Loading state interface for skeleton display
export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
}

// Utility type for optional stock fields
export type PartialStockData = Partial<StockData> & {
  symbol: string;
  currentPrice: number;
};