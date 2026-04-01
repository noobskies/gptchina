/**
 * CUSTOM: gptchina fork
 *
 * Feature: Product Tour
 * Created: 2025-12-10
 * Upstream Impact: None (standalone module)
 *
 * TypeScript interfaces for the product tour feature.
 * Defines tour state, step configuration, and callback types.
 */

export interface TourState {
  isCompleted: boolean;
  isDismissed: boolean;
  currentStep: number;
  shouldShowTour: boolean;
}

export interface TourCallbacks {
  startTour: () => void;
  skipTour: () => void;
  completeTour: () => void;
  resetTour: () => void;
}

export interface TourStep {
  target: string;
  title: string;
  content: string | React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  disableBeacon?: boolean;
  spotlightClicks?: boolean;
  hideBackButton?: boolean;
  hideCloseButton?: boolean;
  disableOverlayClose?: boolean;
}

export interface TourContext extends TourState, TourCallbacks {
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  runTour: boolean;
  setRunTour: (run: boolean) => void;
}
