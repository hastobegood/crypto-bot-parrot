import { StrategyExecution } from './model/strategy-execution';

export interface StrategyExecutionRepository {
  save(strategyExecution: StrategyExecution): Promise<void>;

  getLast(): Promise<StrategyExecution | null>;
}
