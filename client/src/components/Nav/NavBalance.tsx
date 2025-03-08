import { memo, useEffect } from 'react';
import { useGetUserBalance, useGetStartupConfig } from '~/data-provider';
import { useLocalize, useAuthContext } from '~/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from 'librechat-data-provider';

function NavBalance() {
  const localize = useLocalize();
  const { isAuthenticated } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const queryClient = useQueryClient();
  const balanceQuery = useGetUserBalance({
    enabled: !!isAuthenticated && startupConfig?.checkBalance,
  });

  // Refetch balance when component mounts or when balance query changes
  useEffect(() => {
    if (isAuthenticated && startupConfig?.checkBalance) {
      // Refetch balance
      balanceQuery.refetch();

      // Set up an interval to refetch the balance every 5 seconds
      const intervalId = setInterval(() => {
        balanceQuery.refetch();
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, startupConfig, balanceQuery]);

  if (
    !startupConfig?.checkBalance ||
    !balanceQuery.data ||
    !balanceQuery.data.balance ||
    isNaN(parseFloat(balanceQuery.data.balance))
  ) {
    return null;
  }

  // Format the balance to display in millions with one decimal place
  const formatBalance = (balance: string) => {
    const balanceNum = parseFloat(balance);
    const balanceInMillions = balanceNum / 1000000;
    return `${balanceInMillions.toFixed(1)}M`;
  };

  return (
    <div className="border-token-border-light mb-2 flex items-center justify-between rounded-md border bg-surface-primary px-3 py-2 text-sm text-text-primary">
      <span>{localize('token_remaining')}</span>
      <span className="font-medium">{formatBalance(balanceQuery.data.balance)}</span>
    </div>
  );
}

export default memo(NavBalance);
