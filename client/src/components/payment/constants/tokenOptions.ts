export const tokenOptions: TokenPackage[] = [
  {
    tokens: 100000,
    label: 'com_token_package_label_100k',
    price: 'com_token_package_price_100k_global',
    amount: 1.5 * 100, // $1.50 = 150 cents
    currency: 'USD',
    priceId: 'price_1P6dqBHKD0byXXClWuA2RGY2',
    originalPrice: '$1.50',
    discountedPrice: '$1.50',
  },
  {
    tokens: 500000,
    label: 'com_token_package_label_500k',
    price: 'com_token_package_price_500k_global',
    amount: 5.0 * 100, // $5.00 = 500 cents
    currency: 'USD',
    priceId: 'price_1P6dqdHKD0byXXClcboa06Tu',
    originalPrice: '$7.50',
    discountedPrice: '$5.00',
    discountPercentage: '(30% off)',
  },
  {
    tokens: 1000000,
    label: 'com_token_package_label_1m',
    price: 'com_token_package_price_1m_global',
    amount: 7.5 * 100, // $7.50 = 750 cents
    currency: 'USD',
    priceId: 'price_1P6drEHKD0byXXClOjmSkPKm',
    originalPrice: '$15.00',
    discountedPrice: '$7.50',
    discountPercentage: '(50% off)',
  },
  {
    tokens: 10000000,
    label: 'com_token_package_label_10m',
    price: 'com_token_package_price_10m_global',
    amount: 40.0 * 100, // $40.00 = 4000 cents
    currency: 'USD',
    priceId: 'price_1P6drxHKD0byXXClVVLokkLh',
    originalPrice: '$150.00',
    discountedPrice: '$40.00',
    discountPercentage: '(75% off)',
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
