import React from 'react';
import { useInAppPurchase } from './hooks/useInAppPurchase';

interface InAppPurchaseFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  onBack: () => void;
}

export default function InAppPurchaseForm({
  amount,
  onSuccess,
  onError,
  onBack,
}: InAppPurchaseFormProps) {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 text-center text-gray-600 dark:text-gray-400">
        In-App Purchase functionality coming soon...
      </div>
      <button
        onClick={onBack}
        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        Go Back
      </button>
    </div>
  );
}
