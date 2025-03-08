import { memo, useState, useRef, useEffect } from 'react';
import { useGetUserBalance, useGetStartupConfig, useClaimTokensMutation } from '~/data-provider';
import { useLocalize, useAuthContext } from '~/hooks';
import BuyTokensModal from './BuyTokensModal';

// Cooldown period in hours (must match the backend)
const COOLDOWN_HOURS = 24;

function TokenActions() {
  const localize = useLocalize();
  const { isAuthenticated } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const balanceQuery = useGetUserBalance({
    enabled: !!isAuthenticated && startupConfig?.checkBalance,
  });
  const [buyTokensModalOpen, setBuyTokensModalOpen] = useState(false);
  const buyTokensButtonRef = useRef<HTMLButtonElement>(null);

  // Cooldown state
  const [inCooldown, setInCooldown] = useState(false);
  const [nextClaimTime, setNextClaimTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Format the balance to display in millions with one decimal place
  const formatBalance = (balance: string) => {
    if (!balance || isNaN(parseFloat(balance))) {return '0.0M';}
    const balanceNum = parseFloat(balance);
    const balanceInMillions = balanceNum / 1000000;
    return `${balanceInMillions.toFixed(1)}M`;
  };

  // Format the time remaining
  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) {
      setInCooldown(false);
      return '';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check for cooldown on component mount or when balance data changes
  useEffect(() => {
    if (!balanceQuery.data || !balanceQuery.data.lastTokenClaim) {return;}

    const lastClaimTime = new Date(balanceQuery.data.lastTokenClaim);
    const now = new Date();
    const hoursSinceLastClaim = (now.getTime() - lastClaimTime.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastClaim < COOLDOWN_HOURS) {
      const secondsRemaining = Math.ceil((COOLDOWN_HOURS - hoursSinceLastClaim) * 60 * 60);
      const nextClaimTime = new Date(lastClaimTime.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000);

      setInCooldown(true);
      setNextClaimTime(nextClaimTime);
      setTimeRemaining(formatTimeRemaining(secondsRemaining));
    }
  }, [balanceQuery.data]);

  // Update the countdown timer
  useEffect(() => {
    if (!inCooldown || !nextClaimTime) {return;}

    const updateCountdown = () => {
      const now = new Date();
      const secondsRemaining = Math.max(
        0,
        Math.floor((nextClaimTime.getTime() - now.getTime()) / 1000),
      );

      setTimeRemaining(formatTimeRemaining(secondsRemaining));

      if (secondsRemaining <= 0) {
        setInCooldown(false);
        setNextClaimTime(null);
      }
    };

    // Update immediately
    updateCountdown();

    // Then update every second
    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [inCooldown, nextClaimTime]);

  // Use the claim tokens mutation
  const claimTokensMutation = useClaimTokensMutation();

  // Handle claiming tokens
  const handleClaimTokens = () => {
    claimTokensMutation.mutate(undefined, {
      onSuccess: (data) => {
        console.log('Tokens claimed successfully:', data.message);

        // Handle cooldown
        if (data.cooldown && data.nextClaimTime) {
          setInCooldown(true);
          setNextClaimTime(new Date(data.nextClaimTime));
        }
      },
      onError: (error: any) => {
        console.error('Error claiming tokens:', error);

        // Handle cooldown error
        if (error.response?.status === 429) {
          const data = error.response.data;
          if (data.cooldown && data.nextClaimTime) {
            setInCooldown(true);
            setNextClaimTime(new Date(data.nextClaimTime));
          }
        }
      },
    });
  };

  const handleBuyTokens = () => {
    setBuyTokensModalOpen(true);
  };

  const showBalance =
    startupConfig?.checkBalance === true &&
    balanceQuery.data != null &&
    balanceQuery.data.balance != null &&
    !isNaN(parseFloat(balanceQuery.data.balance));

  return (
    <div className="mb-2 flex flex-col gap-2">
      <button
        onClick={handleClaimTokens}
        disabled={claimTokensMutation.isLoading || inCooldown}
        className="border-token-border-light flex w-full items-center justify-center rounded-md border bg-surface-primary px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {claimTokensMutation.isLoading
          ? localize('token_claiming')
          : inCooldown
            ? localize('token_next_claim', { time: timeRemaining })
            : localize('token_claim_button')}
      </button>

      {showBalance && (
        <div className="border-token-border-light flex items-center justify-between rounded-md border bg-surface-primary px-3 py-2 text-sm text-text-primary">
          <span>{localize('token_remaining')}</span>
          <span className="font-medium">{formatBalance(balanceQuery.data.balance)}</span>
        </div>
      )}

      <button
        ref={buyTokensButtonRef}
        onClick={handleBuyTokens}
        className="border-token-border-light flex w-full items-center justify-center rounded-md border bg-surface-primary px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary"
      >
        {localize('token_buy')}
      </button>

      <BuyTokensModal
        open={buyTokensModalOpen}
        onOpenChange={setBuyTokensModalOpen}
        triggerRef={buyTokensButtonRef}
      />
    </div>
  );
}

export default memo(TokenActions);
