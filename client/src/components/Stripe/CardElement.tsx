import React from 'react';
import { CardElement as StripeCardElement } from '@stripe/react-stripe-js';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: 'var(--text-primary)',
      fontFamily: '"Inter", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: 'var(--text-secondary)',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const CardElement: React.FC = () => {
  return (
    <div className="w-full rounded-md border bg-surface-primary p-3">
      <StripeCardElement options={CARD_ELEMENT_OPTIONS} />
    </div>
  );
};

export default CardElement;
