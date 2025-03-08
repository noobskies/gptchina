import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '~/components/ui';
import CardElementComponent from './CardElement';
import { useLocalize } from '~/hooks';

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ clientSecret, amount, onSuccess, onError }) => {
  const localize = useLocalize();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    if (!clientSecret) {
      onError('Missing client secret. Please try again.');
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      console.log('Confirming payment with client secret:', clientSecret);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        onError(error.message || 'An error occurred with your payment');
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess();
      } else {
        onError(`Payment status: ${paymentIntent.status}`);
      }
    } catch (err) {
      onError('An unexpected error occurred');
      console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <CardElementComponent />
      <div className="text-token-text-secondary text-center text-xs">
        {localize('token_payment_secure')}
      </div>
      <Button type="submit" disabled={!stripe || isProcessing} variant="submit" className="w-full">
        {isProcessing
          ? localize('token_payment_processing')
          : localize('token_payment_pay', { amount: amount.toFixed(2) })}
      </Button>
    </form>
  );
};

export default PaymentForm;
