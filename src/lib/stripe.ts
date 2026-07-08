import "server-only";
import Stripe from "stripe";

/**
 * Stripe server client (singleton) + config. Secret key stays server-side only.
 * The Pro plan is a single recurring monthly price (€5) whose id lives in
 * STRIPE_PRICE_ID. Checkout/portal return URLs are built from the app's base URL.
 */

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set.");
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

/** True when Stripe is configured (key + price present). */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);
}

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID ?? "";

/** Base URL for building Checkout/Portal success & cancel redirects. */
export function appUrl(path = ""): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.AUTH_URL ??
    "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path}`;
}
