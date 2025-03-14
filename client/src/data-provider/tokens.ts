import { useMutation, useQuery } from '@tanstack/react-query';
import { QueryKeys, request } from 'librechat-data-provider';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

export interface ClaimTokensResponse {
  message: string;
  transaction: any;
  nextClaimTime: string;
  canClaim: boolean;
}

export interface ClaimStatusResponse {
  nextClaimTime?: string;
  canClaim: boolean;
}

/**
 * Mutation hook for claiming tokens
 */
export const useClaimTokensMutation = (
  options?: any,
): UseMutationResult<ClaimTokensResponse, unknown, void, unknown> => {
  return useMutation(
    () => {
      // Create a custom endpoint for claiming tokens
      const endpoint = '/api/tokens/claim';
      return request.post(endpoint);
    },
    {
      ...(options || {}),
    },
  );
};

/**
 * Query hook for checking claim status
 */
export const useClaimStatusQuery = (
  options?: any,
): UseQueryResult<ClaimStatusResponse, unknown> => {
  return useQuery({
    queryKey: [QueryKeys.claimStatus],
    queryFn: () => {
      // Create a custom endpoint for checking claim status
      const endpoint = '/api/tokens/claim';
      return request.get(endpoint);
    },
    // Default to assuming user can claim if there's an error
    onError: () => {
      console.error('Error fetching claim status, defaulting to claimable');
      return { canClaim: true };
    },
    // Set reasonable defaults for better UX
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 30000, // 30 seconds
    ...(options || {}),
  });
};
