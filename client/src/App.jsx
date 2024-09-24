import React, { useEffect } from 'react';
import { RouterProvider, useLocation } from 'react-router-dom';
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
import { Capacitor } from '@capacitor/core';

const { trackingCode, serverDomain } = getDomainData();

ReactGA.initialize(trackingCode);

const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send('pageview', { page_path: location.pathname });
  }, [location]);

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

  useEffect(() => {
    // Check if running on a mobile device
    if (Capacitor.isNativePlatform()) {
      // Dynamically import @capacitor/app
      import('@capacitor/app').then(({ App: CapApp }) => {
        // Add event listener for deep links
        const handler = CapApp.addListener('appUrlOpen', (event) => {
          const url = new URL(event.url);
          if (url.pathname === '/oauth/callback') {
            const code = url.searchParams.get('code');

            // Send the authorization code to your backend
            fetch(`${serverDomain}/oauth/callback?code=${code}`, {
              method: 'GET',
              credentials: 'include',
            })
              .then((response) => {
                if (response.ok) {
                  // Authentication successful
                  // You may want to redirect the user or update the app state
                  window.location.href = '/';
                } else {
                  // Handle errors from the backend
                  return response.json().then((errorData) => {
                    console.error('Authentication error:', errorData);
                  });
                }
              })
              .catch((error) => {
                console.error('Authentication error:', error);
              });
          }
        });

        // Clean up the event listener when the component unmounts
        return () => {
          if (handler && handler.remove) {
            handler.remove();
          }
        };
      });
    }
  }, []);

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
