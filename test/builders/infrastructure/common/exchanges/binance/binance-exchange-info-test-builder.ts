import { randomBoolean, randomNumber, randomString, randomSymbol } from '../../../../random-test-builder';
import { BinanceExchangeInfo, BinanceExchangeInfoRateLimit, BinanceExchangeInfoSymbol, BinanceExchangeInfoSymbolFilter } from '@hastobegood/crypto-clients-binance/exchange-info';

export const buildDefaultBinanceExchangeInfo = (): BinanceExchangeInfo => {
  return {
    timezone: 'UTC',
    serverTime: new Date().valueOf(),
    rateLimits: [buildDefaultBinanceExchangeInfoRateLimit(), buildDefaultBinanceExchangeInfoRateLimit()],
    symbols: [buildDefaultBinanceExchangeInfoSymbol()],
  };
};

export const buildDefaultBinanceExchangeInfoRateLimit = (): BinanceExchangeInfoRateLimit => {
  return {
    rateLimitType: randomString(5),
    interval: randomString(5),
    intervalNum: randomNumber(1, 60),
    limit: randomNumber(100, 500),
  };
};

export const buildDefaultBinanceExchangeInfoSymbol = (): BinanceExchangeInfoSymbol => {
  return {
    symbol: randomSymbol(),
    status: randomString(5),
    baseAsset: randomString(5),
    baseAssetPrecision: randomNumber(8, 10),
    quoteAsset: randomString(5),
    quoteAssetPrecision: randomNumber(8, 10),
    baseCommissionPrecision: randomNumber(8, 10),
    quoteCommissionPrecision: randomNumber(8, 10),
    orderTypes: [randomString(5), randomString(5)],
    icebergAllowed: randomBoolean(),
    ocoAllowed: randomBoolean(),
    quoteOrderQtyMarketAllowed: randomBoolean(),
    isSpotTradingAllowed: randomBoolean(),
    isMarginTradingAllowed: randomBoolean(),
    filters: [buildDefaultBinanceExchangeInfoSymbolFilter(), buildDefaultBinanceExchangeInfoSymbolFilter()],
    permissions: [randomString(5), randomString(5)],
  };
};

export const buildDefaultBinanceExchangeInfoSymbolFilter = (): BinanceExchangeInfoSymbolFilter => {
  return {
    filterType: randomString(5),
    minPrice: randomNumber(1, 100).toString(),
    maxPrice: randomNumber(1_000, 10_000).toString(),
    tickSize: randomNumber(1, 4).toString(),
  };
};
