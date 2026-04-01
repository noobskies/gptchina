/**
 * CUSTOM: gptchina fork
 *
 * Feature: Split Auth Layout
 * Created: 2025-11-09
 *
 * TypeScript type definitions for the split authentication layout feature.
 * This file defines the structure for platform features displayed on the auth pages.
 */

import type { TStartupConfig } from 'librechat-data-provider';
import type { TranslationKeys } from '~/hooks';

/**
 * Represents a single platform feature displayed on the features panel
 */
export interface PlatformFeature {
  /** Unique identifier for the feature */
  id: string;
  /** Name of the icon component to display */
  icon: string;
  /** Feature title (short, descriptive) */
  title: string;
  /** Feature description (explains the benefit) */
  description: string;
}

/**
 * Hero content displayed at the top of the features panel
 */
export interface HeroContent {
  /** Main headline */
  headline: string;
  /** Supporting subheadline */
  subheadline: string;
  /** Optional tagline */
  tagline?: string;
}

/**
 * Props for the SplitAuthLayout component
 * Matches the AuthLayout component signature for drop-in replacement
 */
export interface SplitAuthLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  isFetching: boolean;
  startupConfig: TStartupConfig | null | undefined;
  startupConfigError: unknown | null | undefined;
  pathname: string;
  error: TranslationKeys | null;
}

/**
 * Props for the FeaturesPanel component
 */
export interface FeaturesPanelProps {
  /** Hero content to display */
  hero: HeroContent;
  /** List of features to display */
  features: PlatformFeature[];
}

/**
 * Props for the FeatureCard component
 */
export interface FeatureCardProps {
  /** Icon component to render */
  icon: React.ComponentType<{ className?: string }>;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
}
