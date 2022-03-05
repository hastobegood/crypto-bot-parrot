import { Order, SendOrderClient } from '@hastobegood/crypto-bot-artillery/order';
import { buildDefaultMarketOrder } from '@hastobegood/crypto-bot-artillery/test/builders';
import { CreateOrder } from '../../../../src/code/domain/order/model/order';
import { buildDefaultCreateOrder } from '../../../builders/domain/order/order-test-builder';
import { CreateOrderService } from '../../../../src/code/domain/order/create-order-service';

const sendOrderClientMock = jest.mocked(jest.genMockFromModule<SendOrderClient>('@hastobegood/crypto-bot-artillery'), true);

let createOrderService: CreateOrderService;
beforeEach(() => {
  sendOrderClientMock.send = jest.fn();

  createOrderService = new CreateOrderService(sendOrderClientMock);
});

describe('CreateOrderService', () => {
  let createOrder: CreateOrder;
  let order: Order;

  describe('Given an order to create', () => {
    beforeEach(() => {
      createOrder = buildDefaultCreateOrder();
    });

    describe('When order is created', () => {
      beforeEach(() => {
        order = buildDefaultMarketOrder();
        sendOrderClientMock.send.mockResolvedValue(order);
      });

      it('Then created order is returned', async () => {
        const result = await createOrderService.create(createOrder);
        expect(result).toEqual(order);

        expect(sendOrderClientMock.send).toHaveBeenCalledTimes(1);
        const sendParams = sendOrderClientMock.send.mock.calls[0];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0]).toEqual({
          exchange: createOrder.exchange,
          symbol: createOrder.symbol,
          side: 'Buy',
          type: 'Market',
          quote: true,
          requestedQuantity: createOrder.requestedQuantity,
        });
      });
    });
  });
});
