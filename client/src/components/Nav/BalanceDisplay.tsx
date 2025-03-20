import { memo } from 'react';
import { useGetStartupConfig, useGetUserBalance } from '~/data-provider';
import { useAuthContext } from '~/hooks/AuthContext';
import { useLocalize } from '~/hooks';
import numeral from 'numeral';

const BalanceDisplay = () => {
  const localize = useLocalize();
  const { isAuthenticated } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const balanceQuery = useGetUserBalance({
    enabled: !!isAuthenticated && startupConfig?.checkBalance,
  });

  if (
    !startupConfig?.checkBalance ||
    balanceQuery.data == null ||
    isNaN(parseFloat(balanceQuery.data))
  ) {
    return null;
  }

  const balance = parseFloat(balanceQuery.data);
  const formattedBalance = numeral(balance).format('0.0a'); // Format like 8.5M
  const fullBalance = numeral(balance).format('0,0.00'); // Format like 8,500,000.00

  return (
    <div className="mb-2 text-left text-sm text-text-secondary">
      {localize('com_nav_balance')}: <span title={fullBalance}>{formattedBalance}</span>
    </div>
  );
};

export default memo(BalanceDisplay);
