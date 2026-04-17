import { Report, formatDate } from "@/lib/data";

export default function ReportCard({ report }: { report: Report }) {
  return (
    <div className="border border-white/6 bg-ink2/60 hover:border-gold/20 hover:bg-ink2 transition-all duration-300 p-6 flex flex-col">
      {/* PDF icon */}
      <div className="w-10 h-10 border border-white/8 flex items-center justify-center mb-5">
        <span className="text-gold text-xs font-medium tracking-wider">PDF</span>
      </div>

      {/* Title */}
      <h3 className="font-display text-lg text-sand font-medium leading-snug mb-3">
        {report.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted leading-relaxed mb-5 flex-1 line-clamp-3">
        {report.description}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-[0.7rem] text-muted font-mono">{formatDate(report.date)}</span>
        {report.file_url ? (
          <a
            href={report.file_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-[0.68rem] tracking-[0.12em] uppercase text-gold hover:text-gold2 transition-colors font-medium"
            download
          >
            Download ↓
          </a>
        ) : (
          <span className="text-[0.68rem] tracking-[0.12em] uppercase text-muted/40">
            Coming soon
          </span>
        )}
      </div>
    </div>
  );
}