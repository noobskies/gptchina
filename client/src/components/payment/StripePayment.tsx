import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { loadStripe } from '@stripe/stripe-js';
import type { PluginListenerHandle } from '@capacitor/core';

const stripePromise = loadStripe(
  'pk_live_51MwvEEHKD0byXXCl8IzAvUl0oZ7RE6vIz72lWUVYl5rW3zy0u3FiGtIAgsbmqSHbhkTJeZjs5VEbQMNStaaQL9xQ001pwxI3RP'
);

export const processStripePayment = async (selectedOption, paymentMethod, userId, email) => {
  const { priceId } = selectedOption;
  const domain = window.location.hostname;

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

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Server error: ${errorData.error || res.statusText}`);
    }

    const data = await res.json();

    if (!data.sessionId || !data.url) {
      throw new Error('Invalid response from server: missing sessionId or url');
    }

    if (Capacitor.isNativePlatform()) {
      // Remove existing listeners
      await Browser.removeAllListeners();

      // Listen for URL changes in the browser
      Browser.addListener('browserPageLoaded', () => {
        alert('Browser page loaded');
        try {
          // Check if current URL includes novlisky.io
          if (window.location.href.includes('novlisky.io')) {
            alert('Detected return to novlisky.io, closing browser');
            alert('Payment process completed');
            Browser.close();
          }
        } catch (err) {
          console.error('Error handling page load:', err);
        }
      });

      // Opening payment page
      alert('Opening payment page...');
      await Browser.open({
        url: data.url,
        presentationStyle: 'popover',
        toolbarColor: '#000000'
      });

      return { success: true };
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
    if (Capacitor.isNativePlatform()) {
      alert('Payment processing error: ' + error.message);
    }
    return { success: false, error: error.message };
  }
};