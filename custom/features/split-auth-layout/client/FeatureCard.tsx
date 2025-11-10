/**
 * CUSTOM: gptchina fork
 * FeatureCard Component
 * Displays an individual platform feature with icon, title, and description
 */

import type { FeatureCardProps } from '../shared/types';

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:shadow-md">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex-shrink-0 rounded-lg bg-white/10 p-2 text-white transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-white">{description}</p>
    </div>
  );
}
