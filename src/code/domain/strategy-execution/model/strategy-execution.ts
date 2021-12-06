export interface CreateStrategyExecution {
  success: boolean;
  orders: StrategyExecutionOrder[];
}

export interface StrategyExecution {
  success: boolean;
  id: string;
  creationDate: Date;
  orders: StrategyExecutionOrder[];
}

export interface StrategyExecutionOrder {
  success: boolean;
  message?: string;
  id?: string;
  symbol: string;
  requestedQuantity: number;
  status?: string;
  externalId?: string;
  externalStatus?: string;
  transactionDate?: Date;
  executedQuantity?: number;
  executedPrice?: number;
}
