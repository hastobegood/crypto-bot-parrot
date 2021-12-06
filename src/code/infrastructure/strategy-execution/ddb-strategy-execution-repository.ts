import { BatchWriteCommand, BatchWriteCommandInput, DynamoDBDocumentClient, GetCommand, GetCommandInput } from '@aws-sdk/lib-dynamodb';
import { StrategyExecution, StrategyExecutionOrder } from '../../domain/strategy-execution/model/strategy-execution';
import { StrategyExecutionRepository } from '../../domain/strategy-execution/strategy-execution-repository';

export class DdbStrategyExecutionRepository implements StrategyExecutionRepository {
  constructor(private tableName: string, private ddbClient: DynamoDBDocumentClient) {}

  async getLast(): Promise<StrategyExecution | null> {
    const getInput: GetCommandInput = {
      TableName: this.tableName,
      Key: {
        pk: `StrategyExecution::Last`,
        sk: 'Details',
      },
    };

    const getOutput = await this.ddbClient.send(new GetCommand(getInput));

    return getOutput.Item ? convertToStrategyExecution(getOutput.Item.data) : null;
  }

  async save(strategyExecution: StrategyExecution): Promise<void> {
    const batchWriteInput: BatchWriteCommandInput = {
      RequestItems: {
        [this.tableName]: [this.#buildPutRequest(strategyExecution, strategyExecution.id), this.#buildPutRequest(strategyExecution, 'Last')],
      },
    };

    await this.ddbClient.send(new BatchWriteCommand(batchWriteInput));
  }

  #buildPutRequest(strategyExecution: StrategyExecution, id: string): any {
    return {
      PutRequest: {
        Item: {
          pk: `StrategyExecution::${id}`,
          sk: 'Details',
          type: 'StrategyExecution',
          data: convertToStrategyExecutionEntity(strategyExecution),
        },
      },
    };
  }
}

export interface StrategyExecutionEntity extends Omit<StrategyExecution, 'creationDate' | 'orders'> {
  creationDate: number;
  orders: StrategyExecutionOrderEntity[];
}

export interface StrategyExecutionOrderEntity extends Omit<StrategyExecutionOrder, 'transactionDate'> {
  transactionDate?: number;
}

export const convertToStrategyExecutionEntity = (strategyExecution: StrategyExecution): StrategyExecutionEntity => {
  return {
    ...strategyExecution,
    creationDate: strategyExecution.creationDate.valueOf(),
    orders: strategyExecution.orders.map((order) => ({
      ...order,
      transactionDate: order.transactionDate?.valueOf(),
    })),
  };
};

export const convertToStrategyExecution = (strategyExecutionEntity: StrategyExecutionEntity): StrategyExecution => {
  return {
    ...strategyExecutionEntity,
    creationDate: new Date(strategyExecutionEntity.creationDate),
    orders: strategyExecutionEntity.orders.map((orderEntity) => ({
      ...orderEntity,
      transactionDate: orderEntity.transactionDate ? new Date(orderEntity.transactionDate) : undefined,
    })),
  };
};
