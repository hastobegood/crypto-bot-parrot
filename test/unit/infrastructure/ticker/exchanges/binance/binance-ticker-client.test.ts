import { mocked } from 'ts-jest/utils';
import { buildDefaultBinanceExchangeInfo } from '../../../../../builders/infrastructure/common/exchanges/binance/binance-exchange-info-test-builder';
import { BinanceExchangeInfo, BinanceExchangeInfoClient } from '@hastobegood/crypto-clients-binance/exchange-info';
import { BinanceTickerClient } from '../../../../../../src/code/infrastructure/ticker/exchanges/binance/binance-ticker-client';

const binanceExchangeInfoClientMock = mocked(jest.genMockFromModule<BinanceExchangeInfoClient>('@hastobegood/crypto-clients-binance'), true);

let binanceTickerClient: BinanceTickerClient;
beforeEach(() => {
  binanceExchangeInfoClientMock.getExchangeInfoBySymbol = jest.fn();

  binanceTickerClient = new BinanceTickerClient(binanceExchangeInfoClientMock);
});

describe('BinanceTickerClient', () => {
  describe('Given the exchange to retrieve', () => {
    it('Then Binance exchange is returned', async () => {
      expect(binanceTickerClient.getExchange()).toEqual('Binance');
    });
  });

  describe('Given a ticker to retrieve by its symbol', () => {
    let binanceExchangeInfo: BinanceExchangeInfo;

    describe('When ticker is found', () => {
      beforeEach(() => {
        binanceExchangeInfo = buildDefaultBinanceExchangeInfo();

        binanceExchangeInfoClientMock.getExchangeInfoBySymbol.mockResolvedValueOnce({
          status: 200,
          headers: {},
          data: binanceExchangeInfo,
        });
      });

      it('Then ticker is returned', async () => {
        const result = await binanceTickerClient.getTickerBySymbol('ABC#DEF');
        expect(result).toEqual({
          exchange: 'Binance',
          symbol: 'ABC#DEF',
          quoteAssetPrecision: binanceExchangeInfo.symbols[0].quoteAssetPrecision,
        });

        expect(binanceExchangeInfoClientMock.getExchangeInfoBySymbol).toHaveBeenCalledTimes(1);
        const getExchangeInfoBySymbolParams = binanceExchangeInfoClientMock.getExchangeInfoBySymbol.mock.calls[0];
        expect(getExchangeInfoBySymbolParams.length).toEqual(1);
        expect(getExchangeInfoBySymbolParams[0]).toEqual('ABCDEF');
      });
    });
  });
});
