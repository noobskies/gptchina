import { useState, useEffect, useCallback } from 'react';
import { useGetUserBalance, useGetStartupConfig } from 'librechat-data-provider/react-query';
import { useAuthContext } from '~/hooks/AuthContext';
import { useToastContext } from '~/Providers';
import { useQueryClient } from '@tanstack/react-query';

export const useTokenClaim = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [nextClaimTime, setNextClaimTime] = useState<Date | null>(null);
  const { showToast } = useToastContext();
  const { isAuthenticated, token } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const queryClient = useQueryClient();
  const balanceQuery = useGetUserBalance({
    enabled: !!isAuthenticated && startupConfig?.checkBalance,
  });

  const refreshBalance = useCallback(async () => {
    await queryClient.invalidateQueries(['balance']);
    await balanceQuery.refetch();
  }, [queryClient, balanceQuery]);

  const scheduleNextCheck = useCallback(
    (nextTime: Date) => {
      const now = new Date();
      const timeUntilNext = nextTime.getTime() - now.getTime();

      if (timeUntilNext > 0) {
        const timer = setTimeout(() => {
          checkClaimStatus();
        }, timeUntilNext);
        return () => clearTimeout(timer);
      }
    },
    [
      /* checkClaimStatus will be added by useCallback */
    ],
  );

  const checkClaimStatus = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setIsCheckingStatus(false);
      return;
    }

    try {
      setIsCheckingStatus(true);
      const response = await fetch('/api/balance/claim-tokens', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.canClaim && data.nextClaimTime) {
        const nextTime = new Date(data.nextClaimTime);
        setNextClaimTime(nextTime);
        scheduleNextCheck(nextTime);
      } else {
        setNextClaimTime(null);
      }
    } catch (error) {
      console.error('Error checking claim status:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [token, isAuthenticated, scheduleNextCheck]);

  // Add checkClaimStatus to scheduleNextCheck dependencies
  useEffect(() => {
    const updatedScheduleNextCheck = scheduleNextCheck;
    scheduleNextCheck.bind(null, checkClaimStatus);
  }, [checkClaimStatus, scheduleNextCheck]);

  const claimTokens = async () => {
    if (!isAuthenticated || !token) {
      showToast({
        status: 'error',
        message: 'Please login to claim tokens',
      });
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
          const nextTime = new Date(data.nextClaimTime);
          setNextClaimTime(nextTime);
          scheduleNextCheck(nextTime);
          showToast({
            status: 'error',
            message: `Too early to claim tokens`,
          });
          return;
        }
        throw new Error(data.error || 'Failed to claim tokens');
      }

      if (data.success) {
        if (data.nextClaimTime) {
          const nextTime = new Date(data.nextClaimTime);
          setNextClaimTime(nextTime);
          scheduleNextCheck(nextTime);
        }

        await refreshBalance();

        showToast({
          status: 'success',
          message: "You've claimed 20,000 tokens!",
        });
      }
    } catch (error) {
      console.error('Error claiming tokens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cleanup = checkClaimStatus();
    return () => {
      cleanup && cleanup();
    };
  }, [checkClaimStatus]);

  return {
    isLoading,
    isCheckingStatus,
    nextClaimTime,
    claimTokens,
    isAuthenticated,
  };
};
