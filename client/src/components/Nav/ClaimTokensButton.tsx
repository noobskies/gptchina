import { useState, useEffect } from 'react';
import { Button } from '~/components/ui/Button';
import { Gift } from 'lucide-react';
import { useLocalize } from '~/hooks';
import { useClaimTokensMutation, useClaimStatusQuery, useGetUserBalance } from '~/data-provider';
import { QueryKeys } from 'librechat-data-provider';
import { useQueryClient } from '@tanstack/react-query';

const ClaimTokensButton = () => {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [canClaim, setCanClaim] = useState(true);
  const [nextClaimTime, setNextClaimTime] = useState<Date | null>(null);
  const localize = useLocalize();

  // Query to check if user can claim tokens
  const {
    data: claimStatus,
    refetch: refetchClaimStatus,
    isError,
    isLoading: isStatusLoading,
  } = useClaimStatusQuery({
    // If there's an error, assume the user can claim
    onError: () => setCanClaim(true),
    // Set a reasonable staleTime to avoid too many requests
    staleTime: 60000, // 1 minute
  });

  // Get query client for refetching balance
  const queryClient = useQueryClient();

  // Get balance query to refetch after claiming
  const { refetch: refetchBalance } = useGetUserBalance();

  // Mutation to claim tokens
  const { mutate: claimTokens, isLoading } = useClaimTokensMutation({
    onSuccess: (data) => {
      setCanClaim(false);
      setNextClaimTime(new Date(data.nextClaimTime));
      refetchClaimStatus();

      // Refetch balance to update the UI
      refetchBalance();

      // Invalidate balance query to ensure it's refreshed everywhere
      queryClient.invalidateQueries([QueryKeys.balance]);
    },
  });

  // Update claim status from query
  useEffect(() => {
    if (claimStatus) {
      setCanClaim(claimStatus.canClaim);
      if (!claimStatus.canClaim && claimStatus.nextClaimTime) {
        setNextClaimTime(new Date(claimStatus.nextClaimTime));
      }
    } else if (isError) {
      // If there's an error, assume the user can claim
      setCanClaim(true);
      setNextClaimTime(null);
    }
  }, [claimStatus, isError]);

  // Update countdown timer
  useEffect(() => {
    if (!nextClaimTime || canClaim) {
      setTimeRemaining(null);
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const timeDiff = nextClaimTime.getTime() - now.getTime();
      if (timeDiff <= 0) {
        setCanClaim(true);
        setTimeRemaining(null);
        return;
      }

      // Format the remaining time
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };

    // Update immediately and then every second
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextClaimTime, canClaim]);

  const handleClaim = () => {
    claimTokens();
  };

  return (
    <Button
      variant={canClaim ? 'submit' : 'outline'}
      className={`mb-2 flex w-full items-center justify-center ${
        canClaim ? 'bg-blue-600 hover:bg-blue-700' : ''
      }`}
      onClick={handleClaim}
      disabled={(!canClaim && !isError) || isLoading || isStatusLoading}
    >
      <Gift className="mr-2 h-4 w-4" />
      {canClaim
        ? localize('com_ui_claim_tokens')
        : timeRemaining
          ? `${localize('com_ui_claim_in')} ${timeRemaining}`
          : localize('com_ui_claim_tokens')}
    </Button>
  );
};

export default ClaimTokensButton;
