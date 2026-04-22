"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SectionLabel from "@/components/SectionLabel";

interface Article { id: string; slug: string; title: string; summary: string; category: string; date: string; read_time?: string; body?: string; }

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function ArticlePage() {
  const params  = useParams();
  const slug    = params?.slug as string;
  const [article,  setArticle]  = useState<Article | null>(null);
  const [related,  setRelated]  = useState<Article[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase.from("articles").select("*").eq("slug", slug).single()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true); setLoading(false); return; }
        setArticle(data as Article);
        // Fetch related
        supabase.from("articles").select("*").eq("category", (data as Article).category).neq("slug", slug).limit(2)
          .then(({ data: rel }) => setRelated((rel as Article[]) ?? []));
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
        <span className="text-xs text-muted tracking-widest font-mono">Loading…</span>
      </div>
    </div>
  );

  if (notFound || !article) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-display font-700 text-2xl text-muted mb-4">Article not found</p>
        <Link href="/insights" className="text-cyan hover:underline text-sm">← Back to Insights</Link>
      </div>
    </div>
  );

  return (
    <>
      <section className="pt-36 pb-12 border-b border-cyan/5">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/insights" className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.12em] uppercase text-muted hover:text-cyan transition-colors mb-10">
            ← Back to Insights
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <span className="tag-cyan">{article.category}</span>
            <span className="text-[0.68rem] text-muted">{fmt(article.date)}</span>
            {article.read_time && <><span className="text-muted/30">·</span><span className="text-[0.68rem] text-muted">{article.read_time}</span></>}
          </div>
          <h1 className="font-display font-800 text-4xl md:text-5xl text-sand tracking-tight leading-[1.08] mb-6">{article.title}</h1>
          <p className="text-lg text-muted leading-relaxed font-display italic">{article.summary}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4">
          <span className="dot-pulse" />
          <span className="text-[0.62rem] tracking-[0.2em] uppercase text-muted/50">Africa Narrative Signals · Research Analysis</span>
        </div>
      </div>

      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-6">
          {article.body
            ? <div className="prose-ans" dangerouslySetInnerHTML={{ __html: article.body }} />
            : <div className="prose-ans"><p>Full article content appears here. Use the admin dashboard to add content to this insight.</p></div>
          }
          <div className="mt-14 pt-8 border-t border-cyan/8 flex items-center justify-between">
            <div>
              <p className="text-[0.62rem] tracking-[0.18em] uppercase text-muted/50 mb-1">Published by</p>
              <p className="text-sm text-sand font-display font-600 tracking-wide">Africa Narrative Signals</p>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 border-t border-cyan/5" style={{ background: "rgba(8,13,24,0.6)" }}>
          <div className="max-w-6xl mx-auto px-6">
            <SectionLabel>Related Analysis</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-cyan/5 mt-6">
              {related.map((a) => (
                <Link key={a.id} href={`/insights/${a.slug}`} className="group block data-card p-6">
                  <span className="tag-cyan">{a.category}</span>
                  <h3 className="font-display font-600 text-xl text-sand mt-3 mb-2 leading-snug group-hover:text-cyan transition-colors tracking-wide">{a.title}</h3>
                  <p className="text-sm text-muted line-clamp-2">{a.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}