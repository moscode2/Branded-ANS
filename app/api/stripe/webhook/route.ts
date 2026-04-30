import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

// Use service-role key here — webhooks run server-side only
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const sig  = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ── Payment succeeded → activate or renew subscription ──────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.CheckoutSession;
        const email   = session.metadata?.email ?? session.customer_email ?? "";
        const planId  = session.metadata?.planId ?? "daily";
        const subId   = session.subscription as string;

        if (email) {
          await upsertSubscription({
            email,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subId,
            plan_id: planId,
            status: "active",
          });
          await sendConfirmationEmail(email, planId);
        }
        break;
      }

      // ── Renewal ────────────────────────────────────────────────────────────
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId   = (invoice as unknown as { subscription: string }).subscription;
        if (subId) {
          await supabase
            .from("subscriptions")
            .update({ status: "active", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", subId);
        }
        break;
      }

      // ── Payment failed ─────────────────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId   = (invoice as unknown as { subscription: string }).subscription;
        if (subId) {
          await supabase
            .from("subscriptions")
            .update({ status: "past_due", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", subId);
        }
        break;
      }

      // ── Cancelled ──────────────────────────────────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabase
          .from("subscriptions")
          .update({ status: "cancelled", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("[Webhook] Handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function upsertSubscription(data: {
  email: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  plan_id: string;
  status: string;
}) {
  const { error } = await supabase.from("subscriptions").upsert(
    {
      email:                    data.email,
      stripe_customer_id:       data.stripe_customer_id,
      stripe_subscription_id:   data.stripe_subscription_id,
      plan_id:                  data.plan_id,
      status:                   data.status,
      subscribed_at:            new Date().toISOString(),
      updated_at:               new Date().toISOString(),
    },
    { onConflict: "email" }
  );
  if (error) console.error("[upsertSubscription]", error);
}

async function sendConfirmationEmail(email: string, planId: string) {
  const planNames: Record<string, string> = {
    daily:  "Daily Intelligence ($15/month)",
    annual: "Annual Intelligence ($120/year)",
  };
  const planName = planNames[planId] ?? planId;

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to:       email,
      subject:  "Welcome to ANS Intelligence — Your Subscription is Active",
      type:     "confirmation",
      planName,
    }),
  });
  if (!res.ok) console.error("[sendConfirmationEmail] Failed:", await res.text());
}