"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SectionLabel from "@/components/SectionLabel";
import Link from "next/link";

const PLANS = [
  {
    id: "free",
    name: "Free Observer",
    price: 0,
    interval: null,
    priceId: null,
    badge: null,
    features: [
      "Access to public insights",
      "Weekly newsletter (Friday digest)",
      "Browse all reports",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    id: "daily",
    name: "Daily Intelligence",
    price: 15,
    interval: "month",
    priceId: process.env.NEXT_PUBLIC_STRIPE_DAILY_PRICE_ID ?? "price_daily_placeholder",
    badge: "Most Popular",
    features: [
      "Everything in Free Observer",
      "Daily briefing emails (Mon–Fri)",
      "Full article access including premium",
      "Downloadable PDF reports",
      "Priority access to new research",
    ],
    cta: "Subscribe — $15/mo",
    highlight: true,
  },
  {
    id: "annual",
    name: "Annual Intelligence",
    price: 120,
    interval: "year",
    priceId: process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID ?? "price_annual_placeholder",
    badge: "Best Value",
    features: [
      "Everything in Daily Intelligence",
      "Annual intelligence report (exclusive)",
      "Monthly strategy briefing call",
      "Custom research requests",
      "Save 33% vs monthly",
    ],
    cta: "Subscribe — $120/yr",
    highlight: false,
  },
];

export default function SubscribePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  async function handleSubscribe(plan: typeof PLANS[number]) {
    if (plan.id === "free") {
      router.push("/subscribe/success?plan=free");
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email before choosing a plan.");
      document.getElementById("email-input")?.focus();
      return;
    }
    setEmailError("");
    setLoading(plan.id);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId, email, planId: plan.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Something went wrong. Please try again.");
        setLoading(null);
      }
    } catch {
      alert("Network error. Please try again.");
      setLoading(null);
    }
  }

  return (
    <>
      {/* Header */}
      <section className="pt-36 pb-16 border-b border-cyan/5 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-6 relative text-center">
          <SectionLabel>Intelligence Access</SectionLabel>
          <h1 className="font-display font-800 text-5xl md:text-6xl text-sand tracking-tight leading-[1.05] mb-5">
            Subscribe to ANS
          </h1>
          <p className="text-base text-muted max-w-xl mx-auto leading-relaxed mb-10">
            Get daily intelligence briefings on African political narratives, disinformation
            trends, and digital democracy — straight to your inbox.
          </p>

          {/* Email capture — used across all paid plans */}
          <div className="max-w-sm mx-auto">
            <label className="block text-[0.65rem] tracking-[0.18em] uppercase text-muted mb-2 text-left">
              Your email address *
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              placeholder="you@organisation.com"
              className="form-input w-full text-sm py-3"
            />
            {emailError && (
              <p className="text-xs text-red-400 mt-1.5 text-left">{emailError}</p>
            )}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-cyan/5">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col p-8 ${
                  plan.highlight
                    ? "bg-spaceMid border border-cyan/20"
                    : "bg-ink2/80"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-8 px-3 py-1 bg-cyan text-space text-[0.58rem] tracking-[0.18em] uppercase font-display font-700">
                    {plan.badge}
                  </span>
                )}

                <div className="mb-6">
                  <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted font-mono mb-2">
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className="font-display font-800 text-5xl text-sand">
                      ${plan.price}
                    </span>
                    {plan.interval && (
                      <span className="text-muted text-sm mb-1">/{plan.interval}</span>
                    )}
                  </div>
                </div>

                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                      <span className="text-cyan mt-0.5 shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading !== null}
                  className={`w-full py-3 text-[0.72rem] tracking-[0.14em] uppercase font-display font-700 transition-all duration-200 disabled:opacity-40 ${
                    plan.highlight
                      ? "bg-cyan text-space hover:bg-cyan/90"
                      : "border border-cyan/25 text-sand hover:border-cyan/60"
                  }`}
                >
                  {loading === plan.id ? "Redirecting…" : plan.cta}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-[0.65rem] text-muted/50 mt-8 font-mono">
            Payments secured by Stripe · Cancel anytime · No hidden fees
          </p>
        </div>
      </section>

      {/* FAQ strip */}
      <section className="py-16 border-t border-cyan/5 bg-ink2/30">
        <div className="max-w-3xl mx-auto px-6">
          <SectionLabel>FAQ</SectionLabel>
          {[
            {
              q: "When do daily emails arrive?",
              a: "Briefings are sent every weekday morning at 07:00 UTC. Weekends receive a combined weekend digest.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes. Cancel from your Stripe customer portal — no penalties, no questions.",
            },
            {
              q: "What payment methods are accepted?",
              a: "All major credit/debit cards (Visa, Mastercard, Amex) via Stripe.",
            },
            {
              q: "Is there a free trial?",
              a: "The Free Observer tier gives you full access to public content indefinitely. Paid plans do not require a credit card trial.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="py-6 border-b border-cyan/5">
              <p className="font-display font-600 text-sand text-sm mb-2">{q}</p>
              <p className="text-sm text-muted leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Back nav */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/" className="text-[0.68rem] tracking-[0.12em] uppercase text-muted hover:text-cyan transition-colors">
          ← Back to Home
        </Link>
      </div>
    </>
  );
}