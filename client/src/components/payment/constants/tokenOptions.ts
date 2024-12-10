import { Capacitor } from '@capacitor/core';

interface TokenPackage {
  tokens: number;
  label: string;
  price: string;
  amount: number;
  currency: string;
  priceId: string;
  originalPrice: string;
  discountedPrice: string;
  discountPercentage?: string;
}

// Helper function to get platform-specific price
const getPlatformSpecificPrice = (tokens: number) => {
  const isIOS = Capacitor.getPlatform() === 'ios';

  if (!isIOS) {
    // Return default prices for non-iOS platforms
    switch (tokens) {
      case 100000:
        return { originalPrice: '$1.50', discountedPrice: '$1.50' };
      case 500000:
        return { originalPrice: '$7.50', discountedPrice: '$5.00' };
      case 1000000:
        return { originalPrice: '$15.00', discountedPrice: '$7.50' };
      case 10000000:
        return { originalPrice: '$150.00', discountedPrice: '$40.00' };
      default:
        return { originalPrice: '$0.00', discountedPrice: '$0.00' };
    }
  }

  // Return iOS-specific prices
  switch (tokens) {
    case 100000:
      return { originalPrice: '$1.99', discountedPrice: '$1.99' };
    case 500000:
      return { originalPrice: '$4.99', discountedPrice: '$4.99' };
    case 1000000:
      return { originalPrice: '$7.99', discountedPrice: '$7.99' };
    case 10000000:
      return { originalPrice: '$39.99', discountedPrice: '$39.99' };
    default:
      return { originalPrice: '$0.00', discountedPrice: '$0.00' };
  }
};

export const tokenOptions: TokenPackage[] = [
  {
    tokens: 100000,
    label: 'com_token_package_label_100k',
    price: 'com_token_package_price_100k_global',
    amount: 1.5 * 100, // $1.50 = 150 cents
    currency: 'USD',
    priceId: 'price_1P6dqBHKD0byXXClWuA2RGY2',
    ...getPlatformSpecificPrice(100000),
  },
  {
    tokens: 500000,
    label: 'com_token_package_label_500k',
    price: 'com_token_package_price_500k_global',
    amount: 5.0 * 100, // $5.00 = 500 cents
    currency: 'USD',
    priceId: 'price_1P6dqdHKD0byXXClcboa06Tu',
    ...getPlatformSpecificPrice(500000),
    discountPercentage: Capacitor.getPlatform() === 'ios' ? '' : '(30% off)',
  },
  {
    tokens: 1000000,
    label: 'com_token_package_label_1m',
    price: 'com_token_package_price_1m_global',
    amount: 7.5 * 100, // $7.50 = 750 cents
    currency: 'USD',
    priceId: 'price_1P6drEHKD0byXXClOjmSkPKm',
    ...getPlatformSpecificPrice(1000000),
    discountPercentage: Capacitor.getPlatform() === 'ios' ? '' : '(50% off)',
  },
  {
    tokens: 10000000,
    label: 'com_token_package_label_10m',
    price: 'com_token_package_price_10m_global',
    amount: 40.0 * 100, // $40.00 = 4000 cents
    currency: 'USD',
    priceId: 'price_1P6drxHKD0byXXClVVLokkLh',
    ...getPlatformSpecificPrice(10000000),
    discountPercentage: Capacitor.getPlatform() === 'ios' ? '' : '(75% off)',
  },
];

// Similarly for China prices, convert to CNY cents
export const chinaTokenOptions: TokenPackage[] = [
  {
    tokens: 100000,
    label: 'com_token_package_label_100k',
    price: 'com_token_package_price_100k',
    amount: 10 * 100, // ¥10 = 1000 cents
    currency: 'CNY',
    priceId: 'price_1ORgxoHKD0byXXClx3u1yLa0',
    originalPrice: '¥10',
    discountedPrice: '¥10',
  },
  {
    tokens: 500000,
    label: 'com_token_package_label_500k',
    price: 'com_token_package_price_500k',
    amount: 35 * 100, // ¥35 = 3500 cents
    currency: 'CNY',
    priceId: 'price_1ORgyJHKD0byXXClfvOyCbp7',
    originalPrice: '¥50',
    discountedPrice: '¥35',
    discountPercentage: '(70%价)',
  },
  {
    tokens: 1000000,
    label: 'com_token_package_label_1m',
    price: 'com_token_package_price_1m',
    amount: 50 * 100, // ¥50 = 5000 cents
    currency: 'CNY',
    priceId: 'price_1ORgyiHKD0byXXClHetdaI3W',
    originalPrice: '¥100',
    discountedPrice: '¥50',
    discountPercentage: '(50%价)',
  },
  {
    tokens: 10000000,
    label: 'com_token_package_label_10m',
    price: 'com_token_package_price_10m',
    amount: 250 * 100, // ¥250 = 25000 cents
    currency: 'CNY',
    priceId: 'price_1ORgzMHKD0byXXClDCm5PkwO',
    originalPrice: '¥1,000',
    discountedPrice: '¥250',
    discountPercentage: '(25%价)',
  },
];
