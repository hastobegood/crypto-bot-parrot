import { randomFromList, randomNumber, randomString, randomSymbol } from '../../../../random-test-builder';
import { SendOrderOutput, SendOrderOutputFill } from '@hastobegood/crypto-clients-binance';

export const buildDefaultBinanceSendMarketOrderOutput = (): SendOrderOutput => {
  return {
    symbol: randomSymbol(),
    orderId: randomNumber(),
    orderListId: -1,
    clientOrderId: randomString(),
    transactTime: new Date().valueOf(),
    price: '0.00000000',
    origQty: randomNumber(10, 100).toString(),
    executedQty: randomNumber(10, 100).toString(),
    cummulativeQuoteQty: randomNumber(10, 100).toString(),
    status: 'FILLED',
    timeInForce: 'GTC',
    type: 'MARKET',
    side: randomFromList(['BUY', 'SELL']),
    fills: [buildDefaultBinanceSendOrderOutputFill(), buildDefaultBinanceSendOrderOutputFill()],
  };
};

export const buildDefaultBinanceSendOrderOutputFill = (): SendOrderOutputFill => {
  return {
    price: randomNumber(1, 1_000).toString(),
    qty: randomNumber(10, 100).toString(),
    commission: randomNumber(1, 10).toString(),
    commissionAsset: randomString(5),
    tradeId: randomNumber(),
  };
};
