import { randomAsset, randomFromList, randomNumber, randomPercentage, randomSymbol } from '@hastobegood/crypto-bot-artillery/test/builders';

import { Strategy, StrategyAsset } from '../../../../src/code/domain/strategy/model/strategy';

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
    asset: randomAsset(),
    percentage: randomPercentage(),
  };
};
