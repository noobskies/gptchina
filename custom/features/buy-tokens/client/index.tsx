/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Barrel export for Buy Tokens feature components.
 */

import React, { useState } from 'react';
import { BuyTokensButton } from './BuyTokensButton';
import { TokenPurchaseModal } from './TokenPurchaseModal';

/**
 * Buy Tokens feature wrapper component
 * Manages modal state and combines button with modal
 */
interface BuyTokensProps {
  collapsed?: boolean;
}

const BuyTokens: React.FC<BuyTokensProps> = ({ collapsed = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <BuyTokensButton collapsed={collapsed} onClick={() => setIsModalOpen(true)} />
      {isModalOpen && <TokenPurchaseModal open={isModalOpen} onOpenChange={setIsModalOpen} />}
    </>
  );
};

export default BuyTokens;
