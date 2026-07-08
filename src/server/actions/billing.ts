"use server";

import { requireUserId } from "@/lib/session";
import { prisma } from "@/server/db";
import {
  getStripe,
  isStripeConfigured,
  STRIPE_PRICE_ID,
  appUrl,
} from "@/lib/stripe";

type UrlResult = { ok: true; url: string } | { ok: false; error: string };

/**
 * Starts a Stripe Checkout session for the Pro (monthly €5) subscription.
 * Reuses/creates a Stripe Customer for the user and returns the hosted checkout
 * URL for the client to redirect to. Pro is granted by the webhook, not here.
 */
export async function createCheckoutSession(): Promise<UrlResult> {
  const userId = await requireUserId();

  if (!isStripeConfigured()) {
    return { ok: false, error: "Plățile nu sunt configurate momentan." };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, stripeCustomerId: true },
  });
  if (!user) return { ok: false, error: "Utilizator inexistent." };

  const stripe = getStripe();

  try {
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { userId },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      allow_promotion_codes: true,
      metadata: { userId },
      subscription_data: { metadata: { userId } },
      success_url: appUrl("/dashboard?upgraded=1"),
      cancel_url: appUrl("/dashboard"),
    });

    if (!session.url) return { ok: false, error: "Nu am putut porni plata." };
    return { ok: true, url: session.url };
  } catch (error) {
    console.error("createCheckoutSession failed", error);
    return { ok: false, error: "Nu am putut porni plata. Încearcă din nou." };
  }
}

/**
 * Opens the Stripe Billing Portal so the user can manage/cancel their
 * subscription or update payment details.
 */
export async function createBillingPortalSession(): Promise<UrlResult> {
  const userId = await requireUserId();

  if (!isStripeConfigured()) {
    return { ok: false, error: "Plățile nu sunt configurate momentan." };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });
  if (!user?.stripeCustomerId) {
    return { ok: false, error: "Nu există un abonament de gestionat." };
  }

  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: appUrl("/profile"),
    });
    return { ok: true, url: session.url };
  } catch (error) {
    console.error("createBillingPortalSession failed", error);
    return { ok: false, error: "Nu am putut deschide portalul. Încearcă din nou." };
  }
}
