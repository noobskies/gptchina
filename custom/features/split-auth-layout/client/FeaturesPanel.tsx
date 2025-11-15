/**
 * CUSTOM: gptchina fork
 * FeaturesPanel Component
 * Left panel displaying platform features and benefits
 * Updated: 2025-11-15 - Added i18n support
 */

import { useLocalize } from '~/hooks';
import { HERO_CONTENT_KEYS, PLATFORM_FEATURES_KEYS } from '../shared/constants';
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

export function FeaturesPanel() {
  const localize = useLocalize();

  return (
    <div className="px-8 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
          {(localize as any)(HERO_CONTENT_KEYS.headline)}
        </h1>
        <p className="mb-2 text-lg text-white lg:text-xl">
          {(localize as any)(HERO_CONTENT_KEYS.subheadline)}
        </p>
        <p className="text-sm font-medium text-white">
          {(localize as any)(HERO_CONTENT_KEYS.tagline)}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        {PLATFORM_FEATURES_KEYS.map((feature) => {
          const IconComponent = iconMap[feature.icon];
          return (
            <FeatureCard
              key={feature.id}
              icon={IconComponent}
              title={(localize as any)(feature.titleKey)}
              description={(localize as any)(feature.descriptionKey)}
            />
          );
        })}
      </div>
    </div>
  );
}
