import MockDate from 'mockdate';
import { CreateStrategyExecution } from '../../../../src/code/domain/strategy-execution/model/strategy-execution';
import { buildDefaultCreateStrategyExecution } from '../../../builders/domain/strategy-execution/strategy-execution-test-builder';
import { StrategyExecutionRepository } from '../../../../src/code/domain/strategy-execution/strategy-execution-repository';
import { CreateStrategyExecutionService } from '../../../../src/code/domain/strategy-execution/create-strategy-execution-service';

jest.mock('uuid', () => {
  return {
    v4: () => 'mocked-uuid',
  };
});

const strategyExecutionRepositoryMock = jest.mocked(jest.genMockFromModule<StrategyExecutionRepository>('../../../../src/code/domain/strategy-execution/strategy-execution-repository'), true);

let createStrategyExecutionService: CreateStrategyExecutionService;
beforeEach(() => {
  strategyExecutionRepositoryMock.save = jest.fn();

  createStrategyExecutionService = new CreateStrategyExecutionService(strategyExecutionRepositoryMock);
});

describe('CreateStrategyExecutionService', () => {
  describe('Given a strategy execution to save', () => {
    let creationDate: Date;
    let createStrategyExecution: CreateStrategyExecution;

    beforeEach(() => {
      creationDate = new Date();
      MockDate.set(creationDate);

      createStrategyExecution = buildDefaultCreateStrategyExecution();
    });

    describe('When strategy execution is saved', () => {
      it('Then saved strategy execution is returned', async () => {
        const result = await createStrategyExecutionService.create(createStrategyExecution);
        expect(result).toEqual({
          ...createStrategyExecution,
          id: 'mocked-uuid',
          creationDate: creationDate,
        });

        expect(strategyExecutionRepositoryMock.save).toHaveBeenCalledTimes(1);
        const saveParams = strategyExecutionRepositoryMock.save.mock.calls[0];
        expect(saveParams.length).toEqual(1);
        expect(saveParams[0]).toEqual({
          ...createStrategyExecution,
          id: 'mocked-uuid',
          creationDate: creationDate,
        });
      });
    });
  });
});
