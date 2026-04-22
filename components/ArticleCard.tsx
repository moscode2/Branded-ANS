import Link from "next/link";

interface Article { id?: string; slug: string; title: string; summary: string; category: string; date: string; read_time?: string; readTime?: string; }

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function ArticleCard({ article }: { article: Article }) {
  const readTime = article.read_time ?? article.readTime;
  return (
    <Link href={`/insights/${article.slug}`} className="group block">
      <article className="data-card p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <span className="tag-cyan">{article.category}</span>
          <span className="text-[0.68rem] text-muted">{fmt(article.date)}</span>
        </div>
        <h3 className="font-display font-600 text-xl text-sand leading-snug mb-3 group-hover:text-cyan transition-colors duration-200 tracking-wide">
          {article.title}
        </h3>
        <p className="text-sm text-muted leading-relaxed mb-5 line-clamp-2">{article.summary}</p>
        <div className="flex items-center gap-2 text-[0.68rem] tracking-[0.1em] uppercase text-muted group-hover:text-cyan transition-colors">
          <span className="dot-pulse opacity-60" />
          <span>Read Analysis</span>
          <span className="transition-transform group-hover:translate-x-1 ml-auto">→</span>
          {readTime && <span className="text-muted/50">{readTime}</span>}
        </div>
      </article>
    </Link>
  );
}