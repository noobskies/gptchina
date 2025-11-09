/**
 * CUSTOM: gptchina fork
 *
 * Feature: Claim Tokens
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * React Query hook for claiming tokens.
 */

import { useState, useEffect } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { request } from 'librechat-data-provider';
import type { ClaimTokensResponse, ClaimTokensStatus } from '../shared/types';

const CLAIM_TOKENS_ENDPOINT = '/api/custom/claim-tokens';
const CLAIM_STATUS_ENDPOINT = '/api/custom/claim-tokens/status';

/**
 * Fetch claim status from server using request (handles auth automatically)
 */
const fetchClaimStatus = async (): Promise<ClaimTokensStatus> => {
  return request.get(CLAIM_STATUS_ENDPOINT);
};

/**
 * Claim tokens from server using request (handles auth automatically)
 */
const claimTokens = async (): Promise<ClaimTokensResponse> => {
  return request.post(CLAIM_TOKENS_ENDPOINT);
};

/**
 * Format remaining time to human-readable string
 */
const formatRemainingTime = (ms: number): string => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);

  return `Claim in ${hours}h ${minutes}m ${seconds}s`;
};

/**
 * Hook for managing claim tokens functionality
 */
export const useClaimTokens = () => {
  const queryClient = useQueryClient();
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [formattedTime, setFormattedTime] = useState<string>('');

  // Query claim status
  const {
    data: claimStatus,
    isLoading: isLoadingStatus,
    refetch: refetchStatus,
  } = useQuery<ClaimTokensStatus>({
    queryKey: ['claimTokensStatus'],
    queryFn: fetchClaimStatus,
    refetchInterval: (data) => {
      // Refetch more frequently when close to cooldown expiry
      if (data && data.remainingTime > 0 && data.remainingTime < 5 * 60 * 1000) {
        return 10000; // 10 seconds
      }
      return 60000; // 1 minute
    },
  });

  // Mutation for claiming tokens
  const claimMutation = useMutation({
    mutationFn: claimTokens,
    onSuccess: (data) => {
      // Invalidate balance query to update displayed balance
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      // Refetch claim status
      refetchStatus();
    },
  });

  // Update countdown timer
  useEffect(() => {
    if (!claimStatus || claimStatus.canClaim) {
      setRemainingTime(0);
      setFormattedTime('');
      return;
    }

    // Initial remaining time from server
    setRemainingTime(claimStatus.remainingTime);

    // Update countdown every second
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = Math.max(0, prev - 1000);
        if (newTime === 0) {
          // Cooldown expired, refetch status
          refetchStatus();
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [claimStatus, refetchStatus]);

  // Update formatted time string
  useEffect(() => {
    if (remainingTime > 0) {
      setFormattedTime(formatRemainingTime(remainingTime));
    } else {
      setFormattedTime('');
    }
  }, [remainingTime]);

  return {
    canClaim: claimStatus?.canClaim ?? false,
    isLoading: isLoadingStatus || claimMutation.isLoading,
    isClaiming: claimMutation.isLoading,
    remainingTime,
    formattedTime,
    claimTokens: claimMutation.mutate,
    error: claimMutation.error,
    isSuccess: claimMutation.isSuccess,
  };
};
