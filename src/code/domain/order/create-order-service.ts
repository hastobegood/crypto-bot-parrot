import { logger } from '../../configuration/log/logger';
import { v4 } from 'uuid';
import { truncate } from '../../configuration/util/math';
import { GetTickerService } from '../ticker/get-ticker-service';
import { OrderClient } from './order-client';
import { CreateOrder, Order, TransientOrder } from './model/order';

export class CreateOrderService {
  constructor(private getTickerService: GetTickerService, private orderClient: OrderClient) {}

  async create(createOrder: CreateOrder): Promise<Order> {
    const transientOrder = await this.#buildTransientOrder(createOrder);

    logger.info(transientOrder, 'Create order');
    const order = await this.orderClient.send(transientOrder);
    logger.info(order, 'Order created');

    return order;
  }

  async #buildTransientOrder(createOrder: CreateOrder): Promise<TransientOrder> {
    const creationDate = new Date();
    const ticker = await this.getTickerService.getByExchangeAndSymbol(createOrder.exchange, createOrder.symbol);

    return {
      ...createOrder,
      id: v4(),
      status: 'Waiting',
      creationDate: creationDate,
      requestedQuantity: truncate(createOrder.requestedQuantity, ticker.quoteAssetPrecision),
    };
  }
}
