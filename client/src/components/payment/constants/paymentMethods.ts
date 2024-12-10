import { Capacitor } from '@capacitor/core';

export enum PaymentMethod {
  WeChatPay = 'wechat_pay',
  AliPay = 'alipay',
  Card = 'card',
  Bitcoin = 'bitcoin',
  GooglePay = 'google_pay',
  ApplePay = 'apple_pay',
  InAppPurchase = 'in_app_purchase',
}

export interface PaymentMethodConfig {
  id: PaymentMethod;
  name: string;
  icon: string;
  regions?: string[];
  providers?: string[];
  platforms?: string[];
}

export const getAvailablePaymentMethods = (): PaymentMethodConfig[] => {
  const platform = Capacitor.getPlatform();

  // For Android, show only in-app purchase as Google Pay
  if (platform === 'android') {
    return [
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
        id: PaymentMethod.InAppPurchase,
        name: 'Google Pay',
        icon: 'google-pay',
        platforms: ['android'],
        regions: ['GLOBAL'],
      },
    ];
  }

  // For iOS mobile payments
  if (platform === 'ios') {
    return [
      {
        id: PaymentMethod.InAppPurchase,
        name: 'Apple Pay',
        icon: 'apple',
        platforms: ['ios'],
        regions: ['GLOBAL'],
      },
    ];
  }

  // Web gets all other payment methods
  return [
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
  ];
};

export const paymentMethods = getAvailablePaymentMethods();
