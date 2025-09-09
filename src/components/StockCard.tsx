import { StockCardProps, StockData, MarketStackResponse } from '@/types/stock';
import { parseStockData } from '@/utils/stockDataParser';

export default function StockCard({
  symbol,
  stockData,
  loading = false,
  error = null,
  variant = 'default',
  showExtendedHours = false,
  className = ''
}: StockCardProps) {
  
  // Handle loading state
  if (loading) {
    return (
      <div className={`stock-card stock-card--loading ${className}`}>
        <div className="stock-card__skeleton">
          <div className="skeleton__header"></div>
          <div className="skeleton__price"></div>
          <div className="skeleton__change"></div>
          <div className="skeleton__details"></div>
        </div>
      </div>
    );
  }

  // Handle error state  
  if (error) {
    return (
      <div className={`stock-card stock-card--error ${className}`}>
        <div className="stock-card__error">
          <div className="error__icon">⚠️</div>
          <div className="error__message">{error}</div>
          <button className="error__retry" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Handle empty/no data state
  if (!stockData) {
    return (
      <div className={`stock-card stock-card--empty ${className}`}>
        <div className="stock-card__empty">
          <div className="empty__icon">📊</div>
          <div className="empty__message">No data available for {symbol}</div>
        </div>
      </div>
    );
  }

  // Parse the data with comprehensive error handling
  let normalizedData: StockData;
  try {
    normalizedData = parseStockData(stockData, symbol);
  } catch (parseError) {
    console.error(`Failed to parse stock data for ${symbol}:`, parseError);
    return (
      <div className={`stock-card stock-card--error ${className}`}>
        <div className="stock-card__error">
          <div className="error__icon">⚠️</div>
          <div className="error__message">Failed to process data for {symbol}</div>
          <button className="error__retry" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`stock-card stock-card--${variant} ${className}`}>
      <div className="stock-card__header">
        <div className="header__symbol">{normalizedData.symbol || symbol}</div>
        {normalizedData.companyName && (
          <div className="header__company">{normalizedData.companyName}</div>
        )}
        {normalizedData.marketStatus && (
          <div className={`header__status header__status--${normalizedData.marketStatus}`}>
            {normalizedData.marketStatus.replace('-', ' ')}
          </div>
        )}
      </div>

      <div className="stock-card__price">
        <div className="price__current">
          {normalizedData.currentPrice > 0 
            ? formatCurrency(normalizedData.currentPrice, normalizedData.currency)
            : 'N/A'
          }
        </div>
        {(normalizedData.change !== 0 || normalizedData.changePercent !== 0) && (
          <div className={`price__change ${normalizedData.change >= 0 ? 'positive' : 'negative'}`}>
            <span className="change__absolute">
              {normalizedData.change >= 0 ? '+' : ''}{formatCurrency(Math.abs(normalizedData.change), normalizedData.currency)}
            </span>
            <span className="change__percent">
              ({normalizedData.change >= 0 ? '+' : ''}{normalizedData.changePercent.toFixed(2)}%)
            </span>
          </div>
        )}
      </div>

      <div className="stock-card__details">
        <div className="details__row">
          <span className="details__label">Open</span>
          <span className="details__value">
            {normalizedData.open > 0 ? formatCurrency(normalizedData.open, normalizedData.currency) : 'N/A'}
          </span>
        </div>
        <div className="details__row">
          <span className="details__label">High</span>
          <span className="details__value">
            {normalizedData.high > 0 ? formatCurrency(normalizedData.high, normalizedData.currency) : 'N/A'}
          </span>
        </div>
        <div className="details__row">
          <span className="details__label">Low</span>
          <span className="details__value">
            {normalizedData.low > 0 ? formatCurrency(normalizedData.low, normalizedData.currency) : 'N/A'}
          </span>
        </div>
        <div className="details__row">
          <span className="details__label">Volume</span>
          <span className="details__value">
            {normalizedData.volume > 0 ? formatVolume(normalizedData.volume) : 'N/A'}
          </span>
        </div>
      </div>

      <div className="stock-card__footer">
        <div className="footer__updated">
          Updated: {formatLastUpdated(normalizedData.lastUpdated)}
        </div>
      </div>
    </div>
  );
}

// Helper functions for formatting (will be moved to utils in step 5)
function formatCurrency(value: number, currency: string): string {
  const currencySymbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
    'HKD': 'HK$'
  };
  
  const symbol = currencySymbols[currency] || '$';
  const decimals = currency === 'JPY' ? 0 : 2; // Japanese Yen doesn't use decimals
  
  return `${symbol}${value.toFixed(decimals)}`;
}

function formatVolume(volume: number): string {
  if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`;
  if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
  return volume.toLocaleString();
}

function formatLastUpdated(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    
    return date.toLocaleDateString();
  } catch {
    return 'Unknown';
  }
}