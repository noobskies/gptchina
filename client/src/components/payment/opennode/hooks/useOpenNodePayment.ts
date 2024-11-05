// src/components/payment/opennode/hooks/useOpenNodePayment.ts
interface UseOpenNodePaymentResult {
  handlePayment: () => Promise<void>;
  isProcessing: boolean;
  error: string | null;
}

export function useOpenNodePayment(): UseOpenNodePaymentResult {
  const handlePayment = async () => {
    // Implementation coming soon
    throw new Error('OpenNode payment not implemented yet');
  };

  return {
    handlePayment,
    isProcessing: false,
    error: null,
  };
}

export default useOpenNodePayment;
