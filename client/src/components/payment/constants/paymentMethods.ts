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
  const isNativeMobile = platform === 'android' || platform === 'ios';

  const methods: PaymentMethodConfig[] = [
    {
      id: PaymentMethod.Card,
      name: 'Credit Card',
      icon: 'credit-card',
      providers: ['visa', 'mastercard', 'amex'],
      platforms: ['web'],
    },
    {
      id: PaymentMethod.WeChatPay,
      name: 'WeChat Pay',
      icon: 'wechat',
      regions: ['CN'],
      platforms: ['web'],
    },
    {
      id: PaymentMethod.AliPay,
      name: 'AliPay',
      icon: 'alipay',
      regions: ['CN'],
      platforms: ['web'],
    },
    {
      id: PaymentMethod.Bitcoin,
      name: 'Bitcoin',
      icon: 'bitcoin',
      platforms: ['web'],
    },
  ];

  // Only show Google Pay on web
  if (platform === 'web') {
    methods.push({
      id: PaymentMethod.GooglePay,
      name: 'Google Pay',
      icon: 'google-pay',
      regions: ['GLOBAL'],
      platforms: ['web'],
    });
  }

  // Only show Apple Pay on web
  if (platform === 'web') {
    methods.push({
      id: PaymentMethod.ApplePay,
      name: 'Apple Pay',
      icon: 'apple-pay',
      regions: ['GLOBAL'],
      platforms: ['web'],
    });
  }

  // Show In-App Purchase for native mobile apps
  if (isNativeMobile) {
    methods.push({
      id: PaymentMethod.InAppPurchase,
      name: platform === 'android' ? 'Google Play' : 'App Store',
      icon: platform === 'android' ? 'google-play' : 'apple',
      platforms: [platform],
      regions: ['GLOBAL'],
    });
  }

  return methods;
};

export const paymentMethods = getAvailablePaymentMethods();
