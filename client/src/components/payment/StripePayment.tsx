import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  'pk_live_51MwvEEHKD0byXXCl8IzAvUl0oZ7RE6vIz72lWUVYl5rW3zy0u3FiGtIAgsbmqSHbhkTJeZjs5VEbQMNStaaQL9xQ001pwxI3RP'
);

export const processStripePayment = async (selectedOption, paymentMethod, userId, email) => {
  const { priceId } = selectedOption;
  const domain = window.location.hostname;

  console.log('Payment method before sending request:', paymentMethod);

  try {
    const res = await fetch('/api/payment/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        priceId, 
        userId, 
        domain, 
        email, 
        paymentMethod,
      }),
    });

    console.log('Server response:', res);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Server error: ${errorData.error || res.statusText}`);
    }

    const data = await res.json();

    if (!data.sessionId || !data.url) {
      throw new Error('Invalid response from server: missing sessionId or url');
    }

    if (Capacitor.isNativePlatform()) {
      // For native platforms (Android, iOS)
      await Browser.open({ url: data.url });
      
      Browser.addListener('browserFinished', () => {
        console.log('Browser finished, payment might be complete');
        // You may want to check the payment status here
      });

      return { success: true };
    } else {
      // For web
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (error) {
        console.error('Stripe Checkout Error:', error);
        throw error;
      }
      return { success: true };
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return { success: false, error: error.message };
  }
};