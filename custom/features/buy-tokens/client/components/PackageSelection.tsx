/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Package selection grid component.
 */

import React from 'react';
import type { TokenPackage } from '../../shared/types';
import { TokenPackageCard } from '../TokenPackageCard';

interface PackageSelectionProps {
  packages: TokenPackage[];
  selectedPackage: string;
  onSelectPackage: (packageId: string) => void;
}

export const PackageSelection: React.FC<PackageSelectionProps> = ({
  packages,
  selectedPackage,
  onSelectPackage,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      {packages.map((pkg) => (
        <TokenPackageCard
          key={pkg.id}
          package={pkg}
          isSelected={selectedPackage === pkg.id}
          onSelect={onSelectPackage}
        />
      ))}
    </div>
  );
};
