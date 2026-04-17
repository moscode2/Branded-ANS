"use client";
// Wraps the public insights page to pull articles from adminStore (localStorage)
// so admin changes are immediately reflected on the live site.
import { useEffect, useState } from "react";
import { getStoredArticles } from "@/lib/adminStore";
import { Article, categories } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";

export default function LiveArticles() {
  const [articles, setArticles]         = useState<Article[]>([]);
  const [search, setSearch]             = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [mounted, setMounted]           = useState(false);

  useEffect(() => {
    setArticles(getStoredArticles());
    setMounted(true);
  }, []);

  const filtered = articles.filter((a) => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const matchSearch = !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (!mounted) return null;

  return (
    <>
      {/* Filters */}
      <section className="py-8 border-b border-white/5 bg-ink2/40 sticky top-[60px] z-40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs">⌕</span>
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search insights..."
              className="w-full bg-ink3 border border-white/8 pl-8 pr-4 py-2.5 text-sm text-sand placeholder:text-muted/50 outline-none focus:border-gold/40 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-[0.65rem] tracking-[0.15em] uppercase font-medium transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-gold text-ink border-gold"
                    : "border-white/8 text-muted hover:border-gold/25 hover:text-sand"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-muted italic mb-3">No results found</p>
              <p className="text-sm text-muted/60">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <>
              <p className="text-[0.7rem] tracking-[0.12em] uppercase text-muted mb-8">
                {filtered.length} article{filtered.length !== 1 ? "s" : ""}
                {activeCategory !== "All" && ` in ${activeCategory}`}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
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