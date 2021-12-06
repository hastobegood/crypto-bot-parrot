import { mocked } from 'ts-jest/utils';
import MockDate from 'mockdate';
import { CreateOrder, Order } from '../../../../src/code/domain/order/model/order';
import { buildDefaultCreateMarketOrder, buildDefaultMarketOrder } from '../../../builders/domain/order/order-test-builder';
import { CreateOrderService } from '../../../../src/code/domain/order/create-order-service';
import { truncate } from '../../../../src/code/configuration/util/math';
import { GetTickerService } from '../../../../src/code/domain/ticker/get-ticker-service';
import { Ticker } from '../../../../src/code/domain/ticker/model/ticker';
import { buildDefaultTicker } from '../../../builders/domain/ticker/ticker-test-builder';
import { OrderClient } from '../../../../src/code/domain/order/order-client';

jest.mock('uuid', () => {
  return {
    v4: () => 'mocked-uuid',
  };
});

const getTickerServiceMock = mocked(jest.genMockFromModule<GetTickerService>('../../../../src/code/domain/ticker/get-ticker-service'), true);
const orderClientMock = mocked(jest.genMockFromModule<OrderClient>('../../../../src/code/domain/order/order-client'), true);

let createOrderService: CreateOrderService;
beforeEach(() => {
  getTickerServiceMock.getByExchangeAndSymbol = jest.fn();
  orderClientMock.send = jest.fn();

  createOrderService = new CreateOrderService(getTickerServiceMock, orderClientMock);
});

describe('CreateOrderService', () => {
  let creationDate: Date;
  let createOrder: CreateOrder;
  let ticker: Ticker;
  let order: Order;

  beforeEach(() => {
    creationDate = new Date();
    MockDate.set(creationDate);

    ticker = buildDefaultTicker();
    getTickerServiceMock.getByExchangeAndSymbol.mockResolvedValue(ticker);
  });

  describe('Given a market order to create', () => {
    beforeEach(() => {
      createOrder = buildDefaultCreateMarketOrder();
    });

    describe('When order is created', () => {
      beforeEach(() => {
        order = buildDefaultMarketOrder();
        orderClientMock.send.mockResolvedValue(order);
      });

      it('Then created order is returned', async () => {
        const result = await createOrderService.create(createOrder);
        expect(result).toEqual(order);

        expect(getTickerServiceMock.getByExchangeAndSymbol).toHaveBeenCalledTimes(1);
        const getByExchangeAndSymbolParams = getTickerServiceMock.getByExchangeAndSymbol.mock.calls[0];
        expect(getByExchangeAndSymbolParams.length).toEqual(2);
        expect(getByExchangeAndSymbolParams[0]).toEqual(createOrder.exchange);
        expect(getByExchangeAndSymbolParams[1]).toEqual(createOrder.symbol);

        expect(orderClientMock.send).toHaveBeenCalledTimes(1);
        const sendParams = orderClientMock.send.mock.calls[0];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0]).toEqual({
          ...createOrder,
          id: 'mocked-uuid',
          requestedQuantity: truncate(createOrder.requestedQuantity, ticker.quoteAssetPrecision),
          status: 'Waiting',
          creationDate: creationDate,
        });
      });
    });
  });
});
