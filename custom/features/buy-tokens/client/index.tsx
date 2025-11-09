/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Barrel export for Buy Tokens feature components.
 */

import React from 'react';
import { BuyTokensButton } from './BuyTokensButton';
import { TokenPurchaseModal } from './TokenPurchaseModal';

/**
 * Buy Tokens feature wrapper component
 * Combines button and modal for easy integration
 */
const BuyTokens: React.FC = () => {
  return (
    <>
      <BuyTokensButton />
      <TokenPurchaseModal />
    </>
  );
};

export default BuyTokens;
