// src/components/payment/capacitor/hooks/useInAppPurchase.ts
export function useInAppPurchase() {
  const handlePurchase = async () => {
    // Implementation coming soon
    throw new Error('In-App Purchase not implemented yet');
  };

  return {
    handlePurchase,
    isLoading: false,
    error: null,
  };
}

export default useInAppPurchase;
