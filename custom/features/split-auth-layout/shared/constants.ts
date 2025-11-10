/**
 * CUSTOM: gptchina fork
 *
 * Feature: Split Auth Layout
 * Created: 2025-11-09
 *
 * Feature content and configuration constants.
 * This file defines the marketing content displayed on the authentication pages.
 */

import type { HeroContent, PlatformFeature } from './types';

/**
 * Hero content displayed at the top of the features panel
 */
export const HERO_CONTENT: HeroContent = {
  headline: 'Your AI Assistant, Your Way',
  subheadline: 'Access multiple AI providers with full privacy and control',
  tagline: 'Secure. Cost effective. Powerful.',
};

/**
 * Platform features displayed on the features panel
 * Each feature includes an icon name, title, and description
 */
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
