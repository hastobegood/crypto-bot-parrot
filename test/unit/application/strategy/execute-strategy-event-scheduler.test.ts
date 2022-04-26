import { ExecuteStrategyEventScheduler } from '../../../../src/code/application/strategy/execute-strategy-event-scheduler';
import { StrategyExecution } from '../../../../src/code/domain/strategy-execution/model/strategy-execution';
import { ExecuteStrategyService } from '../../../../src/code/domain/strategy/execute-strategy-service';
import { buildDefaultStrategyExecution } from '../../../builders/domain/strategy-execution/strategy-execution-test-builder';
import { buildDefaultStrategy } from '../../../builders/domain/strategy/strategy-test-builder';

const executeStrategyServiceMock = jest.mocked(jest.genMockFromModule<ExecuteStrategyService>('../../../../src/code/domain/strategy/execute-strategy-service'), true);
const strategy = buildDefaultStrategy();

let executeStrategyEventScheduler: ExecuteStrategyEventScheduler;
beforeEach(() => {
  executeStrategyServiceMock.execute = jest.fn();

  executeStrategyEventScheduler = new ExecuteStrategyEventScheduler(executeStrategyServiceMock, strategy);
});

describe('ExecuteStrategyEventScheduler', () => {
  describe('Given a strategy to execute', () => {
    describe('When execution has failed', () => {
      beforeEach(() => {
        executeStrategyServiceMock.execute.mockRejectedValue(new Error('Error occurred !'));
      });

      it('Then error is thrown', async () => {
        try {
          await executeStrategyEventScheduler.process();
          fail();
        } catch (error) {
          expect((error as Error).message).toEqual('Error occurred !');
        }

        expect(executeStrategyServiceMock.execute).toHaveBeenCalledTimes(1);
        const executeParams = executeStrategyServiceMock.execute.mock.calls[0];
        expect(executeParams.length).toEqual(1);
        expect(executeParams[0]).toEqual(strategy);
      });
    });

    describe('When execution has succeeded', () => {
      let strategyExecution: StrategyExecution;

      beforeEach(() => {
        strategyExecution = buildDefaultStrategyExecution();
        executeStrategyServiceMock.execute.mockResolvedValue(strategyExecution);
      });

      it('Then nothing is returned', async () => {
        await executeStrategyEventScheduler.process();

        expect(executeStrategyServiceMock.execute).toHaveBeenCalledTimes(1);
        const executeParams = executeStrategyServiceMock.execute.mock.calls[0];
        expect(executeParams.length).toEqual(1);
        expect(executeParams[0]).toEqual(strategy);
      });
    });
  });
});
