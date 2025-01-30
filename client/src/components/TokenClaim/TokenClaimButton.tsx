import { useCountdown } from '../../hooks/Balance/useCountdown';
import { useTokenClaim } from '~/hooks/Balance/useTokenClaim';
import { Spinner } from '~/components/svg';

function TokenClaimButton({ fullWidth = true }) {
  const { isLoading, isCheckingStatus, nextClaimTime, claimTokens, isAuthenticated } =
    useTokenClaim();
  const timeLeft = useCountdown(nextClaimTime);

  const buttonContent =
    isCheckingStatus || isLoading ? (
      <Spinner className="h-4 w-4" />
    ) : timeLeft ? (
      `Claim in ${timeLeft}`
    ) : (
      'Claim 20,000 Tokens'
    );

  return (
    <button
      onClick={claimTokens}
      disabled={isLoading || !isAuthenticated || !!timeLeft || isCheckingStatus}
      className={`
        w-${fullWidth ? 'full' : 'auto'} mt-2 flex items-center justify-center gap-2 
        rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white
        transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2
        focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50
        disabled:hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700
        ${
          isLoading || !isAuthenticated || !!timeLeft || isCheckingStatus
            ? 'cursor-not-allowed !bg-gray-400'
            : 'active:bg-blue-800'
        }
      `}
    >
      {buttonContent}
    </button>
  );
}

export default TokenClaimButton;
