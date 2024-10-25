import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import {
  Login,
  Registration,
  RequestPasswordReset,
  ResetPassword,
  VerifyEmail,
  ApiErrorWatcher,
} from '~/components/Auth';
import AiTokenBurnRates from '~/components/AiTokenBurnRates/AiTokenBurnRates';
import TermsOfService from '~/components/TermsOfService/TermsOfService';
import PrivacyPolicy from '~/components/PrivacyPolicy/PrivacyPolicy';
import { AuthContextProvider } from '~/hooks/AuthContext';
import DeepLinkHandler from '~/components/Tools/DeepLinkHandler';
import { StripeSuccessPage, StripeCancelPage } from '~/components/Stripe/StripePaymentPages';
import StartupLayout from './Layouts/Startup';
import LoginLayout from './Layouts/Login';
import dashboardRoutes from './Dashboard';
import ShareRoute from './ShareRoute';
import ChatRoute from './ChatRoute';
import Search from './Search';
import Root from './Root';

const AuthLayout = () => (
  <AuthContextProvider>
    <DeepLinkHandler />
    <Outlet />
    <ApiErrorWatcher />
  </AuthContextProvider>
);

export const router = createBrowserRouter([
  {
    path: 'share/:shareId',
    element: <ShareRoute />,
  },
  {
    path: '/',
    element: <StartupLayout />,
    children: [
      {
        path: 'register',
        element: <Registration />,
      },
      {
        path: 'forgot-password',
        element: <RequestPasswordReset />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: 'verify',
    element: <VerifyEmail />,
  },
  // Add these new routes at the root level
  {
    path: 'stripe-success',
    element: <StripeSuccessPage />,
  },
  {
    path: 'stripe-cancel',
    element: <StripeCancelPage />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/',
        element: <LoginLayout />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
        ],
      },
      dashboardRoutes,
      {
        path: '/',
        element: <Root />,
        children: [
          {
            index: true,
            element: <Navigate to="/c/new" replace={true} />,
          },
          {
            path: 'c/:conversationId?',
            element: <ChatRoute />,
          },
          {
            path: 'search',
            element: <Search />,
          },
        ],
      },
    ],
  },
  {
    path: 'terms-of-service',
    element: <TermsOfService />,
  },
  {
    path: 'privacy-policy',
    element: <PrivacyPolicy />,
  },
  {
    path: 'token-burn-rates',
    element: <AiTokenBurnRates />,
  },
]);