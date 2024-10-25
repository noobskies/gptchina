import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  'pk_live_51MwvEEHKD0byXXCl8IzAvUl0oZ7RE6vIz72lWUVYl5rW3zy0u3FiGtIAgsbmqSHbhkTJeZjs5VEbQMNStaaQL9xQ001pwxI3RP'
);

export const processStripePayment = async (selectedOption, paymentMethod, userId, email) => {
  const { priceId } = selectedOption;
  const domain = window.location.hostname;
  const isNative = Capacitor.isNativePlatform();

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
        isNative
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Server error: ${errorData.error || res.statusText}`);
    }

    const data = await res.json();

    if (!data.sessionId || !data.url) {
      throw new Error('Invalid response from server: missing sessionId or url');
    }

    if (isNative) {
      console.log('Opening payment in Capacitor browser:', data.url);
      await Browser.open({
        url: data.url,
        presentationStyle: 'popover',
        toolbarColor: '#000000',
        windowName: '_self'
      });
      return { success: true, pending: true };
    } else {
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
    if (isNative) {
      alert('Payment processing error: ' + error.message);
    }
    return { success: false, error: error.message };
  }
};