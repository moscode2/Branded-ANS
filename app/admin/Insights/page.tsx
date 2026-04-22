"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Article {
  id?:      string;
  slug:     string;
  title:    string;
  summary:  string;
  category: string;
  date:     string;
  read_time?: string;
  body?:    string;
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
    const { data, error } = await supabase.from("articles").select("*").order("date", { ascending: false });
    if (error) showToast("Failed to load: " + error.message, "error");
    else setArticles(data as Article[]);
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
    (a) => a.title.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-700 text-2xl text-sand tracking-wide">Insights</h1>
          <p className="text-xs text-muted mt-1">
            {loading ? "Loading from Supabase…" : `${articles.length} article${articles.length !== 1 ? "s" : ""} in database`}
          </p>
        </div>
        <Link href="/admin/insights/new" className="btn-primary text-xs py-2.5 px-5">
          + New Insight
        </Link>
      </div>

      {/* Search */}
      <div className="mb-5 relative max-w-xs">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/50 text-xs">⌕</span>
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or category…"
          className="w-full bg-spaceMid border border-cyan/12 pl-8 pr-4 py-2.5 text-xs text-sand placeholder:text-muted/30 outline-none focus:border-cyan/35 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="border border-cyan/8 rounded-sm overflow-hidden">
        {/* Head */}
        <div className="grid grid-cols-[1fr_130px_110px_130px] px-4 py-2.5 border-b border-cyan/8" style={{ background: "#080d18" }}>
          {["Title", "Category", "Date", "Actions"].map((h) => (
            <span key={h} className="text-[0.58rem] tracking-[0.18em] uppercase text-muted/60 font-semibold">{h}</span>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="divide-y divide-cyan/4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-[1fr_130px_110px_130px] px-4 py-3.5 animate-pulse">
                <div className="h-2.5 bg-white/5 rounded w-2/3" />
                <div className="h-2.5 bg-white/5 rounded w-1/2" />
                <div className="h-2.5 bg-white/5 rounded w-1/3" />
                <div className="h-2.5 bg-white/5 rounded w-1/4" />
              </div>
            ))}
          </div>
        )}

        {/* Rows */}
        {!loading && (
          <div className="divide-y divide-cyan/4">
            {filtered.map((article) => (
              <div key={article.id ?? article.slug} className="grid grid-cols-[1fr_130px_110px_130px] px-4 py-3.5 hover:bg-cyan/3 transition-colors items-center group">
                <div className="min-w-0 pr-4">
                  <p className="text-xs text-sand truncate font-medium">{article.title}</p>
                  <p className="text-[0.65rem] text-muted/50 truncate mt-0.5">{article.summary?.slice(0, 60)}…</p>
                </div>
                <span className="text-[0.58rem] tracking-[0.14em] uppercase text-cyan border border-cyan/20 px-2 py-0.5 w-fit bg-cyan/5">
                  {article.category}
                </span>
                <span className="text-[0.65rem] text-muted font-mono">{fmt(article.date)}</span>
                <div className="flex items-center gap-3">
                  <Link href={`/admin/insights/${article.id}`} className="text-[0.62rem] tracking-[0.08em] uppercase text-muted hover:text-cyan transition-colors">
                    Edit
                  </Link>
                  <button onClick={() => setConfirm(article.id ?? article.slug)} className="text-[0.62rem] tracking-[0.08em] uppercase text-muted hover:text-red-400 transition-colors">
                    Delete
                  </button>
                  <Link href={`/insights/${article.slug}`} target="_blank" className="text-[0.62rem] text-muted/30 hover:text-muted transition-colors">
                    ↗
                  </Link>
                </div>
              </div>
            ))}
            {filtered.length === 0 && !loading && (
              <div className="px-5 py-14 text-center">
                <p className="text-xs text-muted">
                  {search ? "No articles match your search." : "No insights yet."}
                </p>
                {!search && <Link href="/admin/insights/new" className="text-cyan text-xs mt-2 inline-block hover:underline">Create first insight →</Link>}
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-[0.58rem] text-muted/25 font-mono mt-2">↳ supabase · table: articles · ordered by date desc</p>

      {/* Delete modal */}
      {confirm && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <div className="border border-cyan/15 p-7 max-w-sm w-full rounded-sm" style={{ background: "#0d1b2e" }}>
            <h3 className="font-display font-700 text-lg text-sand mb-2 tracking-wide">Delete insight?</h3>
            <p className="text-xs text-muted mb-6 leading-relaxed">This permanently removes the record from Supabase and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirm)} className="px-5 py-2 bg-red-500/80 text-white text-[0.68rem] tracking-[0.1em] uppercase font-semibold hover:bg-red-500 transition-colors">
                Yes, delete
              </button>
              <button onClick={() => setConfirm(null)} className="px-5 py-2 border border-cyan/15 text-muted text-[0.68rem] tracking-[0.1em] uppercase font-medium hover:text-sand transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.msg && (
        <div className={`fixed bottom-6 right-6 border text-xs px-5 py-3 z-50 font-mono rounded-sm ${
          toast.type === "error" ? "bg-red-950 border-red-700/50 text-red-300" : "bg-spaceMid border-cyan/30 text-cyan"
        }`}>
          {toast.type === "error" ? "✗" : "✓"} {toast.msg}
        </div>
      )}
    </AdminShell>
  );
}