import { GetSecretValueCommand, GetSecretValueCommandInput, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import crypto from 'crypto';

interface BinanceSecrets {
  binance: {
    apiUrl: string;
    apiKey: string;
    secretKey: string;
  };
}

export class BinanceAuthentication {
  private secrets?: BinanceSecrets;

  constructor(private secretName: string, private smClient: SecretsManagerClient) {}

  async getApiUrl(): Promise<string> {
    return (await this.#getSecrets()).binance.apiUrl;
  }

  async getApiKey(): Promise<string> {
    return (await this.#getSecrets()).binance.apiKey;
  }

  async getSecretKey(): Promise<string> {
    return (await this.#getSecrets()).binance.secretKey;
  }

  async getSignature(parameters: string): Promise<string> {
    const hmac = crypto.createHmac('sha256', await this.getSecretKey());
    const result = hmac.update(parameters);

    return result.digest('hex');
  }

  async #getSecrets(): Promise<BinanceSecrets> {
    if (!this.secrets) {
      const getSecretValueInput: GetSecretValueCommandInput = {
        SecretId: this.secretName,
      };

      const getSecretValueOutput = await this.smClient.send(new GetSecretValueCommand(getSecretValueInput));

      this.secrets = JSON.parse(getSecretValueOutput.SecretString!) as BinanceSecrets;
    }
    return this.secrets;
  }
}
