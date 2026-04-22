"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { supabase } from "@/lib/supabase";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  active: boolean;
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [confirm,     setConfirm]     = useState<string | null>(null);
  const [toast,       setToast]       = useState<{ msg: string; type: "success" | "error" }>({ msg: "", type: "success" });

  async function fetchSubscribers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });
    if (error) showToast("Failed to load: " + error.message, "error");
    else setSubscribers(data as Subscriber[]);
    setLoading(false);
  }

  useEffect(() => { fetchSubscribers(); }, []);

  async function handleDelete(id: string) {
    const { error } = await supabase.from("subscribers").delete().eq("id", id);
    if (error) showToast("Error removing: " + error.message, "error");
    else { setSubscribers((p) => p.filter((s) => s.id !== id)); showToast("Subscriber removed."); }
    setConfirm(null);
  }

  async function handleExportCSV() {
    const rows = [["Email", "Subscribed At", "Active"], ...subscribers.map((s) => [s.email, fmt(s.subscribed_at), s.active ? "Yes" : "No"])];
    const csv  = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `ans-subscribers-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 4000);
  }

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );
  const active = subscribers.filter((s) => s.active).length;

  return (
    <AdminShell>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#e8f4f8", letterSpacing: "0.02em", margin: 0 }}>
            Subscribers
          </h1>
          <p style={{ fontSize: 12, color: "#7a9bb5", marginTop: 4 }}>
            {loading ? "Loading…" : `${subscribers.length} total · ${active} active`}
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
          style={{ padding: "10px 20px", background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.25)", color: "#00d4ff", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 4, cursor: "pointer" }}
        >
          ↓ Export CSV
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Subscribers", value: subscribers.length, color: "#00d4ff" },
          { label: "Active",            value: active,             color: "#4ade80" },
          { label: "This Month",        value: subscribers.filter((s) => new Date(s.subscribed_at).getMonth() === new Date().getMonth()).length, color: "#f59e0b" },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "#0a0f1a", border: "1px solid #1a3a5c", borderRadius: 4, padding: "16px 20px" }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: stat.color, margin: 0, lineHeight: 1 }}>{stat.value}</p>
            <p style={{ fontSize: 11, color: "#7a9bb5", marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16, position: "relative", maxWidth: 320 }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#3d5a73", fontSize: 14 }}>⌕</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email…"
          style={{ width: "100%", background: "#0d1b2e", border: "1px solid #1a3a5c", color: "#e8f4f8", padding: "10px 14px 10px 34px", fontSize: 13, borderRadius: 4, outline: "none", boxSizing: "border-box" }}
        />
      </div>

      {/* Table */}
      <div style={{ border: "1px solid #1a3a5c", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 80px 100px", padding: "10px 16px", background: "#080d18", borderBottom: "1px solid #1a3a5c" }}>
          {["Email", "Subscribed At", "Status", "Actions"].map((h) => (
            <span key={h} style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(122,155,181,0.5)", fontWeight: 600 }}>{h}</span>
          ))}
        </div>

        {/* Loading */}
        {loading && [...Array(5)].map((_, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 180px 80px 100px", padding: "14px 16px", borderBottom: "1px solid #0d2035" }}>
            <div style={{ height: 10, background: "#1a3a5c", borderRadius: 3, width: "55%" }} />
            <div style={{ height: 10, background: "#1a3a5c", borderRadius: 3, width: "70%" }} />
            <div style={{ height: 10, background: "#1a3a5c", borderRadius: 3, width: "40%" }} />
            <div style={{ height: 10, background: "#1a3a5c", borderRadius: 3, width: "30%" }} />
          </div>
        ))}

        {/* Rows */}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#7a9bb5" }}>
              {search ? "No subscribers match your search." : "No subscribers yet. Share your newsletter!"}
            </p>
          </div>
        )}

        {!loading && filtered.map((s) => (
          <div key={s.id}
            style={{ display: "grid", gridTemplateColumns: "1fr 180px 80px 100px", padding: "12px 16px", borderBottom: "1px solid #0d2035", alignItems: "center", transition: "background 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontSize: 13, color: "#e8f4f8", fontFamily: "monospace" }}>{s.email}</span>
            <span style={{ fontSize: 11, color: "#7a9bb5", fontFamily: "monospace" }}>{fmt(s.subscribed_at)}</span>
            <span style={{
              fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
              color: s.active ? "#4ade80" : "#7a9bb5",
              border: `1px solid ${s.active ? "rgba(74,222,128,0.25)" : "#1a3a5c"}`,
              padding: "2px 8px", borderRadius: 2,
              background: s.active ? "rgba(74,222,128,0.06)" : "transparent",
              width: "fit-content",
            }}>
              {s.active ? "Active" : "Off"}
            </span>
            <button
              onClick={() => setConfirm(s.id)}
              style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7a9bb5", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7a9bb5")}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 10, color: "rgba(122,155,181,0.25)", fontFamily: "monospace", marginTop: 8 }}>
        ↳ supabase · table: subscribers · ordered by subscribed_at desc
      </p>

      {/* Delete confirm */}
      {confirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#0d1b2e", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 8, padding: 32, maxWidth: 400, width: "90%" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#e8f4f8", marginBottom: 8 }}>Remove subscriber?</h3>
            <p style={{ fontSize: 13, color: "#7a9bb5", lineHeight: 1.6, marginBottom: 24 }}>
              This permanently removes them from the database. They will no longer receive briefings.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => handleDelete(confirm)} style={{ padding: "10px 24px", background: "#dc2626", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, borderRadius: 4, cursor: "pointer" }}>
                Yes, remove
              </button>
              <button onClick={() => setConfirm(null)} style={{ padding: "10px 24px", background: "none", border: "1px solid #1a3a5c", color: "#7a9bb5", fontSize: 13, borderRadius: 4, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.msg && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200, padding: "12px 20px", borderRadius: 4, fontSize: 13, fontFamily: "monospace", background: toast.type === "error" ? "#450a0a" : "#0d1b2e", border: toast.type === "error" ? "1px solid rgba(248,113,113,0.4)" : "1px solid rgba(0,212,255,0.3)", color: toast.type === "error" ? "#f87171" : "#00d4ff" }}>
          {toast.type === "error" ? "✗" : "✓"} {toast.msg}
        </div>
      )}
    </AdminShell>
  );
}