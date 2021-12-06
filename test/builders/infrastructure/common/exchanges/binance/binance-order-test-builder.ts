import { BinanceOrder, BinanceOrderFill } from '../../../../../../src/code/infrastructure/common/exchanges/binance/model/binance-order';
import { randomNumber, randomString } from '../../../../random-test-builder';

export const buildDefaultBinanceOrder = (): BinanceOrder => {
  return buildDefaultBinanceMarketOrder();
};

export const buildDefaultBinanceMarketOrder = (): BinanceOrder => {
  return {
    orderId: randomNumber(),
    transactTime: new Date().valueOf(),
    status: 'FILLED',
    price: '0',
    executedQty: randomNumber(10, 100).toString(),
    cummulativeQuoteQty: randomNumber(10, 100).toString(),
    fills: [buildDefaultBinanceOrderFill(), buildDefaultBinanceOrderFill()],
  };
};

export const buildDefaultBinanceOrderFill = (): BinanceOrderFill => {
  return {
    commission: randomNumber(1, 10).toString(),
    commissionAsset: randomString(5),
  };
};
