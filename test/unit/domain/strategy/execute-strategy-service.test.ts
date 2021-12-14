import { mocked } from 'ts-jest/utils';
import { GetStrategyExecutionService } from '../../../../src/code/domain/strategy-execution/get-strategy-execution-service';
import { CreateOrderService } from '../../../../src/code/domain/order/create-order-service';
import { CreateStrategyExecutionService } from '../../../../src/code/domain/strategy-execution/create-strategy-execution-service';
import { ExecuteStrategyService } from '../../../../src/code/domain/strategy/execute-strategy-service';
import { Strategy } from '../../../../src/code/domain/strategy/model/strategy';
import { buildDefaultStrategy } from '../../../builders/domain/strategy/strategy-test-builder';
import { StrategyExecution } from '../../../../src/code/domain/strategy-execution/model/strategy-execution';
import { buildDefaultStrategyExecution } from '../../../builders/domain/strategy-execution/strategy-execution-test-builder';
import { Order } from '../../../../src/code/domain/order/model/order';

const createOrderServiceMock = mocked(jest.genMockFromModule<CreateOrderService>('../../../../src/code/domain/order/create-order-service'), true);
const getStrategyExecutionServiceMock = mocked(jest.genMockFromModule<GetStrategyExecutionService>('../../../../src/code/domain/strategy-execution/get-strategy-execution-service'), true);
const createStrategyExecutionServiceMock = mocked(jest.genMockFromModule<CreateStrategyExecutionService>('../../../../src/code/domain/strategy-execution/create-strategy-execution-service'), true);

let executeStrategyService: ExecuteStrategyService;
beforeEach(() => {
  createOrderServiceMock.create = jest.fn();
  getStrategyExecutionServiceMock.getLast = jest.fn();
  createStrategyExecutionServiceMock.create = jest.fn();

  executeStrategyService = new ExecuteStrategyService(createOrderServiceMock, getStrategyExecutionServiceMock, createStrategyExecutionServiceMock);
});

describe('ExecuteStrategyService', () => {
  describe('Given a strategy to execute', () => {
    let strategy: Strategy;
    let strategyExecution: StrategyExecution;

    beforeEach(() => {
      strategy = buildDefaultStrategy();

      strategyExecution = buildDefaultStrategyExecution();
    });

    describe('When main order is not a success', () => {
      beforeEach(() => {
        createOrderServiceMock.create.mockRejectedValueOnce(new Error('Main order error !'));

        createStrategyExecutionServiceMock.create.mockResolvedValueOnce(strategyExecution);
      });

      it('Then unsuccessful strategy execution is returned', async () => {
        const result = await executeStrategyService.execute(strategy);
        expect(result).toEqual(strategyExecution);

        expect(createOrderServiceMock.create).toHaveBeenCalledTimes(1);
        const createOrderParams = createOrderServiceMock.create.mock.calls[0];
        expect(createOrderParams.length).toEqual(1);
        expect(createOrderParams[0]).toEqual({
          exchange: strategy.exchange,
          symbol: strategy.symbol,
          side: 'Buy',
          type: 'Market',
          requestedQuantity: strategy.quantity,
        });

        expect(getStrategyExecutionServiceMock.getLast).toHaveBeenCalledTimes(0);

        expect(createStrategyExecutionServiceMock.create).toHaveBeenCalledTimes(1);
        const createStrategyExecutionParams = createStrategyExecutionServiceMock.create.mock.calls[0];
        expect(createStrategyExecutionParams.length).toEqual(1);
        expect(createStrategyExecutionParams[0]).toEqual({
          success: false,
          orders: [
            {
              success: false,
              message: 'Main order error !',
              symbol: strategy.symbol,
              requestedQuantity: strategy.quantity,
            },
          ],
        });
      });
    });

    describe('When main order is a success', () => {
      let mainOrder: Order;
      let assetOrder1: Order;
      let assetOrder2: Order;

      describe('And one or more asset orders are not a success', () => {
        it('Then unsuccessful strategy execution is returned', () => {
          // TODO
        });
      });

      describe('And all asset orders are a success', () => {
        it('Then successful strategy execution is returned', () => {
          // TODO
        });
      });
    });

    describe('When last strategy execution is not null', () => {
      it('Then next asset is chosen', async () => {
        // TODO
      });
    });
  });
});
