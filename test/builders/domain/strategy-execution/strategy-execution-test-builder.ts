import { v4 } from 'uuid';
import { randomBoolean, randomNumber, randomString, randomSymbol } from '@hastobegood/crypto-bot-artillery/test/builders';
import { CreateStrategyExecution, StrategyExecution, StrategyExecutionOrder } from '../../../../src/code/domain/strategy-execution/model/strategy-execution';

export const buildDefaultCreateStrategyExecution = (): CreateStrategyExecution => {
  const orders = [buildDefaultStrategyExecutionOrder(), buildDefaultStrategyExecutionOrder(), buildDefaultStrategyExecutionOrder()];

  return {
    success: !orders.find((order) => !order.success),
    orders: orders,
  };
};

export const buildDefaultStrategyExecution = (): StrategyExecution => {
  const orders = [buildDefaultStrategyExecutionOrder(), buildDefaultStrategyExecutionOrder(), buildDefaultStrategyExecutionOrder()];

  return {
    success: !orders.find((order) => !order.success),
    id: v4(),
    creationDate: new Date(),
    orders: orders,
  };
};

export const buildDefaultStrategyExecutionOrder = (): StrategyExecutionOrder => {
  if (randomBoolean()) {
    return {
      success: true,
      symbol: randomSymbol(),
      requestedQuantity: randomNumber(1, 1_000),
      id: randomString(),
      status: randomString(),
      externalId: randomString(),
      externalStatus: randomString(),
      transactionDate: new Date(),
      executedQuantity: randomNumber(1, 1_000),
      executedPrice: randomNumber(1, 100),
    };
  } else {
    return {
      success: false,
      message: randomString(),
      symbol: randomSymbol(),
      requestedQuantity: randomNumber(1, 1_000),
    };
  }
};
