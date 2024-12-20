import Stripe from 'stripe';

if (!process.env.STRIPE_KEY) {
  throw new Error('STRIPE_KEY must be defined');
}

export const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});
