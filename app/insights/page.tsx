"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ArticleCard from "@/components/ArticleCard";
import SectionLabel from "@/components/SectionLabel";

interface Article { id: string; slug: string; title: string; summary: string; category: string; date: string; read_time?: string; }

const ALL_CATEGORIES = ["All", "Elections", "Misinformation", "Technology", "Policy", "Conflict", "Media", "Research"];

export default function InsightsPage() {
  const [articles,        setArticles]        = useState<Article[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [search,          setSearch]          = useState("");
  const [activeCategory,  setActiveCategory]  = useState("All");

  useEffect(() => {
    supabase.from("articles").select("*").order("date", { ascending: false })
      .then(({ data }) => { setArticles((data as Article[]) ?? []); setLoading(false); });
  }, []);

  const categories = ["All", ...new Set(articles.map((a) => a.category))];

  const filtered = articles.filter((a) => {
    const matchCat    = activeCategory === "All" || a.category === activeCategory;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <section className="pt-36 pb-16 border-b border-cyan/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 70% at 80% 40%, rgba(0,60,140,0.15) 0%, transparent 65%)" }} />
        <div className="max-w-6xl mx-auto px-6 relative">
          <SectionLabel>Research & Analysis</SectionLabel>
          <h1 className="font-display font-800 text-5xl md:text-7xl text-sand tracking-tight leading-[1.0] mb-6">Insights</h1>
          <p className="text-sm text-muted max-w-xl leading-relaxed">
            In-depth analysis of political narratives, misinformation trends, and digital democracy across Africa.
          </p>
        </div>
      </section>

      {/* Sticky filters */}
      <section className="py-5 border-b border-cyan/5 sticky top-[60px] z-40 backdrop-blur-md" style={{ background: "rgba(8,13,24,0.92)" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/50 text-xs">⌕</span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search insights…"
              className="w-full bg-spaceMid border border-cyan/12 pl-8 pr-4 py-2.5 text-xs text-sand placeholder:text-muted/30 outline-none focus:border-cyan/35 transition-colors" />
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-[0.62rem] tracking-[0.14em] uppercase font-semibold transition-all border font-display ${
                  activeCategory === cat ? "bg-cyan text-space border-cyan" : "border-cyan/15 text-muted hover:border-cyan/40 hover:text-sand"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-cyan/5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-spaceMid p-6 animate-pulse">
                  <div className="h-3 w-1/4 bg-white/5 rounded mb-4" />
                  <div className="h-4 w-3/4 bg-white/5 rounded mb-2" />
                  <div className="h-3 w-full bg-white/5 rounded mb-1" />
                  <div className="h-3 w-2/3 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display font-600 text-2xl text-muted italic mb-3">No results found</p>
              <p className="text-xs text-muted/50">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <>
              <p className="text-[0.65rem] tracking-[0.12em] uppercase text-muted mb-6">
                {filtered.length} article{filtered.length !== 1 ? "s" : ""}
                {activeCategory !== "All" && ` in ${activeCategory}`}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-cyan/5">
                {filtered.map((article) => <ArticleCard key={article.id} article={article} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}