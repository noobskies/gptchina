import { RecoilRoot } from 'recoil';
import { DndProvider } from 'react-dnd';
import { RouterProvider } from 'react-router-dom';
import * as RadixToast from '@radix-ui/react-toast';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { StatusBar } from '@capacitor/status-bar';
import { useEffect } from 'react';
import { ScreenshotProvider, ThemeProvider, useApiErrorBoundary } from './hooks';
import { ToastProvider } from './Providers';
import Toast from './components/ui/Toast';
import { LiveAnnouncer } from '~/a11y';
import { router } from './routes';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://6e77bfde3b3ba578b2830947be88080f@o4507099226177536.ingest.us.sentry.io/4508207501672448',
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['https://novlisky.io'],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const App = () => {
  const { setError } = useApiErrorBoundary();

  useEffect(() => {
    const setupStatusBar = async () => {
      try {
        await StatusBar.setStyle({ style: StatusBar.Style.Dark });
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.show({ animation: StatusBar.Animation.None });
      } catch (error) {
        console.error('Status bar setup failed:', error);
      }
    };

    setupStatusBar();
  }, []);

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
    <Sentry.ErrorBoundary fallback={<div>An error has occurred</div>}>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <LiveAnnouncer>
            <ThemeProvider>
              <RadixToast.Provider>
                <ToastProvider>
                  <DndProvider backend={HTML5Backend}>
                    <div className="safe-area-top">
                      <RouterProvider router={router} />
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
    </Sentry.ErrorBoundary>
  );
};

export default () => (
  <ScreenshotProvider>
    <App />
  </ScreenshotProvider>
);
