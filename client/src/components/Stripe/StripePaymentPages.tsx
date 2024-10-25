import { FC, useEffect } from 'react';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { useSearchParams } from 'react-router-dom';

export const StripeSuccessPage: FC = () => {
  const [searchParams] = useSearchParams();
  console.log('StripeSuccessPage mounted');

  useEffect(() => {
    console.log('StripeSuccessPage useEffect triggered');
    
    const userId = searchParams.get('user_id');
    const priceId = searchParams.get('price_id');
    console.log('Success URL params:', { userId, priceId });

    const handleSuccess = async (): Promise<void> => {
      try {
        console.log('Processing success...');
        alert('Payment successful! Closing browser...');
        
        if (Capacitor.isNativePlatform()) {
          await Browser.close();
          console.log('Browser closed');
          
          setTimeout(() => {
            console.log('Reloading page...');
            window.location.reload();
          }, 500);
        }
      } catch (err) {
        console.error('Error in success handler:', err);
        alert(`Error processing success: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    handleSuccess();
  }, [searchParams]);
  
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

export const StripeCancelPage: FC = () => {
  const [searchParams] = useSearchParams();
  console.log('StripeCancelPage mounted');

  useEffect(() => {
    console.log('StripeCancelPage useEffect triggered');
    
    const userId = searchParams.get('user_id');
    const priceId = searchParams.get('price_id');
    console.log('Cancel URL params:', { userId, priceId });

    const handleCancel = async (): Promise<void> => {
      try {
        console.log('Processing cancellation...');
        alert('Payment cancelled. Closing browser...');
        
        if (Capacitor.isNativePlatform()) {
          await Browser.close();
          console.log('Browser closed');
        }
      } catch (err) {
        console.error('Error in cancel handler:', err);
        alert(`Error processing cancellation: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    handleCancel();
  }, [searchParams]);
  
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