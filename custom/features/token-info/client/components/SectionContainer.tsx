/**
 * CUSTOM: gptchina fork
 * Reusable section container with consistent styling
 */

import React from 'react';
import { Separator } from '@librechat/client';
import { LucideIcon } from 'lucide-react';
import { cn } from '~/utils';

interface SectionContainerProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  showSeparator?: boolean;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  title,
  icon: Icon,
  children,
  className,
  showSeparator = true,
}) => {
  return (
    <section className={cn('mb-12', className)}>
      <div className="mb-6 flex items-center gap-3">
        {Icon && <Icon className="h-7 w-7 text-text-primary" />}
        <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
      </div>
      {children}
      {showSeparator && <Separator className="mt-12" />}
    </section>
  );
};
