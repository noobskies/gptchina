import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useGetStartupConfig } from 'librechat-data-provider/react-query';
import { useUserTermsQuery } from '~/data-provider';

import type { ContextType } from '~/common';
import { AgentsMapContext, AssistantsMapContext, FileMapContext, SearchContext } from '~/Providers';
import { useAuthContext, useAssistantsMap, useAgentsMap, useFileMap, useSearch } from '~/hooks';
import { Nav, MobileNav } from '~/components/Nav';
import TermsAndConditionsModal from '~/components/ui/TermsAndConditionsModal';
import { Banner } from '~/components/Banners';
import { Capacitor } from '@capacitor/core';

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
    enabled: isAuthenticated && !!config?.interface?.termsOfService?.modalAcceptance,
  });

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

  const platform = Capacitor.getPlatform();

  return (
    <SearchContext.Provider value={search}>
      <FileMapContext.Provider value={fileMap}>
        <AssistantsMapContext.Provider value={assistantsMap}>
          <AgentsMapContext.Provider value={agentsMap}>
            <Banner onHeightChange={setBannerHeight} />
            <div
              className="flex flex-col h-full"
              style={{
                minHeight: `calc(100vh - ${bannerHeight}px)`,
                ...(platform === 'ios' && { paddingTop: 'env(safe-area-inset-top)' }),
              }}
            >
              <div className="relative z-0 flex flex-1 w-full">
                <Nav navVisible={navVisible} setNavVisible={setNavVisible} />
                <div className="relative flex flex-1 max-w-full flex-col">
                  <MobileNav setNavVisible={setNavVisible} />
                  <Outlet context={{ navVisible, setNavVisible } satisfies ContextType} />
                </div>
              </div>
            </div>
          </AgentsMapContext.Provider>
          {config?.interface?.termsOfService?.modalAcceptance && (
            <TermsAndConditionsModal
              open={showTerms}
              onOpenChange={setShowTerms}
              onAccept={handleAcceptTerms}
              onDecline={handleDeclineTerms}
              title={config.interface.termsOfService.modalTitle}
              modalContent={config.interface.termsOfService.modalContent}
            />
          )}
        </AssistantsMapContext.Provider>
      </FileMapContext.Provider>
    </SearchContext.Provider>
  );
}
