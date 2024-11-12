// hooks/Balance/useCountdown.ts
import { useState, useEffect } from 'react';

export const useCountdown = (targetDate: Date | null) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft(null);
        return false;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
          .toString()
          .padStart(2, '0')}`,
      );
      return true;
    };

    if (calculateTimeLeft()) {
      const interval = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(interval);
    }
  }, [targetDate]);

  return timeLeft;
};

// hooks/Balance/useTokenClaim.ts
import { useState, useEffect, useCallback } from 'react';
import { useGetUserBalance, useGetStartupConfig } from 'librechat-data-provider/react-query';
import { useAuthContext } from '~/hooks/AuthContext';
import { useToastContext } from '~/Providers';

export const useTokenClaim = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [nextClaimTime, setNextClaimTime] = useState<Date | null>(null);
  const { showToast } = useToastContext();
  const { isAuthenticated, token } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const balanceQuery = useGetUserBalance({
    enabled: !!isAuthenticated && startupConfig?.checkBalance,
  });

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
      console.log(data);

      if (!data.canClaim && data.nextClaimTime) {
        setNextClaimTime(new Date(data.nextClaimTime));
      } else {
        setNextClaimTime(null);
      }
    } catch (error) {
      console.error('Error checking claim status:', error);
      showToast({
        status: 'error',
        message: 'Error checking claim status',
      });
    } finally {
      setIsCheckingStatus(false);
    }
  }, [token, isAuthenticated, showToast]);

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
        if (response.status === 401) {
          showToast({
            status: 'error',
            message: 'Session expired. Please login again.',
          });
          return;
        }

        if (response.status === 400 && data.nextClaimTime) {
          setNextClaimTime(new Date(data.nextClaimTime));
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
          setNextClaimTime(new Date(data.nextClaimTime));
        }

        await balanceQuery.refetch();

        showToast({
          status: 'success',
          message: "You've claimed 20,000 tokens!",
        });
      }
    } catch (error) {
      console.error('Error claiming tokens:', error);
      showToast({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to claim tokens. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkClaimStatus();
    const interval = setInterval(checkClaimStatus, 60000);
    return () => clearInterval(interval);
  }, [checkClaimStatus]);

  return {
    isLoading,
    isCheckingStatus,
    nextClaimTime,
    claimTokens,
    isAuthenticated,
  };
};
