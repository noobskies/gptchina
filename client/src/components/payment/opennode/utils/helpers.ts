// opennode/utils/helpers.ts
export const formatBTCAmount = (amount: number): string => {
  return `${amount.toFixed(8)} BTC`;
};

export const formatFiatAmount = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
