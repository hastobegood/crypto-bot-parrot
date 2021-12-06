import { BinanceExchangeInfo, BinanceExchangeInfoSymbol } from '../../../../../../src/code/infrastructure/common/exchanges/binance/model/binance-exchange-info';
import { randomNumber } from '../../../../random-test-builder';

export const buildDefaultBinanceExchangeInfo = (): BinanceExchangeInfo => {
  return {
    symbols: [buildDefaultBinanceExchangeInfoSymbol()],
  };
};

export const buildDefaultBinanceExchangeInfoSymbol = (): BinanceExchangeInfoSymbol => {
  return {
    quoteAssetPrecision: randomNumber(8, 10),
  };
};
