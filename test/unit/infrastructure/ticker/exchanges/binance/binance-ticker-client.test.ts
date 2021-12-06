import { axiosInstance } from '../../../../../../src/code/configuration/http/axios';
import { mocked } from 'ts-jest/utils';
import { BinanceTickerClient } from '../../../../../../src/code/infrastructure/ticker/exchanges/binance/binance-ticker-client';
import { buildDefaultBinanceExchangeInfo } from '../../../../../builders/infrastructure/common/exchanges/binance/binance-exchange-info-test-builder';
import { BinanceExchangeInfo } from '../../../../../../src/code/infrastructure/common/exchanges/binance/model/binance-exchange-info';
import { BinanceAuthentication } from '../../../../../../src/code/infrastructure/common/exchanges/binance/binance-authentication';

jest.mock('../../../../../../src/code/configuration/http/axios');

const axiosInstanceMock = mocked(axiosInstance, true);
const binanceAuthenticationMock = mocked(jest.genMockFromModule<BinanceAuthentication>('../../../../../../src/code/infrastructure/common/exchanges/binance/binance-authentication'), true);

let binanceTickerClient: BinanceTickerClient;
beforeEach(() => {
  binanceAuthenticationMock.getApiUrl = jest.fn();
  binanceAuthenticationMock.getSignature = jest.fn();
  binanceAuthenticationMock.getApiKey = jest.fn();

  binanceTickerClient = new BinanceTickerClient(binanceAuthenticationMock);
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

        binanceAuthenticationMock.getApiUrl.mockResolvedValueOnce('my-url');
        axiosInstanceMock.get.mockResolvedValueOnce({
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

        expect(binanceAuthenticationMock.getApiUrl).toHaveBeenCalledTimes(1);
        const getApiUrlParams = binanceAuthenticationMock.getApiUrl.mock.calls[0];
        expect(getApiUrlParams.length).toEqual(0);

        expect(binanceAuthenticationMock.getSignature).toHaveBeenCalledTimes(0);
        expect(binanceAuthenticationMock.getApiKey).toHaveBeenCalledTimes(0);

        expect(axiosInstanceMock.get).toHaveBeenCalledTimes(1);
        const getParams = axiosInstanceMock.get.mock.calls[0];
        expect(getParams.length).toEqual(2);
        expect(getParams[0]).toEqual('/v3/exchangeInfo?symbol=ABCDEF');
        expect(getParams[1]).toEqual({
          baseURL: 'my-url',
        });
      });
    });
  });
});
