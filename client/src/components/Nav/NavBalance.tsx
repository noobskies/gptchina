import { memo } from 'react';
import { useGetUserBalance, useGetStartupConfig } from '~/data-provider';
import { useLocalize, useAuthContext } from '~/hooks';

function NavBalance() {
  const localize = useLocalize();
  const { isAuthenticated } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const balanceQuery = useGetUserBalance({
    enabled: !!isAuthenticated && startupConfig?.checkBalance,
  });

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
