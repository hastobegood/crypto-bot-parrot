import { TickerClient } from '../../domain/ticker/ticker-client';
import { ExchangeTickerClient } from './exchanges/exchange-ticker-client';
import { Ticker, TickerExchange } from '../../domain/ticker/model/ticker';

export class HttpTickerClient implements TickerClient {
  constructor(private exchangeTickerClients: ExchangeTickerClient[]) {}

  async getByExchangeAndSymbol(exchange: TickerExchange, symbol: string): Promise<Ticker> {
    return this.#getExchangeTickerClient(exchange).getTickerBySymbol(symbol);
  }

  #getExchangeTickerClient(exchange: TickerExchange): ExchangeTickerClient {
    const exchangeTickerClient = this.exchangeTickerClients.find((exchangeTickerClient) => exchangeTickerClient.getExchange() === exchange);
    if (!exchangeTickerClient) {
      throw new Error(`Unsupported '${exchange}' exchange`);
    }
    return exchangeTickerClient;
  }
}
