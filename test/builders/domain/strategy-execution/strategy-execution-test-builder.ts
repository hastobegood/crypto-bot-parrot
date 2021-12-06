import { v4 } from 'uuid';
import { CreateStrategyExecution, StrategyExecution, StrategyExecutionOrder } from '../../../../src/code/domain/strategy-execution/model/strategy-execution';
import { randomBoolean, randomNumber, randomString, randomSymbol } from '../../random-test-builder';

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
      id: randomString(20),
      status: randomString(10),
      externalId: randomString(20),
      externalStatus: randomString(10),
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
