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

  const res = await fetch('/api/payment/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, userId, domain, email, paymentMethod }),
  });

  console.log('res', res);
  const data = await res.json();

  if (Capacitor.isNativePlatform()) {
    // For native platforms (Android, iOS)
    const { url } = await Browser.open({ url: data.url });
    
    // Add an event listener for the 'browserFinished' event
    Browser.addListener('browserFinished', () => {
      // Handle the redirect back to the app
      // You may want to check the payment status here
      console.log('Browser finished, payment might be complete');
    });
  } else {
    // For web
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
    if (error) {
      console.error('Stripe Checkout Error:', error);
    }
  }
};