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
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

const { trackingCode } = getDomainData();

ReactGA.initialize(trackingCode);

const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send('pageview', { page_path: location.pathname });
  }, [location]);

  return null;
};

const configureStatusBar = async () => {
  if (Capacitor.getPlatform() === 'ios') {
    try {
      await StatusBar.setStyle({ style: Style.Dark }); // or Style.Light based on your app's theme
      await StatusBar.setOverlaysWebView({ overlay: true });
    } catch (error) {
      console.error('Error configuring StatusBar:', error);
    }
  }
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
    configureStatusBar();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <LiveAnnouncer>
          <ThemeProvider>
            <RadixToast.Provider>
              <ToastProvider>
                <DndProvider backend={HTML5Backend}>
                  <RouterProvider router={router}>
                    <PageViewTracker />
                  </RouterProvider>
                  <ReactQueryDevtools initialIsOpen={false} position="top-right" />
                  <Toast />
                  <RadixToast.Viewport className="pointer-events-none fixed inset-0 z-[1000] mx-auto my-2 flex max-w-[560px] flex-col items-stretch justify-start md:pb-5" />
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