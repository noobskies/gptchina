import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
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
import * as Sentry from '@sentry/react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';

// Initialize Sentry
Sentry.init({
  dsn: 'https://6e77bfde3b3ba578b2830947be88080f@o4507099226177536.ingest.us.sentry.io/4508207501672448',
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['https://novlisky.io'],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Your Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDWhSGdlqLHo8q99R41pZw-9gGZc2n_bqw',
  authDomain: 'globalgpt.firebaseapp.com',
  projectId: 'globalgpt',
  storageBucket: 'globalgpt.firebasestorage.app',
  messagingSenderId: '397122273433',
  appId: '1:397122273433:android:a2b58e130f4439cafa3808',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const FirebaseProvider = ({ children }) => {
  useEffect(() => {
    const setupFirebase = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          console.log('Setting up Firebase Authentication...');

          // Try to get current user state
          const result = await FirebaseAuthentication.getCurrentUser();
          console.log('Current auth state:', result);
        } catch (error) {
          console.error('Firebase setup error:', error);
          Sentry.captureException(error, {
            tags: {
              context: 'firebase_setup',
            },
          });
        }
      }
    };

    setupFirebase();
  }, []);

  return children;
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
    <Sentry.ErrorBoundary fallback={<div>An error has occurred</div>}>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <LiveAnnouncer>
            <ThemeProvider>
              <FirebaseProvider>
                <RadixToast.Provider>
                  <ToastProvider>
                    <DndProvider backend={HTML5Backend}>
                      <div className="flex min-h-screen flex-col">
                        <RouterProvider router={router} />
                        <ReactQueryDevtools initialIsOpen={false} position="top-right" />
                        <Toast />
                        <RadixToast.Viewport className="pointer-events-none fixed inset-0 z-[1000] mx-auto my-2 flex max-w-[560px] flex-col items-stretch justify-start md:pb-5" />
                      </div>
                    </DndProvider>
                  </ToastProvider>
                </RadixToast.Provider>
              </FirebaseProvider>
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
