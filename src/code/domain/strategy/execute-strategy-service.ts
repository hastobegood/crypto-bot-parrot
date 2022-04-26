import { extractAssets } from '@hastobegood/crypto-bot-artillery/common';
import { Order } from '@hastobegood/crypto-bot-artillery/order';

import { CreateOrderService } from '../order/create-order-service';
import { CreateOrder } from '../order/model/order';
import { CreateStrategyExecutionService } from '../strategy-execution/create-strategy-execution-service';
import { GetStrategyExecutionService } from '../strategy-execution/get-strategy-execution-service';
import { CreateStrategyExecution, StrategyExecution, StrategyExecutionOrder } from '../strategy-execution/model/strategy-execution';

import { Strategy, StrategyExchange } from './model/strategy';

export class ExecuteStrategyService {
  constructor(private createOrderService: CreateOrderService, private getStrategyExecutionService: GetStrategyExecutionService, private createStrategyExecutionService: CreateStrategyExecutionService) {}

  async execute(strategy: Strategy): Promise<StrategyExecution> {
    const assets = extractAssets(strategy.symbol);
    const orders = await this.#execute(strategy, assets.baseAsset, assets.quoteAsset);

    const createStrategyExecution: CreateStrategyExecution = {
      success: !orders.find((order) => !order.success),
      orders: orders,
    };

    return this.createStrategyExecutionService.create(createStrategyExecution);
  }

  async #execute(strategy: Strategy, baseAsset: string, quoteAsset: string): Promise<StrategyExecutionOrder[]> {
    const orders = [];

    const mainOrder = await this.#order(strategy.exchange, baseAsset, quoteAsset, strategy.quantity);
    orders.push(mainOrder);

    if (mainOrder.success && strategy.assets?.length) {
      const assetOrders = await Promise.all(
        strategy.assets.map(async (asset) => {
          const chosenAsset = await this.#chooseAsset(asset.asset);
          return this.#order(strategy.exchange, chosenAsset, baseAsset, asset.percentage * mainOrder.executedQuantity!);
        }),
      );
      orders.push(...assetOrders);
    }

    return orders;
  }

  async #order(exchange: StrategyExchange, baseAsset: string, quoteAsset: string, quantity: number): Promise<StrategyExecutionOrder> {
    const createOrder: CreateOrder = {
      exchange: exchange,
      symbol: `${baseAsset}#${quoteAsset}`,
      requestedQuantity: quantity,
    };

    let message: string | undefined;
    let order: Order | undefined;
    try {
      order = await this.createOrderService.create(createOrder);
    } catch (error) {
      message = (error as Error).message;
    }

    return {
      success: order?.status === 'Filled',
      message: message,
      id: order?.id,
      status: order?.status,
      symbol: `${baseAsset}#${quoteAsset}`,
      requestedQuantity: quantity,
      externalId: order?.externalId,
      externalStatus: order?.externalStatus,
      transactionDate: order?.transactionDate,
      executedQuantity: order?.executedQuantity,
      executedPrice: order?.executedPrice,
    };
  }

  async #chooseAsset(asset: string): Promise<string> {
    if (!asset.includes('|')) {
      return asset;
    }

    const assetParts = asset.split('|');
    const lastStrategyExecution = await this.getStrategyExecutionService.getLast();
    const lastOrder = lastStrategyExecution?.orders.find((order) => assetParts.indexOf(extractAssets(order.symbol).baseAsset) !== -1);
    if (!lastOrder) {
      return assetParts[0];
    }

    const assetIndex = assetParts.indexOf(extractAssets(lastOrder.symbol).baseAsset);
    if (assetIndex + 1 >= assetParts.length) {
      return assetParts[0];
    }

    return assetParts[assetIndex + 1];
  }
}
