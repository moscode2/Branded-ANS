import Link from "next/link";
import { Article, formatDate } from "@/lib/data";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/insights/${article.slug}`} className="group block">
      <article className="data-card p-6 h-full">
        {/* Category + date */}
        <div className="flex items-center justify-between mb-4">
          <span className="tag-cyan">{article.category}</span>
          <span className="text-[0.68rem] text-muted">{formatDate(article.date)}</span>
        </div>

        {/* Title */}
        <h3 className="font-display font-600 text-xl text-sand leading-snug mb-3 group-hover:text-cyan transition-colors duration-200 tracking-wide">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-muted leading-relaxed mb-5 line-clamp-2">{article.summary}</p>

        {/* Footer */}
        <div className="flex items-center gap-2 text-[0.68rem] tracking-[0.1em] uppercase text-muted group-hover:text-cyan transition-colors">
          <span className="dot-pulse opacity-60" />
          <span>Read Analysis</span>
          <span className="transition-transform group-hover:translate-x-1 ml-auto">→</span>
          <span className="text-muted/50">{article.readTime}</span>
        </div>
      </article>
    </Link>
  );
}
