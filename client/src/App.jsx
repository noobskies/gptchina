import React, { useEffect } from 'react';
import { RouterProvider, useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import ReactGA from 'react-ga4';
import { RecoilRoot } from 'recoil';
import { DndProvider } from 'react-dnd';
import * as RadixToast from '@radix-ui/react-toast';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { ScreenshotProvider, ThemeProvider, useApiErrorBoundary } from './hooks';
import { ToastProvider } from './Providers';
import Toast from './components/ui/Toast';
import { LiveAnnouncer } from '~/a11y';
import { router } from './routes';
import { getDomainData } from './utils/domainUtils';

const { trackingCode } = getDomainData();

ReactGA.initialize(trackingCode);

const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send('pageview', { page_path: location.pathname });
  }, [location]);

  return null;
};

const DeepLinkHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      console.log('Native platform detected');
      Capacitor.App.addListener('appUrlOpen', (data) => {
        console.log('Deep link received', data.url);
        
        const url = new URL(data.url);
        const path = url.pathname;

        // Handle navigation based on the path
        switch (path) {
          case '/':
            // Handle root path, possibly check for query parameters
            const paymentStatus = url.searchParams.get('payment_status');
            if (paymentStatus === 'success') {
              console.log('Payment successful');
              // You can dispatch an action or update state here
            } else if (paymentStatus === 'cancel') {
              console.log('Payment cancelled');
              // Handle cancelled payment
            }
            navigate('/');
            break;
          // Add more cases for other deep link paths as needed
          default:
            // For any unhandled paths, navigate to the home page
            navigate('/');
        }
      });
    }
  }, [navigate]);

  return null;
};

const App = () => {
  const { setError } = useApiErrorBoundary();

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error?.response?.status === 401) {
          setError(error);
        }
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <LiveAnnouncer>
          <ThemeProvider>
            <RadixToast.Provider>
              <ToastProvider>
                <DndProvider backend={HTML5Backend}>
                  <div className="min-h-screen flex flex-col">
                    <RouterProvider router={router}>
                      <PageViewTracker />
                      <DeepLinkHandler />
                    </RouterProvider>
                    <ReactQueryDevtools initialIsOpen={false} position="top-right" />
                    <Toast />
                    <RadixToast.Viewport className="pointer-events-none fixed inset-0 z-[1000] mx-auto my-2 flex max-w-[560px] flex-col items-stretch justify-start md:pb-5" />
                  </div>
                </DndProvider>
              </ToastProvider>
            </RadixToast.Provider>
          </ThemeProvider>
        </LiveAnnouncer>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default () => (
  <ScreenshotProvider>
    <App />
  </ScreenshotProvider>
);