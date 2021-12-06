export type OrderExchange = 'Binance';
export type OrderSide = 'Buy';
export type OrderType = 'Market';
export type OrderStatus = 'Waiting' | 'PartiallyFilled' | 'Filled' | 'Canceled' | 'Error' | 'Unknown';

export interface CreateOrder {
  exchange: OrderExchange;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  requestedQuantity: number;
}

export interface TransientOrder extends CreateOrder {
  id: string;
  status: OrderStatus;
  creationDate: Date;
}

export interface Order extends TransientOrder {
  externalId: string;
  externalStatus: string;
  transactionDate: Date;
  executedQuantity?: number;
  executedPrice?: number;
}
