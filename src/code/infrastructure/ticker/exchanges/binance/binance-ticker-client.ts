import { ExchangeTickerClient } from '../exchange-ticker-client';
import { Ticker, TickerExchange } from '../../../../domain/ticker/model/ticker';
import { AxiosRequestConfig } from 'axios';
import { axiosInstance } from '../../../../configuration/http/axios';
import { BinanceExchangeInfo } from '../../../common/exchanges/binance/model/binance-exchange-info';
import { toBinanceSymbol } from '../../../common/exchanges/binance/binance-converter';
import { BinanceAuthentication } from '../../../common/exchanges/binance/binance-authentication';

export class BinanceTickerClient implements ExchangeTickerClient {
  constructor(private binanceAuthentication: BinanceAuthentication) {}

  getExchange(): TickerExchange {
    return 'Binance';
  }

  async getTickerBySymbol(symbol: string): Promise<Ticker> {
    const queryParameters = `symbol=${toBinanceSymbol(symbol)}`;
    const queryUrl = `/v3/exchangeInfo?${queryParameters}`;
    const queryConfig = this.#getQueryConfig(await this.binanceAuthentication.getApiUrl());
    const response = await axiosInstance.get<BinanceExchangeInfo>(queryUrl, queryConfig);

    return {
      exchange: 'Binance',
      symbol: symbol,
      quoteAssetPrecision: response.data.symbols[0].quoteAssetPrecision,
    };
  }

  #getQueryConfig(apiUrl: string): AxiosRequestConfig {
    return {
      baseURL: apiUrl,
    };
  }
}
