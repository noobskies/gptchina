import React, { useEffect } from 'react';
import { RouterProvider, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { RecoilRoot } from 'recoil';
import { DndProvider } from 'react-dnd';
import * as RadixToast from '@radix-ui/react-toast';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { Plugins } from '@capacitor/core';
import { ScreenshotProvider, ThemeProvider, useApiErrorBoundary } from './hooks';
import { ToastProvider } from './Providers';
import Toast from './components/ui/Toast';
import { router } from './routes';
import { getDomainData } from './utils/domainUtils';

const { SafeArea, StatusBar } = Plugins;
const { trackingCode } = getDomainData();

// Initialize GA4 with the tracking code
ReactGA.initialize(trackingCode);

const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send('pageview', {
      page_path: location.pathname,
    });
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
    // Set up safe area listener
    SafeArea.addListener('safeAreaChanged', ({ insets }) => {
      document.documentElement.style.setProperty('--safe-area-top', `${insets.top}px`);
      document.documentElement.style.setProperty('--safe-area-bottom', `${insets.bottom}px`);
      document.documentElement.style.setProperty('--safe-area-left', `${insets.left}px`);
      document.documentElement.style.setProperty('--safe-area-right', `${insets.right}px`);
    });

    // Set status bar to overlay web view
    StatusBar.setOverlaysWebView({ overlay: true });

    // Clean up listener on component unmount
    return () => {
      SafeArea.removeAllListeners();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
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
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default () => (
  <ScreenshotProvider>
    <App />
  </ScreenshotProvider>
);
