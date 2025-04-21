import {
  Purchases,
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

class RevenueCatService {
  private initialized = false;

  // Map our token package IDs to RevenueCat product IDs
  private packageIdMap = {
    '100k': 'tokens_100k',
    '500k': 'tokens_500k',
    '1m': 'tokens_1m',
    '10m': 'tokens_10m',
  };

  async initialize(userId: string): Promise<boolean> {
    if (this.initialized) {return true;}

    // Only initialize on mobile platforms
    if (
      !Capacitor.isNativePlatform() ||
      (Capacitor.getPlatform() !== 'ios' && Capacitor.getPlatform() !== 'android')
    ) {
      console.log('RevenueCat not initialized - not on a mobile platform');
      return false;
    }

    try {
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG }); // For development

      // Set user ID for identifying the current user
      if (userId) {
        await Purchases.logIn({ appUserID: userId });
      }

      this.initialized = true;
      console.log('RevenueCat initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize RevenueCat', error);
      return false;
    }
  }

  async getOfferings(): Promise<any> {
    if (!this.initialized) {
      console.warn('RevenueCat not initialized');
      return { current: null };
    }

    try {
      return await Purchases.getOfferings();
    } catch (error) {
      console.error('Failed to get offerings', error);
      return { current: null };
    }
  }

  async purchasePackage(packageId: string): Promise<any> {
    if (!this.initialized) {
      console.warn('RevenueCat not initialized');
      throw new Error('RevenueCat not initialized');
    }

    try {
      const rcPackageId = this.packageIdMap[packageId];
      if (!rcPackageId) {
        throw new Error(`Unknown package ID: ${packageId}`);
      }

      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;

      if (!currentOffering) {
        throw new Error('No offerings available');
      }

      // Find the package by identifier
      const pkg = currentOffering.availablePackages.find((p) => p.identifier === rcPackageId);

      if (!pkg) {
        throw new Error(`Package ${rcPackageId} not found in offering`);
      }

      const purchaseResult = await Purchases.purchasePackage({
        aPackage: pkg,
      });

      return purchaseResult;
    } catch (error) {
      console.error('Purchase failed', error);
      throw error;
    }
  }

  async restorePurchases(): Promise<CustomerInfo | null> {
    if (!this.initialized) {
      console.warn('RevenueCat not initialized');
      return null;
    }

    try {
      const { customerInfo } = await Purchases.restorePurchases();
      return customerInfo;
    } catch (error) {
      console.error('Restore purchases failed', error);
      return null;
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo | null> {
    if (!this.initialized) {
      console.warn('RevenueCat not initialized');
      return null;
    }

    try {
      const { customerInfo } = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Failed to get customer info', error);
      return null;
    }
  }
}

export const revenueCatService = new RevenueCatService();
