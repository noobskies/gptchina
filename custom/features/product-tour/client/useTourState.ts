/**
 * CUSTOM: gptchina fork
 *
 * Feature: Product Tour
 * Created: 2025-12-10
 * Upstream Impact: None (standalone module)
 *
 * Custom hook for managing tour state via localStorage.
 * Tracks completion, dismissal, and current step progress.
 */

import { useState, useCallback, useEffect } from 'react';
import type { TourState, TourCallbacks } from './types';

const STORAGE_KEYS = {
  COMPLETED: 'gptchina:tour:completed',
  DISMISSED: 'gptchina:tour:dismissed',
  CURRENT_STEP: 'gptchina:tour:current-step',
} as const;

/**
 * Hook to manage tour state with localStorage persistence
 */
export const useTourState = (): TourState & TourCallbacks => {
  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.COMPLETED) === 'true';
  });

  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.DISMISSED) === 'true';
  });

  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
    return stored ? parseInt(stored, 10) : 0;
  });

  // Persist to localStorage on state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.COMPLETED, String(isCompleted));
  }, [isCompleted]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.DISMISSED, String(isDismissed));
  }, [isDismissed]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, String(currentStep));
  }, [currentStep]);

  const shouldShowTour = !isCompleted && !isDismissed;

  const startTour = useCallback(() => {
    setIsCompleted(false);
    setIsDismissed(false);
    setCurrentStep(0);
  }, []);

  const skipTour = useCallback(() => {
    setIsDismissed(true);
    setCurrentStep(0);
  }, []);

  const completeTour = useCallback(() => {
    setIsCompleted(true);
    setCurrentStep(0);
  }, []);

  const resetTour = useCallback(() => {
    setIsCompleted(false);
    setIsDismissed(false);
    setCurrentStep(0);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.COMPLETED);
      localStorage.removeItem(STORAGE_KEYS.DISMISSED);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
    }
  }, []);

  return {
    isCompleted,
    isDismissed,
    currentStep,
    shouldShowTour,
    startTour,
    skipTour,
    completeTour,
    resetTour,
  };
};
