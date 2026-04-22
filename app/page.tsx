import type { Metadata } from "next";
import Link from "next/link";
import { articles, focusAreas } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";
import SectionLabel from "@/components/SectionLabel";
import NewsletterForm from "@/components/NewsletterForm";
import HeroImage from "@/components/HeroImage";

export const metadata: Metadata = {
  title: "Africa Narrative Signals | ",
};

export default function HomePage() {
  const latestArticles = articles.slice(0, 3);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Full-bleed parallax image behind everything */}
        <HeroImage />

        {/* Gold grid overlay — above image, below text */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(196,154,60,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(196,154,60,0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 w-full">
          <div className="max-w-2xl animate-fade-up">

            {/* Headline */}
            <h1 className="font-display text-5xl md:text-7xl font-medium text-sand leading-[1.05] tracking-tight mb-6">
              Africa Narrative{" "}
              <span className="italic text-gold/90">Signals</span>
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl font-display italic text-muted mb-8 leading-relaxed">
              {"Turning information flows into actionable intelligence"}
            </p>

            {/* Description */}
            <p className="text-base text-muted leading-relaxed max-w-xl mb-10">
              ANS is an independent research organization that analyzes
              political narratives, tracks misinformation, and strengthens
              information integrity across the African continent.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/insights"
                className="px-6 py-3 bg-gold text-ink text-[0.75rem] tracking-[0.12em] uppercase font-medium hover:bg-gold2 transition-colors duration-200"
              >
                Read Insights →
              </Link>
              <Link
                href="/reports"
                className="px-6 py-3 border border-white/10 text-sand text-[0.75rem] tracking-[0.12em] uppercase font-medium hover:border-gold/30 hover:text-gold transition-all duration-200"
              >
                View Reports
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-20 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: "47+", label: "Countries Monitored" },
              { num: "1.2M+", label: "Posts Analyzed" },
              { num: "84", label: "Research Publications" },
              { num: "3", label: "Languages Tracked" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl text-gold font-medium mb-1">
                  {stat.num}
                </p>
                <p className="text-[0.7rem] tracking-[0.12em] uppercase text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOCUS AREAS ── */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <SectionLabel>Focus Areas</SectionLabel>
              <h2 className="font-display text-4xl text-sand font-medium tracking-tight">
                What We Analyze
              </h2>
            </div>
            <Link
              href="/about"
              className="text-[0.72rem] tracking-[0.12em] uppercase text-muted hover:text-gold transition-colors self-start md:self-auto"
            >
              Learn more →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {focusAreas.map((area) => (
              <div
                key={area.id}
                className="bg-ink p-8 hover:bg-ink2 transition-colors duration-300 group"
              >
                <span className="block text-2xl text-gold/60 mb-6 font-display group-hover:text-gold transition-colors">
                  {area.icon}
                </span>
                <h3 className="font-display text-lg text-sand font-medium mb-3 leading-snug">
                  {area.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST INSIGHTS ── */}
      <section className="py-24 border-t border-white/5 bg-ink2/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <SectionLabel>Latest Analysis</SectionLabel>
              <h2 className="font-display text-4xl text-sand font-medium tracking-tight">
                Recent Insights
              </h2>
            </div>
            <Link
              href="/insights"
              className="text-[0.72rem] tracking-[0.12em] uppercase text-muted hover:text-gold transition-colors self-start md:self-auto"
            >
              All insights →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mx-auto text-center">
            <SectionLabel>Stay Informed</SectionLabel>
            <h2 className="font-display text-3xl text-sand font-medium tracking-tight mb-4">
              Intelligence Briefing
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-8">
              Weekly analysis on African narrative trends, misinformation
              incidents, and digital democracy developments — delivered to your
              inbox.
            </p>

            <NewsletterForm />

            <p className="text-[0.65rem] text-muted/50 mt-3">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}