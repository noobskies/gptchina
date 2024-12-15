import { useRecoilState } from 'recoil';
import * as Select from '@ariakit/react/select';
import { Fragment, useState, memo } from 'react';
import { FileText, LogOut } from 'lucide-react';
import { useGetUserBalance, useGetStartupConfig } from 'librechat-data-provider/react-query';
import { LinkIcon, GearIcon, DropdownMenuSeparator } from '~/components';
import FilesView from '~/components/Chat/Input/Files/FilesView';
import { useAuthContext } from '~/hooks/AuthContext';
import useAvatar from '~/hooks/Messages/useAvatar';
import { UserIcon } from '~/components/svg';
import { useLocalize } from '~/hooks';
import Settings from './Settings';
import store from '~/store';
import FeedbackDialog, { handleSentryFeedback } from './FeedbackDialog';
import PaymentDialog from '~/components/payment/common/PaymentDialog';
import TokenClaimButton from '../TokenClaim/TokenClaimButton';

function AccountSettings() {
  const localize = useLocalize();
  const { user, isAuthenticated, logout } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const balanceQuery = useGetUserBalance({
    enabled: !!isAuthenticated && startupConfig?.checkBalance,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showFiles, setShowFiles] = useRecoilState(store.showFiles);
  const [showPayment, setShowPayment] = useState(false);

  const avatarSrc = useAvatar(user);
  const name = user?.avatar ?? user?.username ?? '';

  const formatTokens = (num) => {
    const n = parseFloat(num);
    if (isNaN(n)) return '0';

    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
    return n.toFixed(1);
  };

  return (
    <>
      <div className="m-1 ml-3">
        <TokenClaimButton />
      </div>
      {startupConfig?.checkBalance === true &&
        balanceQuery.data != null &&
        !isNaN(parseFloat(balanceQuery.data)) && (
          <>
            <div className="m-1 ml-3 flex flex-col items-start whitespace-nowrap">
              <div className="flex items-center text-sm text-gray-800 dark:text-gray-200">
                {`Tokens Remaining: ${formatTokens(balanceQuery.data)}`}
              </div>
              <a href="/token-burn-rates" target="_blank" className="text-xs text-blue-600">
                Learn More 🔥
              </a>
              <DropdownMenuSeparator />
            </div>
          </>
        )}
      <div className="m-1 ml-3">
        <button
          onClick={() => setShowPayment(true)}
          data-payment-trigger
          className="focus:bg-blue-650 w-full rounded bg-blue-600 p-2 text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-500 disabled:hover:bg-blue-500 dark:hover:bg-blue-700"
        >
          {localize('com_ui_buy_token')}
        </button>
      </div>
      <Select.SelectProvider>
        <Select.Select
          aria-label={localize('com_nav_account_settings')}
          data-testid="nav-user"
          className="mt-text-sm flex h-auto w-full items-center gap-2 rounded-xl p-2 text-sm transition-all duration-200 ease-in-out hover:bg-accent"
        >
          <div className="-ml-0.9 -mt-0.8 h-8 w-8 flex-shrink-0">
            <div className="relative flex">
              {name.length === 0 ? (
                <div
                  style={{
                    backgroundColor: 'rgb(121, 137, 255)',
                    width: '32px',
                    height: '32px',
                    boxShadow: 'rgba(240, 246, 252, 0.1) 0px 0px 0px 1px',
                  }}
                  className="relative flex items-center justify-center rounded-full p-1 text-text-primary"
                  aria-hidden="true"
                >
                  <UserIcon />
                </div>
              ) : (
                <img
                  className="rounded-full"
                  src={(user?.avatar ?? '') || avatarSrc}
                  alt={`${name}'s avatar`}
                />
              )}
            </div>
          </div>
          <div
            className="mt-2 grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-text-primary"
            style={{ marginTop: '0', marginLeft: '0' }}
          >
            {user?.name ?? user?.username ?? localize('com_nav_user')}
          </div>
        </Select.Select>
        <Select.SelectPopover
          className="popover-ui w-[235px]"
          style={{
            transformOrigin: 'bottom',
            marginRight: '0px',
            translate: '0px',
          }}
        >
          <div className="text-token-text-secondary ml-3 mr-2 py-2 text-sm" role="note">
            {user?.email ?? localize('com_nav_user')}
          </div>
          <DropdownMenuSeparator />
          {startupConfig?.checkBalance === true &&
            balanceQuery.data != null &&
            !isNaN(parseFloat(balanceQuery.data)) && (
              <>
                <div className="text-token-text-secondary ml-3 mr-2 py-2 text-sm" role="note">
                  {`Balance: ${new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(parseFloat(balanceQuery.data))}`}
                </div>
                <DropdownMenuSeparator />
              </>
            )}
          <Select.SelectItem
            value=""
            onClick={() => setShowFiles(true)}
            className="select-item text-sm"
          >
            <FileText className="icon-md" aria-hidden="true" />
            {localize('com_nav_my_files')}
          </Select.SelectItem>
          {/* {startupConfig?.helpAndFaqURL !== '/' && (
            <Select.SelectItem
              value=""
              onClick={() => window.open(startupConfig?.helpAndFaqURL, '_blank')}
              className="select-item text-sm"
            >
              <LinkIcon aria-hidden="true" />
              {localize('com_nav_help_faq')}
            </Select.SelectItem>
          )} */}
          <Select.SelectItem
            value=""
            onClick={() => setShowSettings(true)}
            className="select-item text-sm"
          >
            <GearIcon className="icon-md" aria-hidden="true" />
            {localize('com_nav_settings')}
          </Select.SelectItem>
          <Select.SelectItem
            value=""
            onClick={() => handleSentryFeedback(user)}
            className="select-item text-sm"
          >
            <FeedbackDialog user={user} />
          </Select.SelectItem>
          <DropdownMenuSeparator />
          <Select.SelectItem
            aria-selected={true}
            onClick={() => logout()}
            value="logout"
            className="select-item text-sm"
          >
            <LogOut className="icon-md" />
            {localize('com_nav_log_out')}
          </Select.SelectItem>
        </Select.SelectPopover>
      </Select.SelectProvider>

      {/* Payment Dialog Modal */}
      {showPayment && <PaymentDialog open={showPayment} onOpenChange={setShowPayment} />}

      {showFiles && <FilesView open={showFiles} onOpenChange={setShowFiles} />}
      {showSettings && <Settings open={showSettings} onOpenChange={setShowSettings} />}
    </>
  );
}

export default memo(AccountSettings);
