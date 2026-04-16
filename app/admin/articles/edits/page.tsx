"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getStoredArticles, updateArticle } from "@/lib/adminStore";
import { Article } from "@/lib/data";
import Link from "next/link";

const CATEGORIES = ["Elections", "Misinformation", "Technology", "Policy", "Conflict", "Media", "Research"];

export default function EditArticlePage() {
  const router    = useRouter();
  const params    = useSearchParams();
  const slug      = params.get("slug") ?? "";
  const [saving, setSaving]  = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState<Article | null>(null);

  useEffect(() => {
    const articles = getStoredArticles();
    const found = articles.find((a) => a.slug === slug);
    if (found) setForm(found);
    else setNotFound(true);
  }, [slug]);

  function set(key: keyof Article, val: string) {
    setForm((f) => f ? { ...f, [key]: val } : f);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setTimeout(() => {
      updateArticle(slug, form);
      router.push("/admin/articles");
    }, 400);
  }

  if (notFound) return (
    <AdminShell>
      <div className="px-8 py-16 text-center">
        <p className="font-display text-2xl text-muted italic mb-4">Article not found</p>
        <Link href="/admin/articles" className="text-gold hover:text-gold2 text-sm">← Back to articles</Link>
      </div>
    </AdminShell>
  );

  if (!form) return (
    <AdminShell>
      <div className="px-8 py-16 text-center">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    </AdminShell>
  );

  return (
    <AdminShell>
      <div className="px-8 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin/articles" className="text-muted hover:text-sand transition-colors text-sm">← Articles</Link>
          <span className="text-white/20">/</span>
          <h1 className="font-display text-2xl text-sand font-medium">Edit Article</h1>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-2 font-mono">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="w-full bg-white/4 border border-white/8 px-4 py-3 text-sm text-sand outline-none focus:border-gold/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-2 font-mono">Summary *</label>
            <textarea
              required
              rows={3}
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              className="w-full bg-white/4 border border-white/8 px-4 py-3 text-sm text-sand outline-none focus:border-gold/50 transition-colors resize-none"
            />
          </div>

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
                className="w-full bg-white/4 border border-white/8 px-4 py-3 text-sm text-sand outline-none focus:border-gold/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-2 font-mono">
              Body <span className="text-muted/40 normal-case">(HTML: &lt;h2&gt;, &lt;p&gt;, &lt;blockquote&gt;)</span>
            </label>
            <textarea
              rows={16}
              value={form.body ?? ""}
              onChange={(e) => set("body", e.target.value)}
              className="w-full bg-white/4 border border-white/8 px-4 py-3 text-sm text-sand outline-none focus:border-gold/50 transition-colors resize-y font-mono leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-4 pt-2 border-t border-white/6">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gold text-ink text-[0.72rem] tracking-[0.15em] uppercase font-medium hover:bg-gold2 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link href="/admin/articles" className="text-[0.72rem] tracking-[0.12em] uppercase text-muted hover:text-sand transition-colors">
              Cancel
            </Link>
            <Link
              href={`/insights/${slug}`}
              target="_blank"
              className="ml-auto text-[0.68rem] text-muted/40 hover:text-muted transition-colors"
            >
              ↗ Preview live
            </Link>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}