"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, isAuthenticated } from "@/lib/adminStore";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.replace("/admin/dashboard");
  }, [router]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    setTimeout(() => {
      if (login(password)) router.push("/admin/dashboard");
      else { setError("Incorrect password. Please try again."); setLoading(false); }
    }, 500);
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, background: "#060a12", fontFamily: "'DM Sans', system-ui, sans-serif",
      position: "relative",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,60,140,0.18) 0%, transparent 70%)",
      }} />

      <div style={{ width: "100%", maxWidth: 380, position: "relative" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "1px solid rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
          }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,212,255,0.05)", filter: "blur(8px)" }} />
            <span style={{ position: "relative", fontSize: 10, fontWeight: 700, color: "#00d4ff", letterSpacing: "0.1em" }}>ANS</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e8f4f8", letterSpacing: "0.05em" }}>Africa Narrative Signals</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(0,212,255,0.6)" }} />
              <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(0,212,255,0.5)", fontFamily: "monospace" }}>Admin Portal</span>
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#e8f4f8", marginBottom: 8, letterSpacing: "-0.02em" }}>Sign in</h1>
        <p style={{ fontSize: 14, color: "rgba(122,155,181,0.8)", marginBottom: 32, lineHeight: 1.6 }}>
          Enter your admin password to access the dashboard.
        </p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(122,155,181,0.6)", marginBottom: 8, fontFamily: "monospace" }}>
              Password
            </label>
            <input
              type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required autoFocus
              style={{
                width: "100%", background: "#0d1b2e", border: "1px solid #1a3a5c",
                padding: "12px 16px", fontSize: 14, color: "#e8f4f8",
                outline: "none", fontFamily: "monospace", boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(0,212,255,0.4)"}
              onBlur={(e)  => e.target.style.borderColor = "#1a3a5c"}
            />
          </div>

          {error && (
            <div style={{ fontSize: 13, color: "#f87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", padding: "10px 14px" }}>
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              marginTop: 8, width: "100%", padding: "13px",
              background: loading ? "#1a3a5c" : "linear-gradient(135deg, #00d4ff, #1a6fe8)",
              color: loading ? "#7a9bb5" : "#060a12",
              fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              border: "none", cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>

        <p style={{ fontSize: 10, color: "rgba(122,155,181,0.2)", textAlign: "center", marginTop: 40, letterSpacing: "0.15em", fontFamily: "monospace" }}>
          RESTRICTED ACCESS — AUTHORISED PERSONNEL ONLY
        </p>
      </div>
    </div>
  );
}