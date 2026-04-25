/**
 * CUSTOM: gptchina fork
 * Page header component with title, description, and theme toggle
 */

import React from 'react';
import { ThemeToggle } from './ThemeToggle';

export const PageHeader: React.FC = () => {
  return (
    <header className="border-b border-border-medium bg-surface-primary py-6">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-text-primary">Token Pricing Guide</h1>
            <p className="text-text-secondary">
              Understand how token consumption works and estimate your costs
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
