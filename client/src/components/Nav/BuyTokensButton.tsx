// BuyTokensButton.tsx
import { useState } from 'react';
import { useLocalize } from '~/hooks';
// import ErrorDialog from '~/components/Messages/Content/ErrorDialog';
import { useGetUserBalance, useGetStartupConfig } from 'librechat-data-provider/react-query';
import { useAuthContext } from '~/hooks/AuthContext';
import numeral from 'numeral';

function BuyTokensButton({ fullWidth = true }) {
  const localize = useLocalize();
  const [showBuyTokens, setShowBuyTokens] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const balanceQuery = useGetUserBalance({
    enabled: !!isAuthenticated && startupConfig?.checkBalance,
  });

  function formatTokenCount(count) {
    let formatted = numeral(count).format(count >= 1000 ? '0.[0]a' : '0');
    formatted = formatted.toUpperCase();
    return formatted;
  }

  return (
    <>
      <button
        onClick={() => setShowBuyTokens(true)}
        className={`focus:bg-blue-650 mt-2 rounded bg-blue-600 p-2 text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-500 disabled:hover:bg-blue-500 dark:hover:bg-blue-700 ${
          fullWidth ? 'w-full' : 'w-auto'
        }`}
      >
        {localize('com_ui_buy_token')}
      </button>
      {/* {showBuyTokens && <ErrorDialog open={showBuyTokens} onOpenChange={setShowBuyTokens} />} */}
    </>
  );
}

export default BuyTokensButton;
