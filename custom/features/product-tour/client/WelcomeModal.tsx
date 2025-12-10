/**
 * CUSTOM: gptchina fork
 *
 * Feature: Product Tour
 * Created: 2025-12-10
 * Upstream Impact: None (standalone module)
 *
 * Welcome modal (Step 0) that appears before the tour starts.
 * Introduces users to the platform and prompts them to take the tour.
 */

import React from 'react';
import { useLocalize } from '~/hooks';
import { OGDialog, OGDialogContent, OGDialogTitle } from '@librechat/client';

interface WelcomeModalProps {
  isOpen: boolean;
  onStartTour: () => void;
  onSkipTour: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onStartTour, onSkipTour }) => {
  const localize = useLocalize();

  return (
    <OGDialog open={isOpen} onOpenChange={(open) => !open && onSkipTour()}>
      <OGDialogContent className="max-w-md">
        <div className="mb-4">
          <OGDialogTitle className="text-2xl font-bold text-text-primary">
            {(localize as any)('com_custom_tour_welcome_title')}
          </OGDialogTitle>
        </div>
        <div className="space-y-4 py-4">
          <p className="text-sm leading-relaxed text-text-secondary">
            {(localize as any)('com_custom_tour_welcome_body')}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            onClick={onSkipTour}
            className="order-2 rounded-md px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover sm:order-1"
          >
            {(localize as any)('com_custom_tour_button_skip')}
          </button>
          <button
            onClick={onStartTour}
            className="order-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:order-2"
          >
            {(localize as any)('com_custom_tour_welcome_button')}
          </button>
        </div>
      </OGDialogContent>
    </OGDialog>
  );
};

export default WelcomeModal;
