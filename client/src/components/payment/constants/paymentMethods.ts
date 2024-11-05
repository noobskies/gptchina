// constants/paymentMethods.ts
export enum PaymentMethod {
  WeChatPay = 'wechat_pay',
  AliPay = 'alipay',
  Card = 'card',
  Bitcoin = 'bitcoin',
  GooglePay = 'google_pay',
  ApplePay = 'apple_pay',
  InAppPurchase = 'in_app_purchase', // Added this
}

export interface PaymentMethodConfig {
  id: PaymentMethod;
  name: string;
  icon: string;
  regions?: string[];
  providers?: string[];
  platforms?: string[];
}

export const paymentMethods: PaymentMethodConfig[] = [
  {
    id: PaymentMethod.Card,
    name: 'Credit Card',
    icon: 'credit-card',
    providers: ['visa', 'mastercard', 'amex'],
  },
  {
    id: PaymentMethod.WeChatPay,
    name: 'WeChat Pay',
    icon: 'wechat',
    regions: ['CN'],
  },
  {
    id: PaymentMethod.AliPay,
    name: 'AliPay',
    icon: 'alipay',
    regions: ['CN'],
  },
  {
    id: PaymentMethod.Bitcoin,
    name: 'Bitcoin',
    icon: 'bitcoin',
  },
  {
    id: PaymentMethod.GooglePay,
    name: 'Google Pay',
    icon: 'google-pay',
    regions: ['GLOBAL'],
  },
  {
    id: PaymentMethod.ApplePay,
    name: 'Apple Pay',
    icon: 'apple-pay',
    regions: ['GLOBAL'],
  },
  {
    id: PaymentMethod.InAppPurchase,
    name: 'In-App Purchase',
    icon: 'mobile',
    platforms: ['ios', 'android'],
    regions: ['GLOBAL'],
  },
];

// You can also export a default object if you prefer
export default {
  PaymentMethod,
  paymentMethods,
};
