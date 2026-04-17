"use client";
import { useState } from "react";
import { articles, categories } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";
import SectionLabel from "@/components/SectionLabel";

export default function InsightsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

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

      {/* Filters */}
      <section className="py-6 border-b border-cyan/5 bg-spaceMid/60 sticky top-[60px] z-40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs">⌕</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search insights..."
              className="form-input pl-8 py-2.5 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-[0.62rem] tracking-[0.15em] uppercase font-semibold transition-all duration-200 border font-display ${
                  activeCategory === cat
                    ? "bg-cyan text-space border-cyan"
                    : "border-cyan/15 text-muted hover:border-cyan/40 hover:text-sand"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display font-600 text-2xl text-muted italic mb-3">No results found</p>
              <p className="text-sm text-muted/60">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <>
              <p className="text-[0.68rem] tracking-[0.12em] uppercase text-muted mb-8">
                {filtered.length} article{filtered.length !== 1 ? "s" : ""}
                {activeCategory !== "All" && ` in ${activeCategory}`}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-cyan/5">
                {filtered.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
