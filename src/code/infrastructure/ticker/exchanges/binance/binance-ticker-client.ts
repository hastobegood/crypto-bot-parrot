import { toBinanceSymbol } from '../../../common/exchanges/binance/binance-converter';
import { ExchangeTickerClient } from '../exchange-ticker-client';
import { Ticker, TickerExchange } from '../../../../domain/ticker/model/ticker';
import { Client, GetExchangeInfoCommand, GetExchangeInfoInput } from '@hastobegood/crypto-clients-binance';

export class BinanceTickerClient implements ExchangeTickerClient {
  constructor(private client: Client) {}

  getExchange(): TickerExchange {
    return 'Binance';
  }

  async getTickerBySymbol(symbol: string): Promise<Ticker> {
    const input = this.#buildGetExchangeInfoInput(symbol);
    const output = await this.client.send(new GetExchangeInfoCommand(input));

    return {
      exchange: 'Binance',
      symbol: symbol,
      quoteAssetPrecision: output.data.symbols[0].quoteAssetPrecision,
    };
  }

  #buildGetExchangeInfoInput(symbol: string): GetExchangeInfoInput {
    return {
      symbol: toBinanceSymbol(symbol),
    };
  }
}
