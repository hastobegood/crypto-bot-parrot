import { v4 } from 'uuid';

import { CreateStrategyExecution, StrategyExecution } from './model/strategy-execution';
import { StrategyExecutionRepository } from './strategy-execution-repository';

export class CreateStrategyExecutionService {
  constructor(private strategyExecutionRepository: StrategyExecutionRepository) {}

  async create(createStrategyExecution: CreateStrategyExecution): Promise<StrategyExecution> {
    const creationDate = new Date();
    const strategyExecution: StrategyExecution = {
      ...createStrategyExecution,
      id: v4(),
      creationDate: creationDate,
    };

    await this.strategyExecutionRepository.save(strategyExecution);

    return strategyExecution;
  }
}
