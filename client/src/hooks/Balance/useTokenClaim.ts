import { useState, useEffect, useCallback, useRef } from 'react';
import { useGetUserBalance, useGetStartupConfig } from 'librechat-data-provider/react-query';
import { useAuthContext } from '~/hooks/AuthContext';
import { useToastContext } from '~/Providers';
import { useQueryClient } from '@tanstack/react-query';

export const useTokenClaim = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [nextClaimTime, setNextClaimTime] = useState<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const { showToast } = useToastContext();
  const { isAuthenticated, token } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const queryClient = useQueryClient();
  const balanceQuery = useGetUserBalance({
    enabled: !!isAuthenticated && startupConfig?.checkBalance,
  });

  const checkClaimStatus = async () => {
    if (!token || !isAuthenticated) {
      setIsCheckingStatus(false);
      return;
    }

    try {
      setIsCheckingStatus(true);
      const response = await fetch('/api/balance/claim-tokens', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!data.canClaim && data.nextClaimTime) {
        setNextClaimTime(new Date(data.nextClaimTime));
      } else {
        setNextClaimTime(null);
      }
    } catch (error) {
      console.error('Error checking claim status:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const claimTokens = async () => {
    if (!isAuthenticated || !token) {
      showToast({ status: 'error', message: 'Please login to claim tokens' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/balance/claim-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.nextClaimTime) {
          setNextClaimTime(new Date(data.nextClaimTime));
          showToast({ status: 'error', message: `Too early to claim tokens` });
          return;
        }
        throw new Error(data.error || 'Failed to claim tokens');
      }

      if (data.success) {
        if (data.nextClaimTime) {
          setNextClaimTime(new Date(data.nextClaimTime));
        }
        await queryClient.invalidateQueries(['balance']);
        await balanceQuery.refetch();

        showToast({ status: 'success', message: "You've claimed 20,000 tokens!" });
      }
    } catch (error) {
      console.error('Error claiming tokens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkClaimStatus();
  }, [token, isAuthenticated]);

  return {
    isLoading,
    isCheckingStatus,
    nextClaimTime,
    claimTokens,
    isAuthenticated,
  };
};
