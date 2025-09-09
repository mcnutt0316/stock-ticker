import { StockCardProps, StockData, MarketStackResponse, StockError } from '@/types/stock';
import { parseStockData } from '@/utils/stockDataParser';
import { useState } from 'react';
import styles from './StockCard.module.css';

export default function StockCard({
  symbol,
  stockData,
  loading = false,
  error = null,
  variant = 'default',
  showExtendedHours = false,
  className = ''
}: StockCardProps) {
  
  // Create variant class for consistent use
  const variantClass = variant === 'compact' ? styles.compact : variant === 'expanded' ? styles.expanded : '';

  // Handle loading state
  if (loading) {
    return (
      <div className={`${styles.stockCard} ${styles.loading} ${variantClass} ${className}`}>
        <div className={styles.skeleton}>
          <div className={`${styles.skeletonItem} ${styles.skeletonHeader}`}></div>
          <div className={`${styles.skeletonItem} ${styles.skeletonSubheader}`}></div>
          <div className={`${styles.skeletonItem} ${styles.skeletonPrice}`}></div>
          <div className={`${styles.skeletonItem} ${styles.skeletonChange}`}></div>
          <div className={styles.skeletonDetailsGrid}>
            <div className={`${styles.skeletonItem} ${styles.skeletonDetail}`}></div>
            <div className={`${styles.skeletonItem} ${styles.skeletonDetail}`}></div>
            <div className={`${styles.skeletonItem} ${styles.skeletonDetail}`}></div>
            <div className={`${styles.skeletonItem} ${styles.skeletonDetail}`}></div>
          </div>
          <div className={`${styles.skeletonItem} ${styles.skeletonFooter}`}></div>
        </div>
      </div>
    );
  }

  const [retrying, setRetrying] = useState(false);

  // Handle error state with enhanced functionality
  if (error) {
    const parsedError = parseError(error);
    const errorClass = getErrorClass(parsedError.type);

    const handleRetry = async () => {
      if (!parsedError.retryable) return;
      
      setRetrying(true);
      // Simulate retry delay
      setTimeout(() => {
        setRetrying(false);
        window.location.reload();
      }, 1000);
    };

    return (
      <div className={`${styles.stockCard} ${errorClass} ${className}`}>
        <div className={styles.error}>
          <div className={styles.errorIcon}>{getErrorIcon(parsedError.type)}</div>
          <div className={styles.errorMessage}>{parsedError.message}</div>
          <div className={styles.errorActions}>
            {parsedError.retryable && (
              <button 
                className={styles.retryButton} 
                onClick={handleRetry}
                disabled={retrying}
              >
                {retrying ? '⏳ Retrying...' : '🔄 Retry'}
              </button>
            )}
            {parsedError.details && (
              <div className={styles.errorDetails} title={parsedError.details}>
                {parsedError.details}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Handle empty/no data state
  if (!stockData) {
    return (
      <div className={`${styles.stockCard} ${styles.noData} ${className}`}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📊</div>
          <div className={styles.emptyMessage}>No data available for {symbol}</div>
          <div className={styles.emptySubtext}>
            This stock symbol may not exist or data is temporarily unavailable
          </div>
          <div className={styles.emptyActions}>
            <button className={styles.emptyButton} onClick={() => window.location.reload()}>
              🔄 Refresh
            </button>
            <button 
              className={styles.emptyButton} 
              onClick={() => navigator.clipboard.writeText(symbol)}
            >
              📋 Copy Symbol
            </button>
          </div>
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
    const parseErrorObj: StockError = {
      message: `Failed to process data for ${symbol}`,
      type: 'data',
      retryable: true,
      details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
    };
    
    return (
      <div className={`${styles.stockCard} ${styles.dataError} ${className}`}>
        <div className={styles.error}>
          <div className={styles.errorIcon}>🔧</div>
          <div className={styles.errorMessage}>{parseErrorObj.message}</div>
          <div className={styles.errorActions}>
            <button className={styles.retryButton} onClick={() => window.location.reload()}>
              🔄 Retry
            </button>
            <div className={styles.errorDetails} title={parseErrorObj.details}>
              {parseErrorObj.details}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.stockCard} ${variantClass} ${className}`}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.symbol}>{normalizedData.symbol || symbol}</div>
          {normalizedData.companyName && (
            <div className={styles.companyName}>{normalizedData.companyName}</div>
          )}
        </div>
        {normalizedData.marketStatus && (
          <div className={`${styles.marketStatus} ${getMarketStatusClass(normalizedData.marketStatus)}`}>
            {normalizedData.marketStatus.replace('-', ' ')}
          </div>
        )}
      </div>

      <div className={styles.price}>
        <div className={styles.currentPrice}>
          {normalizedData.currentPrice > 0 
            ? formatCurrency(normalizedData.currentPrice, normalizedData.currency)
            : 'N/A'
          }
        </div>
        {(normalizedData.change !== 0 || normalizedData.changePercent !== 0) && (
          <div className={`${styles.priceChange} ${normalizedData.change >= 0 ? styles.positive : styles.negative}`}>
            <span className={styles.changeAbsolute}>
              {normalizedData.change >= 0 ? '+' : ''}{formatCurrency(Math.abs(normalizedData.change), normalizedData.currency)}
            </span>
            <span className={styles.changePercent}>
              ({normalizedData.change >= 0 ? '+' : ''}{normalizedData.changePercent.toFixed(2)}%)
            </span>
          </div>
        )}
      </div>

      <div className={styles.details}>
        <div className={styles.detailsRow}>
          <span className={styles.detailsLabel}>Open</span>
          <span className={styles.detailsValue}>
            {normalizedData.open > 0 ? formatCurrency(normalizedData.open, normalizedData.currency) : 'N/A'}
          </span>
        </div>
        <div className={styles.detailsRow}>
          <span className={styles.detailsLabel}>High</span>
          <span className={styles.detailsValue}>
            {normalizedData.high > 0 ? formatCurrency(normalizedData.high, normalizedData.currency) : 'N/A'}
          </span>
        </div>
        <div className={styles.detailsRow}>
          <span className={styles.detailsLabel}>Low</span>
          <span className={styles.detailsValue}>
            {normalizedData.low > 0 ? formatCurrency(normalizedData.low, normalizedData.currency) : 'N/A'}
          </span>
        </div>
        <div className={styles.detailsRow}>
          <span className={styles.detailsLabel}>Volume</span>
          <span className={styles.detailsValue}>
            {normalizedData.volume > 0 ? formatVolume(normalizedData.volume) : 'N/A'}
          </span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.lastUpdated}>
          Updated: {formatLastUpdated(normalizedData.lastUpdated)}
        </div>
      </div>
    </div>
  );
}

// Helper function for market status CSS classes
function getMarketStatusClass(status: string): string {
  switch (status) {
    case 'open': return styles.open;
    case 'closed': return styles.closed;
    case 'pre-market': return styles.preMarket;
    case 'after-hours': return styles.afterHours;
    default: return '';
  }
}

// Helper functions for error handling
function parseError(error: string | StockError): StockError {
  if (typeof error === 'string') {
    // Try to infer error type from message
    let type: StockError['type'] = 'critical';
    let retryable = true;

    if (error.toLowerCase().includes('network') || error.toLowerCase().includes('fetch') || error.toLowerCase().includes('connection')) {
      type = 'network';
    } else if (error.toLowerCase().includes('data') || error.toLowerCase().includes('parse') || error.toLowerCase().includes('format')) {
      type = 'data';
    } else if (error.toLowerCase().includes('api') || error.toLowerCase().includes('key') || error.toLowerCase().includes('limit')) {
      type = 'api';
      retryable = false;
    }

    return {
      message: error,
      type,
      retryable,
      details: undefined
    };
  }
  return error;
}

function getErrorClass(type?: StockError['type']): string {
  switch (type) {
    case 'network': return styles.networkError;
    case 'data': return styles.dataError;
    case 'critical': return styles.criticalError;
    case 'api': return styles.criticalError;
    default: return styles.errorBoundary;
  }
}

function getErrorIcon(type?: StockError['type']): string {
  switch (type) {
    case 'network': return '🌐';
    case 'data': return '🔧';
    case 'critical': return '❌';
    case 'api': return '🔑';
    default: return '⚠️';
  }
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