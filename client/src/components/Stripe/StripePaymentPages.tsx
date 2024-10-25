import { FC, useEffect } from 'react';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const StatusCard: FC<{
  icon: React.ReactNode;
  title: string;
  message: string;
  bgColor: string;
  iconColor: string;
}> = ({ icon, title, message, bgColor, iconColor }) => (
  <div className="w-full max-w-sm mx-auto">
    <div className={`p-6 ${bgColor} shadow-lg`}>
      <div className="flex flex-col items-center">
        <div className={`${iconColor} mb-4`}>
          {icon}
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          {title}
        </h1>
        <p className="text-white/90 text-center">
          {message}
        </p>
      </div>
    </div>
  </div>
);

export const StripeSuccessPage: FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const userId = searchParams.get('user_id');
    const priceId = searchParams.get('price_id');
    
    const handleSuccess = async (): Promise<void> => {
      try {
        if (Capacitor.isNativePlatform()) {
          // Allow time for animation and message to be seen
          setTimeout(async () => {
            await Browser.close();
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }, 2000);
        }
      } catch (err) {
        console.error('Error in success handler:', err);
      }
    };

    handleSuccess();
  }, [searchParams]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500/10 to-blue-500/5 p-4">
      <StatusCard
        icon={<CheckCircle size={64} strokeWidth={1.5} />}
        title="Payment Successful!"
        message="Thank you for your payment. Your transaction has been completed successfully."
        bgColor="bg-blue-500"
        iconColor="text-white"
      />
    </div>
  );
};

export const StripeCancelPage: FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const userId = searchParams.get('user_id');
    const priceId = searchParams.get('price_id');
    
    const handleCancel = async (): Promise<void> => {
      try {
        if (Capacitor.isNativePlatform()) {
          // Allow time for animation and message to be seen
          setTimeout(async () => {
            await Browser.close();
          }, 2000);
        }
      } catch (err) {
        console.error('Error in cancel handler:', err);
      }
    };

    handleCancel();
  }, [searchParams]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 p-4">
      <StatusCard
        icon={<XCircle size={64} strokeWidth={1.5} />}
        title="Payment Cancelled"
        message="Your payment has been cancelled. Please try again or contact support if you need assistance."
        bgColor="bg-gray-500"
        iconColor="text-white"
      />
    </div>
  );
};

export const StripeErrorPage: FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-500/10 to-red-500/5 p-4">
    <StatusCard
      icon={<AlertCircle size={64} strokeWidth={1.5} />}
      title="Payment Failed"
      message="We encountered an error processing your payment. Please try again or contact support."
      bgColor="bg-red-500"
      iconColor="text-white"
    />
  </div>
);