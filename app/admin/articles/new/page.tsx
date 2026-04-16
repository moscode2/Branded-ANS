"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { addArticle } from "@/lib/adminStore";
import { Article } from "@/lib/data";
import Link from "next/link";

const CATEGORIES = ["Elections", "Misinformation", "Technology", "Policy", "Conflict", "Media", "Research"];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", summary: "", category: "Elections",
    date: new Date().toISOString().split("T")[0],
    readTime: "5 min read", body: "",
  });

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const article: Article = {
      slug: slugify(form.title),
      title: form.title,
      summary: form.summary,
      category: form.category,
      date: form.date,
      readTime: form.readTime,
      body: form.body,
    };
    setTimeout(() => {
      addArticle(article);
      router.push("/admin/articles");
    }, 400);
  }

  return (
    <AdminShell>
      <div className="px-8 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin/articles" className="text-muted hover:text-sand transition-colors text-sm">← Articles</Link>
          <span className="text-white/20">/</span>
          <h1 className="font-display text-2xl text-sand font-medium">New Article</h1>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {/* Title */}
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-2 font-mono">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Disinformation Trends in East Africa 2025"
              className="w-full bg-white/4 border border-white/8 px-4 py-3 text-sm text-sand placeholder:text-muted/30 outline-none focus:border-gold/50 transition-colors"
            />
            {form.title && (
              <p className="text-[0.62rem] text-muted/50 mt-1.5 font-mono">Slug: {slugify(form.title)}</p>
            )}
          </div>

          {/* Summary */}
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-2 font-mono">Summary * <span className="text-muted/40 normal-case">(shown on cards)</span></label>
            <textarea
              required
              rows={3}
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              placeholder="A concise 1–2 sentence summary of the article..."
              className="w-full bg-white/4 border border-white/8 px-4 py-3 text-sm text-sand placeholder:text-muted/30 outline-none focus:border-gold/50 transition-colors resize-none"
            />
          </div>

          {/* Row: category / date / read time */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-2 font-mono">Category</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full bg-white/4 border border-white/8 px-4 py-3 text-sm text-sand outline-none focus:border-gold/50 transition-colors"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-2 font-mono">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className="w-full bg-white/4 border border-white/8 px-4 py-3 text-sm text-sand outline-none focus:border-gold/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-2 font-mono">Read Time</label>
              <input
                value={form.readTime}
                onChange={(e) => set("readTime", e.target.value)}
                placeholder="8 min read"
                className="w-full bg-white/4 border border-white/8 px-4 py-3 text-sm text-sand placeholder:text-muted/30 outline-none focus:border-gold/50 transition-colors"
              />
            </div>
          </div>

          {/* Body */}
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-2 font-mono">
              Body <span className="text-muted/40 normal-case">(HTML supported: &lt;h2&gt;, &lt;p&gt;, &lt;blockquote&gt;)</span>
            </label>
            <textarea
              rows={16}
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              placeholder={"<h2>Introduction</h2>\n<p>Your content here...</p>\n<blockquote>A key quote...</blockquote>"}
              className="w-full bg-white/4 border border-white/8 px-4 py-3 text-sm text-sand placeholder:text-muted/20 outline-none focus:border-gold/50 transition-colors resize-y font-mono leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2 border-t border-white/6">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gold text-ink text-[0.72rem] tracking-[0.15em] uppercase font-medium hover:bg-gold2 transition-colors disabled:opacity-50"
            >
              {saving ? "Publishing..." : "Publish Article"}
            </button>
            <Link href="/admin/articles" className="text-[0.72rem] tracking-[0.12em] uppercase text-muted hover:text-sand transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}