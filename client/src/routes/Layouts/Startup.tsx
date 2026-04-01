import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import type { TStartupConfig } from 'librechat-data-provider';
import { TranslationKeys, useLocalize } from '~/hooks';
import { useGetStartupConfig } from '~/data-provider';
import AuthLayout from '~/components/Auth/AuthLayout';
// CUSTOM: GPT China - Split auth layout feature
// See: custom/features/split-auth-layout/README.md
import { SplitAuthLayout } from '~/../../custom/features/split-auth-layout/client';
import { REDIRECT_PARAM, SESSION_KEY } from '~/utils';

const headerMap: Record<string, TranslationKeys> = {
  '/login': 'com_auth_welcome_back',
  '/register': 'com_auth_create_account',
  '/forgot-password': 'com_auth_reset_password',
  '/reset-password': 'com_auth_reset_password',
  '/login/2fa': 'com_auth_verify_your_identity',
};

export default function StartupLayout({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const [error, setError] = useState<TranslationKeys | null>(null);
  const [headerText, setHeaderText] = useState<TranslationKeys | null>(null);
  const [startupConfig, setStartupConfig] = useState<TStartupConfig | null>(null);
  const {
    data,
    isFetching,
    error: startupConfigError,
  } = useGetStartupConfig({
    enabled: isAuthenticated ? startupConfig === null : true,
  });
  const localize = useLocalize();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const hasPendingRedirect =
        new URLSearchParams(window.location.search).has(REDIRECT_PARAM) ||
        sessionStorage.getItem(SESSION_KEY) != null;
      if (!hasPendingRedirect) {
        navigate('/c/new', { replace: true });
      }
    }
    if (data) {
      setStartupConfig(data);
    }
  }, [isAuthenticated, navigate, data]);

  useEffect(() => {
    document.title = startupConfig?.appTitle || 'GPT China';
  }, [startupConfig?.appTitle]);

  useEffect(() => {
    setError(null);
    setHeaderText(null);
  }, [location.pathname]);

  const contextValue = {
    error,
    setError,
    headerText,
    setHeaderText,
    startupConfigError,
    startupConfig,
    isFetching,
  };

  // CUSTOM: GPT China - Conditional layout selection for split design
  // Use SplitAuthLayout for main auth pages, AuthLayout for others
  const usesSplitLayout = ['/login', '/register', '/forgot-password', '/reset-password'].includes(
    location.pathname,
  );
  const Layout = usesSplitLayout ? SplitAuthLayout : AuthLayout;

  return (
    <Layout
      header={headerText ? localize(headerText) : localize(headerMap[location.pathname])}
      isFetching={isFetching}
      startupConfig={startupConfig}
      startupConfigError={startupConfigError}
      pathname={location.pathname}
      error={error}
    >
      <Outlet context={contextValue} />
    </Layout>
  );
}
