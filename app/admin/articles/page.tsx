"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getStoredArticles, deleteArticle } from "@/lib/adminStore";
import { Article, formatDate } from "@/lib/data";
import Link from "next/link";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch]     = useState("");
  const [confirm, setConfirm]   = useState<string | null>(null);
  const [toast, setToast]       = useState("");

  useEffect(() => { setArticles(getStoredArticles()); }, []);

  function handleDelete(slug: string) {
    const updated = deleteArticle(slug);
    setArticles(updated);
    setConfirm(null);
    showToast("Article deleted.");
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell>
      <div className="px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-sand font-medium">Articles</h1>
            <p className="text-sm text-muted mt-1">{articles.length} total articles</p>
          </div>
          <Link href="/admin/articles/new" className="px-5 py-2.5 bg-gold text-ink text-[0.72rem] tracking-[0.12em] uppercase font-medium hover:bg-gold2 transition-colors">
            + New Article
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6 relative max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs">⌕</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full bg-white/4 border border-white/8 pl-8 pr-4 py-2.5 text-sm text-sand placeholder:text-muted/40 outline-none focus:border-gold/40 transition-colors"
          />
        </div>

        {/* Table */}
        <div className="border border-white/6">
          {/* Head */}
          <div className="grid grid-cols-[1fr_140px_110px_120px] px-5 py-2.5 border-b border-white/6 bg-white/2">
            {["Title", "Category", "Date", "Actions"].map((h) => (
              <span key={h} className="text-[0.62rem] tracking-[0.18em] uppercase text-muted font-medium">{h}</span>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {filtered.map((article) => (
              <div key={article.slug} className="grid grid-cols-[1fr_140px_110px_120px] px-5 py-4 hover:bg-white/2 transition-colors items-center group">
                <div className="min-w-0 pr-4">
                  <p className="text-sm text-sand truncate font-medium">{article.title}</p>
                  <p className="text-[0.68rem] text-muted/60 truncate mt-0.5">{article.summary.slice(0, 70)}...</p>
                </div>
                <span className="text-[0.6rem] tracking-[0.15em] uppercase text-gold border border-gold/25 px-2 py-0.5 w-fit">
                  {article.category}
                </span>
                <span className="text-[0.68rem] text-muted font-mono">{formatDate(article.date)}</span>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/articles/edit?slug=${article.slug}`}
                    className="text-[0.65rem] tracking-[0.1em] uppercase text-muted hover:text-gold transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setConfirm(article.slug)}
                    className="text-[0.65rem] tracking-[0.1em] uppercase text-muted hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                  <Link
                    href={`/insights/${article.slug}`}
                    target="_blank"
                    className="text-[0.65rem] text-muted/40 hover:text-muted transition-colors"
                  >
                    ↗
                  </Link>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="px-5 py-12 text-sm text-muted text-center">No articles found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirm modal */}
      {confirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] border border-white/10 p-7 max-w-sm w-full">
            <h3 className="font-display text-xl text-sand mb-2">Delete article?</h3>
            <p className="text-sm text-muted mb-6">This action cannot be undone. The article will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirm)} className="px-5 py-2 bg-red-500/80 text-white text-[0.72rem] tracking-[0.1em] uppercase font-medium hover:bg-red-500 transition-colors">
                Yes, delete
              </button>
              <button onClick={() => setConfirm(null)} className="px-5 py-2 border border-white/10 text-muted text-[0.72rem] tracking-[0.1em] uppercase font-medium hover:text-sand transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-900 border border-emerald-700 text-emerald-200 text-sm px-5 py-3 z-50 font-mono">
          ✓ {toast}
        </div>
      )}
    </AdminShell>
  );
}