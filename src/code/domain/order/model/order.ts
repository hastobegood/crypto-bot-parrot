import { OrderExchange } from '@hastobegood/crypto-bot-artillery/order';

export interface CreateOrder {
  exchange: OrderExchange;
  symbol: string;
  requestedQuantity: number;
}
