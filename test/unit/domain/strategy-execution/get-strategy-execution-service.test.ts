import { StrategyExecution } from '../../../../src/code/domain/strategy-execution/model/strategy-execution';
import { buildDefaultStrategyExecution } from '../../../builders/domain/strategy-execution/strategy-execution-test-builder';
import { StrategyExecutionRepository } from '../../../../src/code/domain/strategy-execution/strategy-execution-repository';
import { GetStrategyExecutionService } from '../../../../src/code/domain/strategy-execution/get-strategy-execution-service';

const strategyExecutionRepositoryMock = jest.mocked(jest.genMockFromModule<StrategyExecutionRepository>('../../../../src/code/domain/strategy-execution/strategy-execution-repository'), true);

let getStrategyExecutionService: GetStrategyExecutionService;
beforeEach(() => {
  strategyExecutionRepositoryMock.getLast = jest.fn();

  getStrategyExecutionService = new GetStrategyExecutionService(strategyExecutionRepositoryMock);
});

describe('GetStrategyExecutionService', () => {
  describe('Given last strategy execution to retrieve', () => {
    describe('When last strategy execution is not found', () => {
      beforeEach(() => {
        strategyExecutionRepositoryMock.getLast.mockResolvedValue(null);
      });

      it('Then null is returned', async () => {
        const result = await getStrategyExecutionService.getLast();
        expect(result).toBeNull();

        expect(strategyExecutionRepositoryMock.getLast).toHaveBeenCalledTimes(1);
        const getLastParams = strategyExecutionRepositoryMock.getLast.mock.calls[0];
        expect(getLastParams.length).toEqual(0);
      });
    });

    describe('When last strategy execution is found', () => {
      let strategyExecution: StrategyExecution;

      beforeEach(() => {
        strategyExecution = buildDefaultStrategyExecution();
        strategyExecutionRepositoryMock.getLast.mockResolvedValue(strategyExecution);
      });

      it('Then last strategy execution is returned', async () => {
        const result = await getStrategyExecutionService.getLast();
        expect(result).toEqual(strategyExecution);

        expect(strategyExecutionRepositoryMock.getLast).toHaveBeenCalledTimes(1);
        const getLastParams = strategyExecutionRepositoryMock.getLast.mock.calls[0];
        expect(getLastParams.length).toEqual(0);
      });
    });
  });
});
