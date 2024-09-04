import { useEffect, useState, createContext, useContext } from 'react';
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
import { Plugins } from '@capacitor/core';

const { SafeArea } = Plugins;

const { trackingCode } = getDomainData();

ReactGA.initialize(trackingCode);

const SafeAreaContext = createContext({ top: 30, bottom: 0, left: 0, right: 0 });

export const useSafeArea = () => useContext(SafeAreaContext);

const SafeAreaProvider = ({ children }) => {
  const [insets, setInsets] = useState({ top: 30, bottom: 0, left: 0, right: 0 });

  useEffect(() => {
    SafeArea.getSafeAreaInsets().then((result) => {
      setInsets(result);
    });

    const listener = SafeArea.addListener('safeAreaChanged', (result) => {
      setInsets(result.insets);
    });

    return () => {
      listener.remove();
    };
  }, []);

  return (
    <SafeAreaContext.Provider value={insets}>
      <div style={{
        paddingTop: `${insets.top}px`,
        paddingBottom: `${insets.bottom}px`,
        paddingLeft: `${insets.left}px`,
        paddingRight: `${insets.right}px`,
      }}>
        {children}
      </div>
    </SafeAreaContext.Provider>
  );
};

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

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <LiveAnnouncer>
          <ThemeProvider>
            <RadixToast.Provider>
              <ToastProvider>
                <DndProvider backend={HTML5Backend}>
                  <SafeAreaProvider>
                    <RouterProvider router={router}>
                      <PageViewTracker />
                    </RouterProvider>
                    <ReactQueryDevtools initialIsOpen={false} position="top-right" />
                    <Toast />
                    <RadixToast.Viewport className="pointer-events-none fixed inset-0 z-[1000] mx-auto my-2 flex max-w-[560px] flex-col items-stretch justify-start md:pb-5" />
                  </SafeAreaProvider>
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