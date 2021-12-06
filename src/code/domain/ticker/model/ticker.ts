export type TickerExchange = 'Binance';

export interface Ticker {
  exchange: TickerExchange;
  symbol: string;
  quoteAssetPrecision: number;
}
