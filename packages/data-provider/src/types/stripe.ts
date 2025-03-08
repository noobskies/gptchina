export type CreatePaymentIntentRequest = {
  amount: number;
  packageId: string;
};

export type CreatePaymentIntentResponse = {
  clientSecret: string;
};
