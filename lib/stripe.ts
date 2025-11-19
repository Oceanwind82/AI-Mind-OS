import Stripe from 'stripe';
import { supabase } from './supabase';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export default stripe;

// Pricing configuration
export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '3 AI messages per lesson',
      'Access to all lessons',
      'Basic progress tracking',
      'Community support'
    ],
    aiLimit: 3,
    color: 'gray'
  },
  pro: {
    name: 'Pro',
    price: 9,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      'Unlimited AI conversations',
      'AI-generated lesson summaries',
      'Priority GPT-4 responses',
      'Progress analytics',
      'Email support'
    ],
    aiLimit: -1, // Unlimited
    color: 'blue'
  },
  master: {
    name: 'Master',
    price: 19,
    priceId: process.env.STRIPE_MASTER_PRICE_ID!,
    features: [
      'Everything in Pro',
      'Custom AI tutor personality',
      'Advanced follow-up quizzes',
      'Early access to new lessons',
      'Priority support',
      '1-on-1 onboarding call'
    ],
    aiLimit: -1, // Unlimited
    color: 'purple'
  }
} as const;

export type PlanTier = keyof typeof PRICING_PLANS;

// Create Stripe checkout session
export async function createCheckoutSession(
  userId: string,
  priceId: string,
  planTier: PlanTier,
  userEmail: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId,
        planTier,
      },
    });

    return { sessionId: session.id, url: session.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Handle successful payment via webhook
export async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const { userId, planTier } = session.metadata!;
  
  if (!userId || !planTier) {
    throw new Error('Missing metadata in session');
  }

  // Update user tier in Supabase
  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      tier: planTier as PlanTier,
      stripe_customer_id: session.customer as string,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user tier:', error);
    throw error;
  }

  return data;
}

// Create customer portal session (for managing subscriptions)
export async function createPortalSession(customerId: string) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}
