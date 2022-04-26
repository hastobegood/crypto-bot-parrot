import 'source-map-support/register';
import { loadExchangesClients } from '@hastobegood/crypto-bot-artillery';
import { handleEvent } from '@hastobegood/crypto-bot-artillery/common';
import { loadSendOrderClient } from '@hastobegood/crypto-bot-artillery/order';
import { loadFetchTickerClient } from '@hastobegood/crypto-bot-artillery/ticker';
import { Context, ScheduledEvent } from 'aws-lambda';

import { ExecuteStrategyEventScheduler } from '../code/application/strategy/execute-strategy-event-scheduler';
import { ddbClient } from '../code/configuration/aws/dynamodb';
import { smClient } from '../code/configuration/aws/secrets-manager';
import { CreateOrderService } from '../code/domain/order/create-order-service';
import { CreateStrategyExecutionService } from '../code/domain/strategy-execution/create-strategy-execution-service';
import { GetStrategyExecutionService } from '../code/domain/strategy-execution/get-strategy-execution-service';
import { ExecuteStrategyService } from '../code/domain/strategy/execute-strategy-service';
import { Strategy } from '../code/domain/strategy/model/strategy';
import { BinanceAuthentication } from '../code/infrastructure/common/exchanges/binance/binance-authentication';
import { DdbStrategyExecutionRepository } from '../code/infrastructure/strategy-execution/ddb-strategy-execution-repository';

const binanceAuthentication = new BinanceAuthentication(process.env.EXCHANGES_SECRET_NAME, smClient);
const exchangesClients = loadExchangesClients({ binanceApiInfoProvider: binanceAuthentication });
const fetchTickerClient = loadFetchTickerClient(exchangesClients);
const sendOrderClient = loadSendOrderClient(exchangesClients, fetchTickerClient);

const createOrderService = new CreateOrderService(sendOrderClient);

const strategyExecutionRepository = new DdbStrategyExecutionRepository(process.env.STRATEGY_TABLE_NAME, ddbClient);
const getStrategyExecutionService = new GetStrategyExecutionService(strategyExecutionRepository);
const createStrategyExecutionService = new CreateStrategyExecutionService(strategyExecutionRepository);

const processTradingService = new ExecuteStrategyService(createOrderService, getStrategyExecutionService, createStrategyExecutionService);

const strategy = JSON.parse(process.env.STRATEGY) as Strategy;
const executeStrategyEventScheduler = new ExecuteStrategyEventScheduler(processTradingService, strategy);

export const handler = async (event: ScheduledEvent, context: Context): Promise<void> => {
  return handleEvent(context, async () => executeStrategyEventScheduler.process());
};
