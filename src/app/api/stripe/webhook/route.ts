import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/server/db";

// Stripe needs the raw request body + Node runtime (crypto) to verify signatures.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Subscription billing-period end works across API versions (top-level or item). */
function periodEnd(sub: Stripe.Subscription): Date | null {
  const top = (sub as unknown as { current_period_end?: number })
    .current_period_end;
  const item = sub.items?.data?.[0]?.current_period_end;
  const unix = top ?? item;
  return typeof unix === "number" ? new Date(unix * 1000) : null;
}

/** Mirror a Stripe subscription onto the matching user row. */
async function syncSubscription(sub: Stripe.Subscription): Promise<void> {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const userId = sub.metadata?.userId;

  const where = userId ? { id: userId } : { stripeCustomerId: customerId };
  const user = await prisma.user.findFirst({ where, select: { id: true } });
  if (!user) {
    console.warn("[stripe webhook] no user for customer", customerId);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: sub.id,
      stripePriceId: sub.items?.data?.[0]?.price?.id ?? null,
      stripeSubscriptionStatus: sub.status,
      stripeCurrentPeriodEnd: periodEnd(sub),
    },
  });
}

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET not set");
    return new Response("Webhook not configured", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const body = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error("[stripe webhook] signature verification failed", error);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const subId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const sub = await stripe.subscriptions.retrieve(subId);
          await syncSubscription(sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      }
      default:
        // Ignore other events.
        break;
    }
  } catch (error) {
    console.error("[stripe webhook] handler error", event.type, error);
    return new Response("Handler error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
