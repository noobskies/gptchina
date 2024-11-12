import { useTokenClaim, useCountdown } from '../../hooks/Balance/useCountdown';
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
      className={`focus:bg-blue-650 mt-2 flex items-center justify-center gap-2 rounded p-2 text-white transition-colors duration-200 focus:outline-none ${
        isLoading || !isAuthenticated || !!timeLeft || isCheckingStatus
          ? 'cursor-not-allowed bg-gray-400'
          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
      } ${fullWidth ? 'w-full' : 'w-auto'}`}
    >
      {buttonContent}
    </button>
  );
}

export default TokenClaimButton;
