"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getStoredArticles, getStoredReports } from "@/lib/adminStore";
import { Article, Report, formatDate } from "@/lib/data";
import Link from "next/link";
import CreateReport from "@/components/admin/CreateReport";
export default function DashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [reports, setReports]   = useState<Report[]>([]);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then(setArticles);
  
    fetch("/api/reports")
      .then((res) => res.json())
      .then(setReports);
  }, []);
  const categories = [...new Set(articles.map((a) => a.category))];
  const recent = [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const stats = [
    { label: "Total Articles",  value: articles.length,   color: "text-gold" },
    { label: "Total Reports",   value: reports.length,    color: "text-emerald-400" },
    { label: "Categories",      value: categories.length, color: "text-blue-400" },
  ];

  return (
    <AdminShell>
      <div className="px-8 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-sand font-medium">Dashboard</h1>
          <p className="text-sm text-muted mt-1">Overview of your content and recent activity.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/3 border border-white/6 px-6 py-5">
              <p className={`font-display text-4xl font-medium mb-1 ${s.color}`}>{s.value}</p>
              <p className="text-[0.68rem] tracking-[0.15em] uppercase text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="flex gap-3 mb-10">
          <Link href="/admin/articles/new" className="px-5 py-2.5 bg-gold text-ink text-[0.72rem] tracking-[0.12em] uppercase font-medium hover:bg-gold2 transition-colors">
            + New Insight
          </Link>
          <Link href="/admin/reports" className="px-5 py-2.5 border border-white/10 text-sand text-[0.72rem] tracking-[0.12em] uppercase font-medium hover:border-gold/30 hover:text-gold transition-colors">
            Manage Reports
          </Link>
          <Link href="/insights" target="_blank" className="px-5 py-2.5 border border-white/10 text-muted text-[0.72rem] tracking-[0.12em] uppercase font-medium hover:text-sand transition-colors">
            ↗ View Live Site
          </Link>
        </div>

        {/* Recent articles */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-sand font-medium">Recent Insights</h2>
            <Link href="/admin/articles" className="text-[0.68rem] tracking-[0.12em] uppercase text-muted hover:text-gold transition-colors">
              Manage all →
            </Link>
          </div>
          <div className="border border-white/6 divide-y divide-white/5">
            {recent.map((article) => (
              <div key={article.slug} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/2 transition-colors group">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-[0.6rem] tracking-[0.15em] uppercase text-gold border border-gold/25 px-2 py-0.5 shrink-0">
                    {article.category}
                  </span>
                  <p className="text-sm text-sand truncate">{article.title}</p>
                </div>
                <div className="flex items-center gap-5 shrink-0 ml-4">
                  <span className="text-[0.68rem] text-muted font-mono hidden md:block">{formatDate(article.date)}</span>
                  <Link href={`/admin/articles/edit?slug=${article.slug}`} className="text-[0.65rem] tracking-[0.1em] uppercase text-muted hover:text-gold transition-colors opacity-0 group-hover:opacity-100">
                    Edit →
                  </Link>
                </div>
              </div>
            ))}
            {recent.length === 0 && (
              <p className="px-5 py-10 text-sm text-muted text-center">No articles yet. Create your first one above.</p>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}