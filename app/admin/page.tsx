"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, isAuthenticated } from "@/lib/adminStore";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.replace("/admin/dashboard");
  }, [router]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (login(password)) {
        router.push("/admin/dashboard");
      } else {
        setError("Incorrect password. Please try again.");
        setLoading(false);
      }
    }, 600);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#080808" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 bg-emerald-900 flex items-center justify-center font-mono text-[11px] font-medium tracking-wide text-emerald-200">
            ANS
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[2px] uppercase text-sand/40">Admin Portal</p>
            <p className="font-mono text-[10px] tracking-[1px] uppercase text-sand/20">Africa Narrative Signals</p>
          </div>
        </div>

        <h1 className="font-display text-3xl text-sand font-medium mb-2">Sign in</h1>
        <p className="text-sm text-muted mb-8">Enter your admin password to access the dashboard.</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-2 font-mono">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoFocus
              className="w-full bg-white/4 border border-white/10 px-4 py-3 text-sm text-sand placeholder:text-muted/30 outline-none focus:border-gold/50 transition-colors font-mono"
            />
          </div>

          {error && (
            <p className="text-[0.75rem] text-red-400 bg-red-400/8 border border-red-400/20 px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-gold text-ink px-6 py-3 text-[0.75rem] tracking-[0.15em] uppercase font-medium hover:bg-gold2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </form>

        <p className="text-[0.65rem] text-muted/30 mt-8 text-center font-mono">
          This area is restricted to authorised personnel only.
        </p>
      </div>
    </div>
  );
}