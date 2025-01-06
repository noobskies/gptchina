// opennode/types/index.ts
export interface OpenNodeCharge {
  id: string;
  amount: number;
  description: string;
  created_at: number;
  status: OpenNodeChargeStatus;
  success_url: string;
  callback_url: string;
  currency: string;
  source_fiat_value: number;
  fiat_value: number;
  auto_settle: boolean;
  lightning_invoice?: {
    payreq: string;
    expires_at: number;
  };
  chain_invoice?: {
    address: string;
    expires_at: number;
  };
}

export type OpenNodeChargeStatus = 'unpaid' | 'paid' | 'processing' | 'expired';

export interface CreateChargeParams {
  amount: number;
  currency: string;
  tokens: number;
  description?: string;
  customId?: string;
  callbackUrl?: string;
  successUrl?: string;
  autoSettle?: boolean;
}

export interface OpenNodeClientConfig {
  apiKey: string;
  apiUrl: string;
  callbackUrl: string;
  successUrl: string;
}
