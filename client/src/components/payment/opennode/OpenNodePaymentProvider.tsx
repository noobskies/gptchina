// opennode/OpenNodePaymentProvider.tsx
import React from 'react';

interface OpenNodePaymentProviderProps {
  children: React.ReactNode;
  onSuccess?: (chargeId: string) => void;
  onError?: (error: string) => void;
}

export const OpenNodePaymentProvider: React.FC<OpenNodePaymentProviderProps> = ({
  children,
  onSuccess,
  onError,
}) => {
  return <>{children}</>;
};
