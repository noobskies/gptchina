// First, create these two new components in a new file (e.g., src/components/Stripe/StripePaymentPages.jsx)
import { useEffect } from 'react';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

export const StripeSuccessPage = () => {
  useEffect(() => {
    const handleSuccess = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          alert('Payment successful!');
          await Browser.close();
          window.location.reload();
        } catch (err) {
          console.error('Error handling success:', err);
        }
      }
    };
    handleSuccess();
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600">
          Processing your payment...
        </p>
      </div>
    </div>
  );
};

export const StripeCancelPage = () => {
  useEffect(() => {
    const handleCancel = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          alert('Payment cancelled');
          await Browser.close();
        } catch (err) {
          console.error('Error handling cancel:', err);
        }
      }
    };
    handleCancel();
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-600 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600">
          Your payment has been cancelled.
        </p>
      </div>
    </div>
  );
};