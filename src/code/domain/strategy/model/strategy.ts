export type StrategyExchange = 'Binance';

export interface Strategy {
  exchange: StrategyExchange;
  symbol: string;
  quantity: number;
  assets?: StrategyAsset[];
}

export interface StrategyAsset {
  asset: string;
  percentage: number;
}
