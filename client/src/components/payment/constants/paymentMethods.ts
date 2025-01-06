import { Capacitor } from '@capacitor/core';

export enum PaymentMethod {
  WeChatPay = 'wechat_pay',
  AliPay = 'alipay',
  Card = 'card',
  OpenNode = 'opennode', // OpenNode for all crypto payments
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
  description?: string;
}

export const getAvailablePaymentMethods = (): PaymentMethodConfig[] => {
  const platform = Capacitor.getPlatform();
  const currentDomain = window.location.hostname;

  // For Android, show specific payment methods
  if (platform === 'android') {
    return [
      {
        id: PaymentMethod.Card,
        name: 'Credit Card',
        icon: 'credit-card',
        providers: ['visa', 'mastercard', 'amex'],
      },
      {
        id: PaymentMethod.OpenNode,
        name: 'Bitcoin',
        icon: 'bitcoin',
        description: 'Pay with Bitcoin or Lightning Network',
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
      {
        id: PaymentMethod.OpenNode,
        name: 'Bitcoin',
        icon: 'bitcoin',
        description: 'Pay with Bitcoin or Lightning Network',
      },
    ];
  }

  // Base payment methods for web
  const basePaymentMethods: PaymentMethodConfig[] = [
    {
      id: PaymentMethod.Card,
      name: 'Credit Card',
      icon: 'credit-card',
      providers: ['visa', 'mastercard', 'amex'],
    },
    {
      id: PaymentMethod.OpenNode,
      name: 'Bitcoin',
      icon: 'bitcoin',
      description: 'Pay with Bitcoin or Lightning Network',
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

  // Add China-specific payment methods if on Chinese domain
  if (currentDomain === 'gptchina.io') {
    basePaymentMethods.push(
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
    );
  }

  return basePaymentMethods;
};

export const paymentMethods = getAvailablePaymentMethods();
