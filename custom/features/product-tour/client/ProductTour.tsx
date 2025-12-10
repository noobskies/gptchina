/**
 * CUSTOM: gptchina fork
 *
 * Feature: Product Tour
 * Created: 2025-12-10
 * Upstream Impact: None (standalone module)
 *
 * Main tour component using React Joyride.
 * Manages tour state and displays step-by-step guidance.
 */

import React, { useCallback, useContext } from 'react';
import Joyride, { CallBackProps, STATUS, ACTIONS } from 'react-joyride';
import { useMediaQuery, ThemeContext } from '@librechat/client';
import { useLocalize } from '~/hooks';
import { getTourSteps } from './tourSteps';
import { getTourStyles, getTourLocale } from './tourStyles';

interface ProductTourProps {
  run: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const ProductTour: React.FC<ProductTourProps> = ({ run, onComplete, onSkip }) => {
  const localize = useLocalize();
  const { theme } = useContext(ThemeContext);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const isDarkMode = theme === 'dark';
  const steps = getTourSteps(localize, isSmallScreen);
  const styles = getTourStyles(isDarkMode);
  const locale = getTourLocale(localize);

  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { status, action } = data;

      // Handle tour completion
      if (status === STATUS.FINISHED) {
        onComplete();
      }

      // Handle tour skip/close
      if (status === STATUS.SKIPPED || action === ACTIONS.CLOSE) {
        onSkip();
      }
    },
    [onComplete, onSkip],
  );

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      spotlightPadding={12}
      spotlightClicks
      disableOverlayClose
      disableCloseOnEsc={false}
      hideCloseButton={false}
      scrollToFirstStep
      scrollOffset={100}
      styles={styles}
      locale={locale}
      callback={handleJoyrideCallback}
    />
  );
};

export default ProductTour;
