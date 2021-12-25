import { ExchangeTickerClient } from '../exchange-ticker-client';
import { Ticker, TickerExchange } from '../../../../domain/ticker/model/ticker';
import { toBinanceSymbol } from '../../../common/exchanges/binance/binance-converter';
import { BinanceExchangeInfoClient } from '@hastobegood/crypto-clients-binance/exchange-info';

export class BinanceTickerClient implements ExchangeTickerClient {
  constructor(private binanceExchangeInfoClient: BinanceExchangeInfoClient) {}

  getExchange(): TickerExchange {
    return 'Binance';
  }

  async getTickerBySymbol(symbol: string): Promise<Ticker> {
    const response = await this.binanceExchangeInfoClient.getExchangeInfoBySymbol(toBinanceSymbol(symbol));

    return {
      exchange: 'Binance',
      symbol: symbol,
      quoteAssetPrecision: response.data.symbols[0].quoteAssetPrecision,
    };
  }
}
