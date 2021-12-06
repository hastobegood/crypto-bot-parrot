export type BinanceOrderSide = 'BUY';
export type BinanceOrderType = 'MARKET';
export type BinanceOrderStatus = 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED' | 'PENDING_CANCEL' | 'REJECTED' | 'EXPIRED';

export interface BinanceOrder {
  orderId: number;
  transactTime: number;
  status: BinanceOrderStatus;
  price: string;
  executedQty: string;
  cummulativeQuoteQty: string;
  fills: BinanceOrderFill[];
}

export interface BinanceOrderFill {
  commission: string;
  commissionAsset: string;
}
