/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Purchase receipt component displaying payment confirmation.
 */

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@librechat/client';
import { useLocalize } from '~/hooks';
import { TOKEN_PACKAGES } from '../../shared/types';
import { formatPrice } from '../utils/currency';

interface PurchaseReceiptProps {
  paymentIntent: any;
  selectedPackage: string;
  onClose: () => void;
}

export const PurchaseReceipt: React.FC<PurchaseReceiptProps> = ({
  paymentIntent,
  selectedPackage,
  onClose,
}) => {
  const localize = useLocalize();
  const packageDetails = TOKEN_PACKAGES.find((pkg) => pkg.id === selectedPackage);

  return (
    <>
      <div className="p-3 sm:p-6">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-xl font-semibold text-text-primary">
            {(localize as any)('com_custom_tokens_buy_receipt_success_title')}
          </h3>
          <p className="text-sm text-text-secondary">
            {(localize as any)('com_custom_tokens_buy_receipt_success_desc')}
          </p>
        </div>

        {/* Receipt Details */}
        <div className="rounded-lg border border-border-light bg-surface-tertiary p-4">
          <h4 className="mb-3 text-sm font-medium text-text-secondary">
            {(localize as any)('com_custom_tokens_buy_receipt_title')}
          </h4>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">
                {(localize as any)('com_custom_tokens_buy_receipt_package')}
              </span>
              <span className="font-medium text-text-primary">{packageDetails?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">
                {(localize as any)('com_custom_tokens_buy_receipt_tokens')}
              </span>
              <span className="font-medium text-text-primary">
                {packageDetails?.tokens.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">
                {(localize as any)('com_custom_tokens_buy_receipt_amount')}
              </span>
              <span className="font-medium text-text-primary">
                {packageDetails ? formatPrice(packageDetails.price) : ''}
              </span>
            </div>
            <div className="flex justify-between border-t border-border-light pt-2">
              <span className="text-text-secondary">
                {(localize as any)('com_custom_tokens_buy_receipt_payment_id')}
              </span>
              <span className="font-mono text-xs text-text-primary">
                {paymentIntent?.id?.substring(0, 20)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">
                {(localize as any)('com_custom_tokens_buy_receipt_date')}
              </span>
              <span className="text-text-primary">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="flex justify-center border-t border-border-light bg-background px-4 py-3 sm:justify-end sm:px-6 sm:py-4">
        <Button
          variant="submit"
          onClick={onClose}
          className="w-full bg-blue-600 px-4 hover:bg-blue-700 sm:w-auto"
        >
          {(localize as any)('com_custom_tokens_buy_button_close')}
        </Button>
      </div>
    </>
  );
};
