"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Article {
  id:        string;
  slug:      string;
  title:     string;
  summary:   string;
  category:  string;
  date:      string;
  read_time?: string;
  body?:     string;
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminInsightsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [confirm,  setConfirm]  = useState<string | null>(null);
  const [toast,    setToast]    = useState<{ msg: string; type: "success" | "error" }>({ msg: "", type: "success" });

  async function fetchArticles() {
    setLoading(true);
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("date", { ascending: false });
    if (error) showToast("Failed to load: " + error.message, "error");
    else setArticles((data as Article[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchArticles(); }, []);

  async function handleDelete(id: string) {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) showToast("Error deleting: " + error.message, "error");
    else { showToast("Insight deleted."); setArticles((p) => p.filter((a) => a.id !== id)); }
    setConfirm(null);
  }

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 4000);
  }

  const filtered = articles.filter(
    (a) => a.title.toLowerCase().includes(search.toLowerCase()) ||
           a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#e8f4f8", margin: 0, letterSpacing: "0.02em" }}>Insights</h1>
          <p style={{ fontSize: 12, color: "#7a9bb5", marginTop: 4 }}>
            {loading ? "Loading from Supabase…" : `${articles.length} article${articles.length !== 1 ? "s" : ""} in database`}
          </p>
        </div>
        <Link href="/admin/insights/new"
          style={{ padding: "10px 20px", background: "linear-gradient(135deg, #00d4ff, #1a6fe8)", color: "#060a12", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 4, textDecoration: "none", display: "inline-block" }}>
          + New Insight
        </Link>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20, position: "relative", maxWidth: 320 }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#3d5a73", fontSize: 14 }}>⌕</span>
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or category…"
          style={{ width: "100%", background: "#0d1b2e", border: "1px solid #1a3a5c", color: "#e8f4f8", padding: "10px 14px 10px 36px", fontSize: 13, borderRadius: 4, outline: "none", boxSizing: "border-box" }}
        />
      </div>

      {/* Table */}
      <div style={{ border: "1px solid #1a3a5c", borderRadius: 4, overflow: "hidden" }}>
        {/* Head */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 110px 140px", padding: "10px 16px", background: "#080d18", borderBottom: "1px solid #1a3a5c" }}>
          {["Title", "Category", "Date", "Actions"].map((h) => (
            <span key={h} style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(122,155,181,0.5)", fontWeight: 600 }}>{h}</span>
          ))}
        </div>

        {/* Loading skeletons */}
        {loading && [...Array(5)].map((_, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 130px 110px 140px", padding: "14px 16px", borderBottom: "1px solid #0d2035" }}>
            {[...Array(4)].map((__, j) => (
              <div key={j} style={{ height: 10, background: "#1a3a5c", borderRadius: 3, width: j === 0 ? "70%" : "50%" }} />
            ))}
          </div>
        ))}

        {/* Rows */}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#7a9bb5", marginBottom: 8 }}>
              {search ? "No articles match your search." : "No insights yet."}
            </p>
            {!search && (
              <Link href="/admin/insights/new" style={{ fontSize: 12, color: "#00d4ff", textDecoration: "underline" }}>
                Create your first insight →
              </Link>
            )}
          </div>
        )}

        {!loading && filtered.map((article) => (
          <div key={article.id}
            style={{ display: "grid", gridTemplateColumns: "1fr 130px 110px 140px", padding: "13px 16px", borderBottom: "1px solid #0d2035", alignItems: "center", transition: "background 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>

            <div style={{ minWidth: 0, paddingRight: 16 }}>
              <p style={{ fontSize: 12, color: "#e8f4f8", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {article.title}
              </p>
              <p style={{ fontSize: 11, color: "rgba(122,155,181,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
                {article.summary?.slice(0, 65)}…
              </p>
            </div>

            <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)", padding: "2px 8px", borderRadius: 2, background: "rgba(0,212,255,0.05)", whiteSpace: "nowrap", width: "fit-content" }}>
              {article.category}
            </span>

            <span style={{ fontSize: 11, color: "#7a9bb5", fontFamily: "monospace" }}>
              {fmt(article.date)}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link href={`/admin/insights/${article.id}`}
                style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7a9bb5", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a9bb5")}>
                Edit
              </Link>
              <button onClick={() => setConfirm(article.id)}
                style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7a9bb5", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a9bb5")}>
                Delete
              </button>
              <Link href={`/insights/${article.slug}`} target="_blank"
                style={{ fontSize: 11, color: "rgba(122,155,181,0.3)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#7a9bb5")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(122,155,181,0.3)")}>
                ↗
              </Link>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 10, color: "rgba(122,155,181,0.25)", fontFamily: "monospace", marginTop: 8 }}>
        ↳ supabase · table: articles · ordered by date desc
      </p>

      {/* Delete confirm modal */}
      {confirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#0d1b2e", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 8, padding: 32, maxWidth: 400, width: "90%" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#e8f4f8", marginBottom: 8 }}>Delete insight?</h3>
            <p style={{ fontSize: 13, color: "#7a9bb5", lineHeight: 1.6, marginBottom: 24 }}>
              This permanently removes the record from Supabase and cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => handleDelete(confirm)}
                style={{ padding: "10px 24px", background: "#dc2626", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, borderRadius: 4, cursor: "pointer" }}>
                Yes, delete
              </button>
              <button onClick={() => setConfirm(null)}
                style={{ padding: "10px 24px", background: "none", border: "1px solid #1a3a5c", color: "#7a9bb5", fontSize: 13, borderRadius: 4, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.msg && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 200,
          padding: "12px 20px", borderRadius: 4, fontSize: 13, fontFamily: "monospace",
          background: toast.type === "error" ? "#450a0a" : "#0d1b2e",
          border: toast.type === "error" ? "1px solid rgba(248,113,113,0.4)" : "1px solid rgba(0,212,255,0.3)",
          color: toast.type === "error" ? "#f87171" : "#00d4ff",
        }}>
          {toast.type === "error" ? "✗" : "✓"} {toast.msg}
        </div>
      )}
    </AdminShell>
  );
}