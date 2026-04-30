"use client";
import { useState, useEffect, useCallback } from "react";

export type SubscriptionStatus = {
  subscribed: boolean;
  status: "active" | "past_due" | "cancelled" | null;
  plan_id: string | null;
  subscribed_at: string | null;
  loading: boolean;
};

export function useSubscription(email: string | null): SubscriptionStatus {
  const [state, setState] = useState<SubscriptionStatus>({
    subscribed:    false,
    status:        null,
    plan_id:       null,
    subscribed_at: null,
    loading:       false,
  });

  const check = useCallback(async () => {
    if (!email) {
      setState((s) => ({ ...s, subscribed: false, status: null, loading: false }));
      return;
    }
    setState((s) => ({ ...s, loading: true }));
    try {
      const res  = await fetch(`/api/subscribe/status?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setState({
        subscribed:    data.subscribed ?? false,
        status:        data.status ?? null,
        plan_id:       data.plan_id ?? null,
        subscribed_at: data.subscribed_at ?? null,
        loading:       false,
      });
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  }, [email]);

  useEffect(() => {
    check();
  }, [check]);

  return state;
}