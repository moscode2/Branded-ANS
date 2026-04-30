"use client";
import { useState } from "react";
import Link from "next/link";
import { useSubscription } from "@/lib/useSubscription";

type Props = {
  children: React.ReactNode;
  /** Brief description of what's behind the gate, e.g. "This report" */
  label?: string;
};

export default function SubscriptionGate({ children, label = "This content" }: Props) {
  const [email, setEmail] = useState("");
  const { subscribed, loading } = useSubscription(email || null);

  // Not yet checked — show email prompt
  if (!email) {
    return (
      <GateUI
        label={label}
        body="Enter your email to check your subscription status, or subscribe to unlock premium ANS intelligence."
        action={
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              setEmail(fd.get("email") as string);
            }}
            className="flex gap-0 w-full max-w-sm"
          >
            <input
              name="email"
              type="email"
              required
              placeholder="your@email.com"
              className="form-input flex-1 text-sm py-3"
            />
            <button type="submit" className="btn-primary py-3 px-5 text-xs">
              Check
            </button>
          </form>
        }
      />
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-muted">Verifying subscription…</p>
      </div>
    );
  }

  // Subscribed ✓
  if (subscribed) {
    return <>{children}</>;
  }

  // Not subscribed — paywall
  return (
    <GateUI
      label={label}
      body={`${email} does not have an active subscription. Subscribe to unlock daily intelligence briefings and full premium content access.`}
      action={
        <div className="flex flex-wrap gap-3">
          <Link href="/subscribe" className="btn-primary py-3 px-6 text-xs">
            Subscribe from $15/mo →
          </Link>
          <button
            onClick={() => setEmail("")}
            className="text-[0.68rem] tracking-[0.1em] uppercase text-muted hover:text-sand transition-colors"
          >
            Try different email
          </button>
        </div>
      }
    />
  );
}

function GateUI({
  label,
  body,
  action,
}: {
  label: string;
  body: string;
  action: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden">
      {/* Blurred preview strip */}
      <div className="h-32 bg-gradient-to-b from-transparent to-ink2 pointer-events-none select-none" />

      {/* Gate card */}
      <div className="border border-cyan/15 bg-spaceMid/80 backdrop-blur-md p-8 md:p-10 text-center max-w-lg mx-auto my-8">
        <div className="relative w-14 h-14 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-cyan/8 border border-cyan/20" />
          <span className="relative text-2xl text-cyan">🔒</span>
        </div>
        <p className="text-[0.62rem] tracking-[0.2em] uppercase text-cyan font-mono mb-3">
          Premium Content
        </p>
        <h3 className="font-display font-700 text-xl text-sand mb-3">{label} is for subscribers.</h3>
        <p className="text-sm text-muted leading-relaxed mb-7">{body}</p>
        {action}
      </div>
    </div>
  );
}