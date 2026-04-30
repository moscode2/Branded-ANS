import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(request: Request) {
  try {
    const { priceId, email, planId } = await request.json();

    if (!priceId || !email) {
      return NextResponse.json(
        { error: "Missing priceId or email." },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;

    // Create or retrieve a Stripe customer by email
    const existing = await stripe.customers.list({ email, limit: 1 });
    let customer = existing.data[0];
    if (!customer) {
      customer = await stripe.customers.create({ email });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/subscribe/success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
      cancel_url: `${origin}/subscribe`,
      metadata: { email, planId },
      subscription_data: {
        metadata: { email, planId },
        trial_period_days: 0,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("[Stripe Checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}