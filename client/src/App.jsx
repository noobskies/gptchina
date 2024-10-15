import React, { useEffect } from 'react';
import { RouterProvider, useNavigate } from 'react-router-dom';
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
      CapacitorApp.addListener('appUrlOpen', (data) => {
        console.log('Deep link received', data.url);
        
        // Parse the URL
        const slug = data.url.split('https://novlisky.io/').pop();

        // Navigate based on the slug
        if (slug) {
          if (slug.includes('payment-success')) {
            navigate('/');
          } else if (slug.includes('payment-cancel')) {
            navigate('/');
          }
          // Add more conditions as needed
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