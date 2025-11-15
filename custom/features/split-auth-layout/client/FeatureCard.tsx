/**
 * CUSTOM: gptchina fork
 * FeatureCard Component
 * Displays an individual platform feature with icon, title, and description
 */

import type { FeatureCardProps } from '../shared/types';

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:shadow-md md:p-4">
      <div className="mb-2 flex items-center gap-2 md:mb-3 md:gap-3">
        <div className="flex-shrink-0 rounded-lg bg-white/10 p-1.5 text-white transition-colors md:p-2">
          <Icon className="h-4 w-4 md:h-5 md:w-5" />
        </div>
        <h3 className="text-base font-semibold text-white md:text-lg">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-white">{description}</p>
    </div>
  );
}
