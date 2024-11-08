import { useState, useEffect } from 'react';
import { useGetUserBalance, useGetStartupConfig } from 'librechat-data-provider/react-query';
import { useAuthContext } from '~/hooks/AuthContext';
import { useToastContext } from '~/Providers';

function TokenClaimButton({ fullWidth = true }) {
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const { showToast } = useToastContext();
  const { isAuthenticated, token } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const balanceQuery = useGetUserBalance({
    enabled: !!isAuthenticated && startupConfig?.checkBalance,
  });

  useEffect(() => {
    const checkClaimStatus = async () => {
      if (!token || !isAuthenticated) return;

      try {
        const response = await fetch('/api/balance/claim-tokens', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log(data);

        if (!data.canClaim && data.nextClaimTime) {
          updateCountdown(new Date(data.nextClaimTime));
        } else {
          setTimeLeft(null);
        }
      } catch (error) {
        console.error('Error checking claim status:', error);
      }
    };

    const updateCountdown = (nextClaimTime: Date) => {
      const update = () => {
        const now = new Date();
        const diff = nextClaimTime.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeLeft(null);
          return false;
        }

        // Format as HH:MM:SS
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

      // Initial update
      if (update()) {
        // Only set interval if there's time remaining
        const interval = setInterval(() => {
          if (!update()) {
            clearInterval(interval);
            checkClaimStatus(); // Recheck status when countdown ends
          }
        }, 1000);
        return () => clearInterval(interval);
      }
    };

    checkClaimStatus();
    const statusInterval = setInterval(checkClaimStatus, 60000); // Check every minute
    return () => clearInterval(statusInterval);
  }, [token, isAuthenticated]);

  const handleClaim = async () => {
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
          const nextClaim = new Date(data.nextClaimTime);
          const now = new Date();
          const diff = nextClaim.getTime() - now.getTime();
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
              .toString()
              .padStart(2, '0')}`,
          );

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
          const nextClaim = new Date(data.nextClaimTime);
          const now = new Date();
          const diff = nextClaim.getTime() - now.getTime();
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
              .toString()
              .padStart(2, '0')}`,
          );
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

  const buttonText = isLoading
    ? 'Claiming...'
    : timeLeft
    ? `Claim in ${timeLeft}`
    : 'Claim 20,000 Tokens';

  return (
    <button
      onClick={handleClaim}
      disabled={isLoading || !isAuthenticated || !!timeLeft}
      className={`focus:bg-blue-650 mt-2 rounded p-2 text-white transition-colors duration-200 focus:outline-none ${
        isLoading || !isAuthenticated || !!timeLeft
          ? 'cursor-not-allowed bg-gray-400'
          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
      } ${fullWidth ? 'w-full' : 'w-auto'}`}
    >
      {buttonText}
    </button>
  );
}

export default TokenClaimButton;
