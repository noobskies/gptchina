// opennode/utils/openNodeClient.ts
export class OpenNodeClient {
  private config: OpenNodeClientConfig;

  constructor(config: OpenNodeClientConfig) {
    this.config = config;
  }

  async createCharge(params: CreateChargeParams): Promise<OpenNodeCharge> {
    const response = await fetch(`${this.config.apiUrl}/v1/charges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.config.apiKey,
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
        description: params.description,
        callback_url: params.callbackUrl || this.config.callbackUrl,
        success_url: params.successUrl || this.config.successUrl,
        auto_settle: params.autoSettle ?? true,
        custom_id: params.customId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create charge');
    }

    return response.json();
  }

  async getCharge(chargeId: string): Promise<OpenNodeCharge> {
    const response = await fetch(`${this.config.apiUrl}/v1/charge/${chargeId}`, {
      headers: {
        Authorization: this.config.apiKey,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get charge');
    }

    return response.json();
  }
}
