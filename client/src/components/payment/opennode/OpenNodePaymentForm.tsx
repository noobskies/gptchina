// src/components/payment/opennode/OpenNodePaymentForm.tsx
import React from 'react';
import { Bitcoin } from 'lucide-react';
import { useOpenNodePayment } from './hooks/useOpenNodePayment';

interface OpenNodePaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  onBack: () => void;
}

const OpenNodePaymentForm: React.FC<OpenNodePaymentFormProps> = ({
  amount,
  onSuccess,
  onError,
  onBack,
}) => {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
        <Bitcoin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
      </div>

      <div className="mb-4 text-center text-gray-600 dark:text-gray-400">
        Bitcoin payment functionality coming soon...
      </div>

      <div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            ${amount.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={onBack}
        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        Go Back
      </button>
    </div>
  );
};

export default OpenNodePaymentForm;
