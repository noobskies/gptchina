import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useGetStartupConfig } from 'librechat-data-provider/react-query';
import { useUserTermsQuery } from '~/data-provider';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

import type { ContextType } from '~/common';
import { AgentsMapContext, AssistantsMapContext, FileMapContext, SearchContext } from '~/Providers';
import { useAuthContext, useAssistantsMap, useAgentsMap, useFileMap, useSearch } from '~/hooks';
import { Nav, MobileNav } from '~/components/Nav';
import TermsAndConditionsModal from '~/components/ui/TermsAndConditionsModal';
import { Banner } from '~/components/Banners';

const API_URL = 'http://192.168.0.167:3090';

export default function Root() {
  const { isAuthenticated, logout, token } = useAuthContext();
  const navigate = useNavigate();
  const [navVisible, setNavVisible] = useState(() => {
    const savedNavVisible = localStorage.getItem('navVisible');
    return savedNavVisible !== null ? JSON.parse(savedNavVisible) : true;
  });
  const [bannerHeight, setBannerHeight] = useState(0);

  const search = useSearch({ isAuthenticated });
  const fileMap = useFileMap({ isAuthenticated });
  const assistantsMap = useAssistantsMap({ isAuthenticated });
  const agentsMap = useAgentsMap({ isAuthenticated });

  const [showTerms, setShowTerms] = useState(false);
  const { data: config } = useGetStartupConfig();
  const { data: termsData } = useUserTermsQuery({
    enabled: isAuthenticated && config?.interface?.termsOfService?.modalAcceptance === true,
  });

  // Push Notification Setup
  useEffect(() => {
    const setupPushNotifications = async () => {
      if (!isAuthenticated || !Capacitor.isNativePlatform() || !token) {
        console.log('Push notifications setup skipped:', {
          isAuthenticated,
          isNativePlatform: Capacitor.isNativePlatform(),
          hasToken: !!token,
        });
        return;
      }

      try {
        // Create notification channel first (Android only)
        if (Capacitor.getPlatform() === 'android') {
          console.log('Creating Android notification channel...');
          await PushNotifications.createChannel({
            id: 'token_claims',
            name: 'Token Claims',
            description: 'Notifications for token claims',
            importance: 5,
            visibility: 1,
            sound: 'default',
            lights: true,
            vibration: true,
          });
          console.log('Notification channel created');
        }

        console.log('Requesting push notification permissions...');
        const permStatus = await PushNotifications.requestPermissions();
        console.log('Permission status:', permStatus);

        if (permStatus.receive === 'granted') {
          console.log('Permission granted, registering...');
          await PushNotifications.register();
          console.log('Registration complete');
        } else {
          console.log('Permission denied');
        }
      } catch (err) {
        console.error('Error in setupPushNotifications:', err);
      }
    };

    // Only set up listeners if we're on a native platform and have auth token
    if (Capacitor.isNativePlatform() && token) {
      console.log('Setting up push notification listeners on native platform');

      PushNotifications.addListener('registration', async (fcmToken) => {
        console.log('Registration token received:', fcmToken.value);
        try {
          console.log('Sending token to backend with auth token:', token);
          const response = await fetch(`${API_URL}/api/device/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              token: fcmToken.value,
              platform: Capacitor.getPlatform() === 'ios' ? 'ios' : 'android',
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to register device:', {
              status: response.status,
              statusText: response.statusText,
              error: errorText,
            });
            return;
          }

          const data = await response.json();
          console.log('Device registration successful:', data);
        } catch (err) {
          console.error('Error sending token to backend:', {
            error: err,
            errorMessage: err.message,
            stack: err.stack,
          });
        }
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error:', {
          error,
          message: error.message,
          stack: error.stack,
        });
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', {
          title: notification.title,
          body: notification.body,
          data: notification.data,
        });
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed:', {
          title: notification.notification.title,
          body: notification.notification.body,
          data: notification.notification.data,
          actionId: notification.actionId,
        });
      });

      console.log('Starting push notification setup...');
      setupPushNotifications();

      return () => {
        console.log('Cleaning up push notification listeners');
        PushNotifications.removeAllListeners();
      };
    } else {
      console.log('Skipping push notification setup:', {
        isNativePlatform: Capacitor.isNativePlatform(),
        hasToken: !!token,
      });
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (termsData) {
      setShowTerms(!termsData.termsAccepted);
    }
  }, [termsData]);

  const handleAcceptTerms = () => {
    setShowTerms(false);
  };

  const handleDeclineTerms = () => {
    setShowTerms(false);
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SearchContext.Provider value={search}>
      <FileMapContext.Provider value={fileMap}>
        <AssistantsMapContext.Provider value={assistantsMap}>
          <AgentsMapContext.Provider value={agentsMap}>
            <Banner onHeightChange={setBannerHeight} />
            <div
              className="flex bg-surface-primary text-text-primary"
              style={{
                height: `calc(100dvh - ${bannerHeight}px)`,
                paddingTop: 'env(safe-area-inset-top, 0px)',
              }}
            >
              <div className="relative z-0 flex h-full w-full overflow-hidden">
                <Nav navVisible={navVisible} setNavVisible={setNavVisible} />
                <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">
                  <MobileNav setNavVisible={setNavVisible} />
                  <Outlet context={{ navVisible, setNavVisible } satisfies ContextType} />
                </div>
              </div>
            </div>
          </AgentsMapContext.Provider>
          {config?.interface?.termsOfService?.modalAcceptance === true && (
            <TermsAndConditionsModal
              open={showTerms}
              onOpenChange={setShowTerms}
              onAccept={handleAcceptTerms}
              onDecline={handleDeclineTerms}
              title={config.interface.termsOfService.modalTitle}
              modalContent={config.interface.termsOfService.modalContent}
              className="bg-surface-primary text-text-primary"
            />
          )}
        </AssistantsMapContext.Provider>
      </FileMapContext.Provider>
    </SearchContext.Provider>
  );
}
