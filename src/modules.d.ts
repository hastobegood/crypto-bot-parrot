declare namespace NodeJS {
  export interface ProcessEnv {
    LOG_LEVEL: string;
    ENV: string;
    REGION: string;
    TRACING: boolean;
    EXCHANGES_SECRET_NAME: string;
    STRATEGY_TABLE_NAME: string;
    STRATEGY: string;
  }
}
