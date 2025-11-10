/**
 * CUSTOM: gptchina fork
 * FeaturesPanel Component
 * Left panel displaying platform features and benefits
 */

import type { FeaturesPanelProps } from '../shared/types';
import { FeatureCard } from './FeatureCard';
import * as Icons from './icons';

// Map icon names from constants to actual icon components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MultiProviderIcon: Icons.MultiProviderIcon,
  PrivacyIcon: Icons.PrivacyIcon,
  CostControlIcon: Icons.CostControlIcon,
  AgentsIcon: Icons.AgentsIcon,
  CodeIcon: Icons.CodeIcon,
  SearchIcon: Icons.SearchIcon,
  ComparisonIcon: Icons.ComparisonIcon,
};

export function FeaturesPanel({ hero, features }: FeaturesPanelProps) {
  return (
    <div className="px-8 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">{hero.headline}</h1>
        <p className="mb-2 text-lg text-white lg:text-xl">{hero.subheadline}</p>
        {hero.tagline && <p className="text-sm font-medium text-white">{hero.tagline}</p>}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        {features.map((feature) => {
          const IconComponent = iconMap[feature.icon];
          return (
            <FeatureCard
              key={feature.id}
              icon={IconComponent}
              title={feature.title}
              description={feature.description}
            />
          );
        })}
      </div>
    </div>
  );
}
