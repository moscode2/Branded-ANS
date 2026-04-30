"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const params  = useSearchParams();
  const plan    = params.get("plan") ?? "daily";
  const isFree  = plan === "free";

  useEffect(() => {
    // Inform the API to activate subscription after Stripe redirects
    const session = params.get("session_id");
    if (session) {
      fetch("/api/subscribe/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session }),
      }).catch(console.error);
    }
  }, [params]);

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="relative w-20 h-20 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-cyan/10 border border-cyan/30 animate-pulse" />
          <span className="relative text-3xl">✓</span>
        </div>

        <p className="text-[0.62rem] tracking-[0.22em] uppercase text-cyan font-mono mb-3">
          {isFree ? "Welcome Aboard" : "Subscription Active"}
        </p>

        <h1 className="font-display font-800 text-4xl md:text-5xl text-sand tracking-tight mb-5">
          {isFree ? "You're in." : "You're subscribed."}
        </h1>

        <p className="text-base text-muted leading-relaxed mb-10">
          {isFree
            ? "Your free Observer account gives you access to all public ANS content. Upgrade anytime to receive daily intelligence briefings."
            : "A confirmation email is on its way. Daily briefings start the next weekday morning at 07:00 UTC. Welcome to ANS Intelligence."}
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/insights"
            className="px-6 py-3 bg-cyan text-space text-[0.72rem] tracking-[0.14em] uppercase font-display font-700 hover:bg-cyan/90 transition-colors"
          >
            Read Insights →
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-cyan/20 text-sand text-[0.72rem] tracking-[0.14em] uppercase font-display hover:border-cyan/50 transition-colors"
          >
            Go to Home
          </Link>
        </div>

        {!isFree && (
          <p className="text-[0.62rem] text-muted/40 font-mono mt-8">
            Manage or cancel your subscription at any time via the link in your confirmation email.
          </p>
        )}
      </div>
    </section>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-muted text-sm">Loading…</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}