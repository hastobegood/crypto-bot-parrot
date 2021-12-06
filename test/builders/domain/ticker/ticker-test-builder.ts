import { randomFromList, randomNumber, randomSymbol } from '../../random-test-builder';
import { Ticker } from '../../../../src/code/domain/ticker/model/ticker';

export const buildDefaultTicker = (): Ticker => {
  return {
    exchange: randomFromList(['Binance']),
    symbol: randomSymbol(),
    quoteAssetPrecision: randomNumber(8, 10),
  };
};
