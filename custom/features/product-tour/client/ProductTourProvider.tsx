/**
 * CUSTOM: gptchina fork
 *
 * Feature: Product Tour
 * Created: 2025-12-10
 * Upstream Impact: None (standalone module)
 *
 * Provider component that manages product tour state.
 * Shows welcome modal on first visit, then runs the tour.
 */

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '~/hooks';
import { useTourState } from './useTourState';
import { WelcomeModal } from './WelcomeModal';
import { ProductTour } from './ProductTour';

interface ProductTourProviderProps {
  children: React.ReactNode;
}

export const ProductTourProvider: React.FC<ProductTourProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const {
    shouldShowTour,
    startTour: startTourState,
    skipTour: skipTourState,
    completeTour,
  } = useTourState();

  const [showWelcome, setShowWelcome] = useState(false);
  const [runTour, setRunTour] = useState(false);

  // Show welcome modal on mount if tour should be shown AND user is authenticated
  useEffect(() => {
    if (shouldShowTour && isAuthenticated) {
      // Small delay to let the page load first
      const timer = setTimeout(() => {
        setShowWelcome(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [shouldShowTour, isAuthenticated]);

  const handleStartTour = () => {
    setShowWelcome(false);
    startTourState();
    // Small delay before starting tour to let modal close
    setTimeout(() => {
      setRunTour(true);
    }, 300);
  };

  const handleSkipTour = () => {
    setShowWelcome(false);
    setRunTour(false);
    skipTourState();
  };

  const handleCompleteTour = () => {
    setRunTour(false);
    completeTour();
  };

  return (
    <>
      {children}
      {shouldShowTour && isAuthenticated && (
        <>
          <WelcomeModal
            isOpen={showWelcome}
            onStartTour={handleStartTour}
            onSkipTour={handleSkipTour}
          />
          <ProductTour run={runTour} onComplete={handleCompleteTour} onSkip={handleSkipTour} />
        </>
      )}
    </>
  );
};

export default ProductTourProvider;
