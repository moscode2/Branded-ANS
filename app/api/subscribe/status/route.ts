import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();
    if (!sessionId) return NextResponse.json({ ok: false });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const email   = session.metadata?.email ?? session.customer_email ?? "";
    const planId  = session.metadata?.planId ?? "daily";

    if (!email) return NextResponse.json({ ok: false });

    // Upsert — webhook may have already done this, that's fine
    await supabase.from("subscriptions").upsert(
      {
        email,
        stripe_customer_id:      session.customer as string,
        stripe_subscription_id:  session.subscription as string,
        plan_id:                 planId,
        status:                  "active",
        subscribed_at:           new Date().toISOString(),
        updated_at:              new Date().toISOString(),
      },
      { onConflict: "email" }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[activate]", err);
    return NextResponse.json({ ok: false });
  }
}