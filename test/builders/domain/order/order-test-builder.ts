import { randomFromList, randomNumber, randomSymbol } from '@hastobegood/crypto-bot-artillery/test/builders';

import { CreateOrder } from '../../../../src/code/domain/order/model/order';

export const buildDefaultCreateOrder = (): CreateOrder => {
  return {
    exchange: randomFromList(['Binance']),
    symbol: randomSymbol(),
    requestedQuantity: randomNumber(1, 100),
  };
};
