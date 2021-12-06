import { StrategyExecution } from './model/strategy-execution';
import { StrategyExecutionRepository } from './strategy-execution-repository';

export class GetStrategyExecutionService {
  constructor(private strategyExecutionRepository: StrategyExecutionRepository) {}

  async getLast(): Promise<StrategyExecution | null> {
    return this.strategyExecutionRepository.getLast();
  }
}
