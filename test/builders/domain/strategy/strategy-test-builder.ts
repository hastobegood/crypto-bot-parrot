import { Strategy, StrategyAsset } from '../../../../src/code/domain/strategy/model/strategy';
import { randomFromList, randomNumber, randomPercentage, randomString, randomSymbol } from '../../random-test-builder';

export const buildDefaultStrategy = (): Strategy => {
  return {
    exchange: randomFromList(['Binance']),
    symbol: randomSymbol(),
    quantity: randomNumber(1, 1_000),
    assets: [buildDefaultStrategyAsset(), buildDefaultStrategyAsset()],
  };
};

export const buildDefaultStrategyAsset = (): StrategyAsset => {
  return {
    asset: randomString(5),
    percentage: randomPercentage(),
  };
};
