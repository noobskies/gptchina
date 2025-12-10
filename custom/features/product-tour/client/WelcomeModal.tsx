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
      <OGDialogContent className="max-w-md border-border-medium bg-surface-primary">
        <div className="mb-2">
          <OGDialogTitle className="text-2xl font-bold text-text-primary">
            {(localize as any)('com_custom_tour_welcome_title')}
          </OGDialogTitle>
        </div>
        <div className="space-y-4 py-6">
          <p className="text-base leading-relaxed text-text-secondary">
            {(localize as any)('com_custom_tour_welcome_body')}
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            onClick={onSkipTour}
            className="order-2 rounded-lg border border-border-medium px-5 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-border-heavy hover:bg-surface-hover sm:order-1"
          >
            {(localize as any)('com_custom_tour_button_skip')}
          </button>
          <button
            onClick={onStartTour}
            className="order-1 rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/50 sm:order-2"
          >
            {(localize as any)('com_custom_tour_welcome_button')}
          </button>
        </div>
      </OGDialogContent>
    </OGDialog>
  );
};

export default WelcomeModal;
