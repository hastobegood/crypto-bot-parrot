import { logger } from '@hastobegood/crypto-bot-artillery/common';
import { Order, SendOrder, SendOrderClient } from '@hastobegood/crypto-bot-artillery/order';

import { CreateOrder } from './model/order';

export class CreateOrderService {
  constructor(private sendOrderClient: SendOrderClient) {}

  async create(createOrder: CreateOrder): Promise<Order> {
    const sendOrder = await this.#buildSendOrder(createOrder);

    logger.info(sendOrder, 'Create order');
    const order = await this.sendOrderClient.send(sendOrder);
    logger.info(order, 'Order created');

    return order;
  }

  #buildSendOrder(createOrder: CreateOrder): SendOrder {
    return {
      exchange: createOrder.exchange,
      symbol: createOrder.symbol,
      side: 'Buy',
      type: 'Market',
      quote: true,
      requestedQuantity: createOrder.requestedQuantity,
    };
  }
}
