/**
 * CUSTOM: gptchina fork
 * Package display card component
 */

import React from 'react';
import { Package, Zap, Star, TrendingUp } from 'lucide-react';

interface PackageCardProps {
  title: string;
  price: string;
  tokens: string;
  badge?: 'starter' | 'popular' | 'value' | 'power';
  models: Array<{
    name: string;
    conversations: string;
    color: 'success' | 'primary' | 'warning';
  }>;
  discount?: string;
  isPopular?: boolean;
}

const badgeConfig = {
  starter: {
    label: 'Starter',
    icon: Package,
    className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  popular: { label: 'Most Popular', icon: Star, className: 'bg-blue-500 text-white' },
  value: {
    label: 'Best Value',
    icon: TrendingUp,
    className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
  power: {
    label: 'Power User',
    icon: Zap,
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
};

const colorStyles = {
  success: 'text-green-600 dark:text-green-400',
  primary: 'text-text-primary',
  warning: 'text-orange-600 dark:text-orange-400',
};

export const PackageCard: React.FC<PackageCardProps> = ({
  title,
  price,
  tokens,
  badge,
  models,
  discount,
  isPopular = false,
}) => {
  const badgeInfo = badge ? badgeConfig[badge] : null;
  const BadgeIcon = badgeInfo?.icon;

  return (
    <div
      className={`rounded-lg bg-surface-secondary p-6 transition-all hover:shadow-md ${
        isPopular ? 'border-2 border-blue-500' : 'border border-border-medium'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-text-primary">{title}</h3>
        {badgeInfo && (
          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${badgeInfo.className}`}
          >
            {BadgeIcon && <BadgeIcon className="h-3 w-3" />}
            {badgeInfo.label}
          </div>
        )}
      </div>

      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-text-primary">{price}</span>
        <span className="text-sm text-text-secondary">/ {tokens} tokens</span>
      </div>

      <div className="space-y-2 text-sm">
        {models.map((model, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-text-secondary">{model.name}:</span>
            <span className={`font-mono font-semibold ${colorStyles[model.color]}`}>
              {model.conversations}
            </span>
          </div>
        ))}
      </div>

      {discount && <p className="mt-3 text-xs text-blue-600 dark:text-blue-400">Save {discount}</p>}
    </div>
  );
};
