import { Report, formatDate } from "@/lib/data";

export default function ReportCard({ report }: { report: Report }) {
  return (
    <div className="data-card p-6 flex flex-col group">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="tag-cyan">{report.category}</span>
        <span className="text-[0.62rem] tracking-wider uppercase text-muted/50">{report.pages} pp.</span>
      </div>

      {/* PDF badge */}
      <div className="w-10 h-10 border border-cyan/20 flex items-center justify-center mb-4 bg-cyan/5">
        <span className="font-display font-700 text-cyan text-xs tracking-wider">PDF</span>
      </div>

      {/* Title */}
      <h3 className="font-display font-600 text-lg text-sand leading-snug mb-3 tracking-wide group-hover:text-cyan transition-colors">
        {report.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted leading-relaxed mb-5 flex-1 line-clamp-3">{report.description}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-cyan/8">
        <span className="text-[0.68rem] text-muted">{formatDate(report.date)}</span>
        <a
          href={report.downloadUrl}
          className="flex items-center gap-1.5 text-[0.68rem] tracking-[0.1em] uppercase text-cyan hover:text-blueLight transition-colors font-semibold"
          download
        >
          Download ↓
        </a>
      </div>
    </div>
  );
}
