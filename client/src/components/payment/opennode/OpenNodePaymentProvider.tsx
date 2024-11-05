// src/components/payment/opennode/OpenNodePaymentProvider.tsx
import React, { createContext, useContext } from 'react';

interface OpenNodeContextType {
  isReady: boolean;
  error: string | null;
}

const OpenNodeContext = createContext<OpenNodeContextType>({
  isReady: false,
  error: null,
});

export const useOpenNode = () => useContext(OpenNodeContext);

interface OpenNodeProviderProps {
  children: React.ReactNode;
}

export const OpenNodePaymentProvider: React.FC<OpenNodeProviderProps> = ({ children }) => {
  return (
    <OpenNodeContext.Provider value={{ isReady: false, error: null }}>
      {children}
    </OpenNodeContext.Provider>
  );
};

export default OpenNodePaymentProvider;
