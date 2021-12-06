import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mocked } from 'ts-jest/utils';
import { StrategyExecutionRepository } from '../../../../src/code/domain/strategy-execution/strategy-execution-repository';
import { convertToStrategyExecutionEntity, DdbStrategyExecutionRepository } from '../../../../src/code/infrastructure/strategy-execution/ddb-strategy-execution-repository';
import { StrategyExecution } from '../../../../src/code/domain/strategy-execution/model/strategy-execution';
import { buildDefaultStrategyExecution } from '../../../builders/domain/strategy-execution/strategy-execution-test-builder';

const ddbClientMock = mocked(jest.genMockFromModule<DynamoDBDocumentClient>('@aws-sdk/lib-dynamodb'), true);

let strategyExecutionRepository: StrategyExecutionRepository;
beforeEach(() => {
  ddbClientMock.send = jest.fn();

  strategyExecutionRepository = new DdbStrategyExecutionRepository('my-table', ddbClientMock);
});

describe('DdbStrategyExecutionRepository', () => {
  let strategyExecution: StrategyExecution;

  beforeEach(() => {
    strategyExecution = buildDefaultStrategyExecution();
  });

  describe('Given last strategy execution to retrieve', () => {
    describe('When strategy execution is not found', () => {
      beforeEach(() => {
        ddbClientMock.send.mockImplementation(() => ({
          Item: undefined,
        }));
      });

      it('Then null is returned', async () => {
        const result = await strategyExecutionRepository.getLast();
        expect(result).toBeNull();

        expect(ddbClientMock.send).toHaveBeenCalledTimes(1);
        const sendParams = ddbClientMock.send.mock.calls[0];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0].input).toEqual({
          TableName: 'my-table',
          Key: {
            pk: 'StrategyExecution::Last',
            sk: 'Details',
          },
        });
      });
    });

    describe('When strategy execution is found', () => {
      beforeEach(() => {
        ddbClientMock.send.mockImplementation(() => ({
          Item: {
            data: convertToStrategyExecutionEntity(strategyExecution),
          },
        }));
      });

      it('Then strategy execution is returned', async () => {
        const result = await strategyExecutionRepository.getLast();
        expect(result).toEqual(strategyExecution);

        expect(ddbClientMock.send).toHaveBeenCalledTimes(1);
        const sendParams = ddbClientMock.send.mock.calls[0];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0].input).toEqual({
          TableName: 'my-table',
          Key: {
            pk: 'StrategyExecution::Last',
            sk: 'Details',
          },
        });
      });
    });
  });

  describe('Given a strategy execution to save', () => {
    describe('When strategy execution is saved', () => {
      it('Then strategy execution items are saved', async () => {
        await strategyExecutionRepository.save(strategyExecution);

        expect(ddbClientMock.send).toHaveBeenCalledTimes(1);
        const sendParams = ddbClientMock.send.mock.calls[0];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0].input).toEqual({
          RequestItems: {
            'my-table': [
              {
                PutRequest: {
                  Item: {
                    pk: `StrategyExecution::${strategyExecution.id}`,
                    sk: 'Details',
                    type: 'StrategyExecution',
                    data: convertToStrategyExecutionEntity(strategyExecution),
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    pk: 'StrategyExecution::Last',
                    sk: 'Details',
                    type: 'StrategyExecution',
                    data: convertToStrategyExecutionEntity(strategyExecution),
                  },
                },
              },
            ],
          },
        });
      });
    });
  });
});
