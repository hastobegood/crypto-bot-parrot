import { logger } from '@hastobegood/crypto-bot-artillery/common';

import { ExecuteStrategyService } from '../../domain/strategy/execute-strategy-service';
import { Strategy } from '../../domain/strategy/model/strategy';

export class ExecuteStrategyEventScheduler {
  constructor(private executeStrategyService: ExecuteStrategyService, private strategy: Strategy) {}

  async process(): Promise<void> {
    try {
      logger.info({ strategy: this.strategy }, 'Executing strategy');
      const strategyExecution = await this.executeStrategyService.execute(this.strategy);
      logger.info({ strategy: this.strategy, execution: strategyExecution }, 'Strategy executed');
    } catch (error) {
      logger.error({ strategy: this.strategy }, 'Unable to execute strategy');
      throw error;
    }
  }
}
