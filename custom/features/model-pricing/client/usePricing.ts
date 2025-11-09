/**
 * CUSTOM: gptchina fork
 *
 * Feature: Model Pricing Display
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * React hook for fetching model pricing information.
 *
 * See: custom/features/model-pricing/README.md
 */

import { useState, useEffect } from 'react';

interface ModelPricing {
  prompt: number;
  completion: number;
}

interface PricingResponse {
  model: string;
  pricing: ModelPricing | null;
  unit?: string;
  message?: string;
}

interface UsePricingReturn {
  pricing: ModelPricing | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook to fetch pricing information for a specific model
 * @param modelName - The name of the model to fetch pricing for
 * @param endpoint - Optional endpoint name for context
 * @returns Object containing pricing data, loading state, and error
 */
export const usePricing = (
  modelName: string | undefined | null,
  endpoint?: string,
): UsePricingReturn => {
  const [pricing, setPricing] = useState<ModelPricing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state if no model name
    if (!modelName) {
      setPricing(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchPricing = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const queryParams = endpoint ? `?endpoint=${encodeURIComponent(endpoint)}` : '';
        const response = await fetch(
          `/api/custom/pricing/model/${encodeURIComponent(modelName)}${queryParams}`,
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch pricing: ${response.statusText}`);
        }

        const data: PricingResponse = await response.json();
        setPricing(data.pricing);
      } catch (err) {
        console.error('[Model Pricing] Error fetching pricing:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setPricing(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricing();
  }, [modelName, endpoint]);

  return { pricing, isLoading, error };
};

/**
 * Format pricing for display
 * @param pricing - The pricing object
 * @returns Formatted string like "Input: 2.00 | Output: 8.00"
 */
export const formatPricing = (pricing: ModelPricing | null): string => {
  if (!pricing) {
    return '';
  }

  const input = pricing.prompt.toFixed(2);
  const output = pricing.completion.toFixed(2);

  return `Input: ${input} | Output: ${output}`;
};
