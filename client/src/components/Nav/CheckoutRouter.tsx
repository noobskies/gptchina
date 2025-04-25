import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import CheckoutModal from './CheckoutModal'; // Existing web checkout
import MobileCheckoutModal from './MobileCheckoutModal'; // New mobile checkout

interface CheckoutRouterProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  reason?: 'insufficient_funds' | 'manual' | null;
  details?: {
    balance?: number;
    requiredTokens?: number;
    cost?: number;
  } | null;
}

const CheckoutRouter = (props: CheckoutRouterProps) => {
  // Determine if we're on a mobile platform
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're running on a mobile platform (iOS or Android)
    const checkPlatform = async () => {
      try {
        const platform = Capacitor.getPlatform();
        setIsMobile(platform === 'ios' || platform === 'android');
      } catch (err) {
        console.error('Failed to check platform', err);
        setIsMobile(false);
      }
    };

    checkPlatform();
  }, []);

  // Use the appropriate checkout component based on platform
  if (isMobile) {
    return <MobileCheckoutModal {...props} />;
  }

  // Default to the web checkout for non-mobile platforms
  return <CheckoutModal {...props} />;
};

export default CheckoutRouter;
