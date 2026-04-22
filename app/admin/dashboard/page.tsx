"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import Link from "next/link";

interface Article { slug: string; title: string; category: string; date: string; }
interface Report  { id: string;   title: string; date: string; file_url?: string; }

export default function DashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [reports,  setReports]  = useState<Report[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/articles").then((r) => r.json()),
      fetch("/api/reports").then((r)  => r.json()),
    ]).then(([art, rep]) => {
      setArticles(Array.isArray(art) ? art : []);
      setReports(Array.isArray(rep)  ? rep : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const recent = [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const recentReports = [...reports]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const categories = [...new Set(articles.map((a) => a.category))];

  function fmt(d: string) {
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  const statCards = [
    { label: "Total Insights",   value: loading ? "—" : articles.length,   icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      ), color: "text-cyan", border: "border-cyan/20", glow: "rgba(0,212,255,0.06)" },
    { label: "Total Reports",    value: loading ? "—" : reports.length,    icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
      ), color: "text-blueLight", border: "border-blueLight/20", glow: "rgba(74,158,255,0.06)" },
    { label: "Categories",       value: loading ? "—" : categories.length, icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      ), color: "text-gold",      border: "border-gold/20",      glow: "rgba(240,165,0,0.06)" },
    { label: "Data Source",      value: "Supabase",                         icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
      ), color: "text-cyan/60",   border: "border-cyan/10",       glow: "rgba(0,212,255,0.03)" },
  ];

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-700 text-2xl text-sand tracking-wide">Dashboard</h1>
        <p className="text-xs text-muted mt-1">Overview of your content and Supabase data.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="border rounded-sm px-5 py-4 relative overflow-hidden" style={{ background: s.glow, borderColor: s.border.replace("border-", "") }}>
            <div className={`mb-3 ${s.color} opacity-60`}>{s.icon}</div>
            <p className={`font-display font-700 text-3xl mb-1 ${s.color}`}>
              {loading && s.label !== "Data Source" ? (
                <span className="inline-block w-8 h-7 bg-white/5 rounded animate-pulse" />
              ) : s.value}
            </p>
            <p className="text-[0.62rem] tracking-[0.14em] uppercase text-muted/70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-cyan/6">
        <Link href="/admin/insights/new" className="btn-primary text-xs py-2 px-4">
          + New Insight
        </Link>
        <Link href="/admin/reports" className="btn-outline text-xs py-2 px-4">
          + Add Report
        </Link>
        <Link href="/insights" target="_blank" className="flex items-center gap-1.5 px-4 py-2 border border-white/8 text-muted text-[0.68rem] tracking-[0.1em] uppercase font-medium hover:text-sand transition-colors">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Live site
        </Link>
      </div>

      {/* Two-column content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Recent Insights — wider */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-600 text-sm text-sand tracking-wider uppercase">Recent Insights</h2>
            <Link href="/admin/insights" className="text-[0.62rem] tracking-[0.1em] uppercase text-muted hover:text-cyan transition-colors">
              Manage all →
            </Link>
          </div>
          <div className="border border-cyan/8 rounded-sm overflow-hidden">
            {loading ? (
              <div className="divide-y divide-white/4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-3 animate-pulse">
                    <div className="h-2 w-16 bg-white/5 rounded" />
                    <div className="h-2 flex-1 bg-white/5 rounded" />
                    <div className="h-2 w-20 bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-xs text-muted">No insights yet.</p>
                <Link href="/admin/insights/new" className="text-cyan text-xs mt-2 inline-block hover:underline">Create your first →</Link>
              </div>
            ) : (
              <div className="divide-y divide-cyan/5">
                {recent.map((a) => (
                  <div key={a.slug} className="flex items-center justify-between px-4 py-3 hover:bg-cyan/3 transition-colors group">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[0.55rem] tracking-[0.14em] uppercase text-cyan border border-cyan/25 px-1.5 py-0.5 shrink-0 bg-cyan/5">{a.category}</span>
                      <p className="text-xs text-sand truncate">{a.title}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="text-[0.62rem] text-muted font-mono hidden md:block">{fmt(a.date)}</span>
                      <Link href={`/admin/insights/${a.id}`} className="text-[0.6rem] tracking-[0.08em] uppercase text-muted hover:text-cyan transition-colors opacity-0 group-hover:opacity-100">
                        Edit →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Reports — narrower */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-600 text-sm text-sand tracking-wider uppercase">Recent Reports</h2>
            <Link href="/admin/reports" className="text-[0.62rem] tracking-[0.1em] uppercase text-muted hover:text-cyan transition-colors">
              Manage →
            </Link>
          </div>
          <div className="border border-cyan/8 rounded-sm overflow-hidden">
            {loading ? (
              <div className="divide-y divide-white/4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="px-4 py-3 animate-pulse">
                    <div className="h-2 w-3/4 bg-white/5 rounded mb-1.5" />
                    <div className="h-2 w-1/3 bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            ) : recentReports.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-xs text-muted">No reports yet.</p>
                <Link href="/admin/reports" className="text-cyan text-xs mt-2 inline-block hover:underline">Add first report →</Link>
              </div>
            ) : (
              <div className="divide-y divide-cyan/5">
                {recentReports.map((r) => (
                  <div key={r.id} className="px-4 py-3 hover:bg-cyan/3 transition-colors group">
                    <p className="text-xs text-sand truncate mb-1">{r.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[0.62rem] text-muted font-mono">{fmt(r.date)}</span>
                      {r.file_url ? (
                        <a href={r.file_url} target="_blank" rel="noreferrer" className="text-[0.6rem] tracking-[0.08em] uppercase text-cyan/60 hover:text-cyan transition-colors">PDF ↗</a>
                      ) : (
                        <span className="text-[0.6rem] text-muted/30">No file</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}