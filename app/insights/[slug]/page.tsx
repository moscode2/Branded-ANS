import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, formatDate } from "@/lib/data";
import SectionLabel from "@/components/SectionLabel";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return { title: "Not Found" };
  return { title: article.title, description: article.summary };
}

export default function ArticlePage({ params }: Props) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const related = articles.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 2);

  return (
    <>
      <section className="pt-36 pb-12 border-b border-cyan/5">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/insights" className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.12em] uppercase text-muted hover:text-cyan transition-colors mb-10">
            ← Back to Insights
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <span className="tag-cyan">{article.category}</span>
            <span className="text-[0.68rem] text-muted">{formatDate(article.date)}</span>
            <span className="text-[0.68rem] text-muted/40">·</span>
            <span className="text-[0.68rem] text-muted">{article.readTime}</span>
          </div>
          <h1 className="font-display font-800 text-4xl md:text-5xl text-sand tracking-tight leading-[1.08] mb-6">
            {article.title}
          </h1>
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
            : <div className="prose-ans"><p>Full article content appears here. Connect a headless CMS or markdown pipeline to populate this field.</p></div>
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
        <section className="py-16 border-t border-cyan/5 bg-spaceDeep/50">
          <div className="max-w-6xl mx-auto px-6">
            <SectionLabel>Related Analysis</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-cyan/5 mt-8">
              {related.map((a) => (
                <Link key={a.slug} href={`/insights/${a.slug}`} className="group block data-card p-6">
                  <span className="tag-cyan">{a.category}</span>
                  <h3 className="font-display font-600 text-xl text-sand mt-3 mb-2 leading-snug group-hover:text-cyan transition-colors tracking-wide">
                    {a.title}
                  </h3>
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
