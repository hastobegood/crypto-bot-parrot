import { mocked } from 'ts-jest/utils';
import { round } from '../../../../../../src/code/configuration/util/math';
import { fromBinanceOrderStatus, toBinanceOrderSide, toBinanceOrderType, toBinanceSymbol } from '../../../../../../src/code/infrastructure/common/exchanges/binance/binance-converter';
import { buildDefaultCreateMarketOrder, buildDefaultOrder } from '../../../../../builders/domain/order/order-test-builder';
import { buildDefaultBinanceSendMarketOrderOutput } from '../../../../../builders/infrastructure/common/exchanges/binance/binance-order-test-builder';
import { OrderType, TransientOrder } from '../../../../../../src/code/domain/order/model/order';
import { Client, SendOrderOutput } from '@hastobegood/crypto-clients-binance';
import { BinanceOrderClient } from '../../../../../../src/code/infrastructure/order/exchanges/binance/binance-order-client';

const clientMock = mocked(jest.genMockFromModule<Client>('@hastobegood/crypto-clients-binance'), true);

let binanceOrderClient: BinanceOrderClient;
beforeEach(() => {
  clientMock.send = jest.fn();

  binanceOrderClient = new BinanceOrderClient(clientMock);
});

describe('BinanceOrderClient', () => {
  describe('Given the exchange to retrieve', () => {
    it('Then Binance exchange is returned', async () => {
      expect(binanceOrderClient.getExchange()).toEqual('Binance');
    });
  });

  describe('Given an unknown transient order to send', () => {
    let transientOrder: TransientOrder;

    beforeEach(() => {
      transientOrder = { ...buildDefaultOrder(), type: 'Unknown' as OrderType };
    });

    describe('When transient order is sent', () => {
      it('Then error is thrown', async () => {
        try {
          await binanceOrderClient.sendOrder(transientOrder);
          fail();
        } catch (error) {
          expect((error as Error).message).toEqual("Unsupported 'Unknown' Binance order type");
        }

        expect(clientMock.send).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('Given a transient market order to send', () => {
    let transientOrder: TransientOrder;
    let sendOrderOutput: SendOrderOutput;

    beforeEach(() => {
      transientOrder = {
        ...buildDefaultCreateMarketOrder(),
        id: '123',
        status: 'Waiting',
        creationDate: new Date(),
      };
      sendOrderOutput = buildDefaultBinanceSendMarketOrderOutput();

      clientMock.send.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: sendOrderOutput,
      });
    });

    describe('When transient order is sent', () => {
      it('Then order is returned', async () => {
        const result = await binanceOrderClient.sendOrder(transientOrder);
        expect(result).toEqual({
          ...transientOrder,
          status: fromBinanceOrderStatus(sendOrderOutput.status),
          externalId: sendOrderOutput.orderId.toString(),
          externalStatus: sendOrderOutput.status,
          transactionDate: new Date(sendOrderOutput.transactTime),
          executedQuantity: round(+sendOrderOutput.executedQty, 15),
          executedPrice: round(+sendOrderOutput.cummulativeQuoteQty / +sendOrderOutput.executedQty, 15),
        });

        expect(clientMock.send).toHaveBeenCalledTimes(1);
        const sendParams = clientMock.send.mock.calls[0];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0]).toEqual({
          input: {
            symbol: toBinanceSymbol(transientOrder.symbol),
            side: toBinanceOrderSide(transientOrder.side),
            type: toBinanceOrderType(transientOrder.type),
            quoteOrderQty: transientOrder.requestedQuantity,
          },
        });
      });
    });
  });
});
