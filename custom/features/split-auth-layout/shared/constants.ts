/**
 * CUSTOM: gptchina fork
 *
 * Feature: Split Auth Layout
 * Created: 2025-11-09
 * Updated: 2025-11-15 - Added i18n support
 *
 * Feature content and configuration constants.
 * This file defines the marketing content displayed on the authentication pages.
 *
 * Translation keys reference - actual text is in client/src/locales/(lang)/translation.json
 */

import type { HeroContent, PlatformFeature } from './types';

/**
 * Hero content translation keys
 * Components should use localize() to get translated text
 */
export const HERO_CONTENT_KEYS = {
  headline: 'com_custom_splitauth_hero_headline',
  subheadline: 'com_custom_splitauth_hero_subheadline',
  tagline: 'com_custom_splitauth_hero_tagline',
};

/**
 * Platform features with translation keys
 * Components should use localize() to get translated text
 */
export const PLATFORM_FEATURES_KEYS: Array<{
  id: string;
  icon: string;
  titleKey: string;
  descriptionKey: string;
}> = [
  {
    id: 'multi-provider',
    icon: 'MultiProviderIcon',
    titleKey: 'com_custom_splitauth_feature_providers_title',
    descriptionKey: 'com_custom_splitauth_feature_providers_desc',
  },
  {
    id: 'privacy',
    icon: 'PrivacyIcon',
    titleKey: 'com_custom_splitauth_feature_privacy_title',
    descriptionKey: 'com_custom_splitauth_feature_privacy_desc',
  },
  {
    id: 'cost',
    icon: 'CostControlIcon',
    titleKey: 'com_custom_splitauth_feature_cost_title',
    descriptionKey: 'com_custom_splitauth_feature_cost_desc',
  },
  {
    id: 'agents',
    icon: 'AgentsIcon',
    titleKey: 'com_custom_splitauth_feature_agents_title',
    descriptionKey: 'com_custom_splitauth_feature_agents_desc',
  },
  {
    id: 'comparison',
    icon: 'ComparisonIcon',
    titleKey: 'com_custom_splitauth_feature_comparison_title',
    descriptionKey: 'com_custom_splitauth_feature_comparison_desc',
  },
  {
    id: 'search',
    icon: 'SearchIcon',
    titleKey: 'com_custom_splitauth_feature_search_title',
    descriptionKey: 'com_custom_splitauth_feature_search_desc',
  },
];

// Legacy exports for backward compatibility (deprecated - use KEYS versions)
export const HERO_CONTENT: HeroContent = {
  headline: 'Your AI Assistant, Your Way',
  subheadline: 'Access multiple AI providers with full privacy and control',
  tagline: 'Secure. Cost effective. Powerful.',
};

export const PLATFORM_FEATURES: PlatformFeature[] = [
  {
    id: 'multi-provider',
    icon: 'MultiProviderIcon',
    title: 'Multiple AI Providers',
    description: 'Access OpenAI, Anthropic, Google, and more in one unified interface',
  },
  {
    id: 'privacy',
    icon: 'PrivacyIcon',
    title: 'Privacy & Control',
    description: 'Your data, your choice. Complete ownership and control',
  },
  {
    id: 'cost',
    icon: 'CostControlIcon',
    title: 'Cost Savings',
    description: 'Pay per use, not subscriptions. Token purchases with volume discounts',
  },
  {
    id: 'agents',
    icon: 'AgentsIcon',
    title: 'AI Agents & Tools',
    description: 'Create custom agents with specialized tools and capabilities',
  },
  {
    id: 'comparison',
    icon: 'ComparisonIcon',
    title: 'Model Comparison',
    description: 'Compare responses from multiple AI models side-by-side',
  },
  {
    id: 'search',
    icon: 'SearchIcon',
    title: 'Web Search',
    description: 'Real-time internet search for up-to-date information and context',
  },
];
