import 'source-map-support/register';
import { Context, ScheduledEvent } from 'aws-lambda';
import { smClient } from '../code/configuration/aws/secrets-manager';
import { ddbClient } from '../code/configuration/aws/dynamodb';
import { handleEvent } from './handler-utils';
import { BinanceAuthentication } from '../code/infrastructure/common/exchanges/binance/binance-authentication';
import { BinanceTickerClient } from '../code/infrastructure/ticker/exchanges/binance/binance-ticker-client';
import { HttpTickerClient } from '../code/infrastructure/ticker/http-ticker-client';
import { GetTickerService } from '../code/domain/ticker/get-ticker-service';
import { BinanceOrderClient } from '../code/infrastructure/order/exchanges/binance/binance-order-client';
import { HttpOrderClient } from '../code/infrastructure/order/http-order-client';
import { CreateOrderService } from '../code/domain/order/create-order-service';
import { DdbStrategyExecutionRepository } from '../code/infrastructure/strategy-execution/ddb-strategy-execution-repository';
import { GetStrategyExecutionService } from '../code/domain/strategy-execution/get-strategy-execution-service';
import { CreateStrategyExecutionService } from '../code/domain/strategy-execution/create-strategy-execution-service';
import { Strategy } from '../code/domain/strategy/model/strategy';
import { ExecuteStrategyService } from '../code/domain/strategy/execute-strategy-service';
import { ExecuteStrategyEventScheduler } from '../code/application/strategy/execute-strategy-event-scheduler';

const binanceAuthentication = new BinanceAuthentication(process.env.EXCHANGES_SECRET_NAME, smClient);

const binanceTickerClient = new BinanceTickerClient(binanceAuthentication);
const tickerClient = new HttpTickerClient([binanceTickerClient]);
const getTickerService = new GetTickerService(tickerClient);

const binanceOrderClient = new BinanceOrderClient(binanceAuthentication);
const orderClient = new HttpOrderClient([binanceOrderClient]);
const createOrderService = new CreateOrderService(getTickerService, orderClient);

const strategyExecutionRepository = new DdbStrategyExecutionRepository(process.env.STRATEGY_TABLE_NAME, ddbClient);
const getStrategyExecutionService = new GetStrategyExecutionService(strategyExecutionRepository);
const createStrategyExecutionService = new CreateStrategyExecutionService(strategyExecutionRepository);

const processTradingService = new ExecuteStrategyService(createOrderService, getStrategyExecutionService, createStrategyExecutionService);

const strategy = JSON.parse(process.env.STRATEGY) as Strategy;
const executeStrategyEventScheduler = new ExecuteStrategyEventScheduler(processTradingService, strategy);

export const handler = async (event: ScheduledEvent, context: Context): Promise<void> => {
  return handleEvent(context, async () => executeStrategyEventScheduler.process());
};
