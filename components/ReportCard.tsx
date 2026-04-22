interface Report { id: string; title: string; description: string; file_url?: string; date: string; category?: string; pages?: number;  downloadUrl: string;}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function ReportCard({ report }: { report: Report }) {
  return (
    <div className="data-card p-6 flex flex-col group">
      <div className="flex items-center justify-between mb-5">
        <span className="tag-cyan">{report.category ?? "Report"}</span>
        {report.pages && <span className="text-[0.62rem] tracking-wider uppercase text-muted/50">{report.pages} pp.</span>}
      </div>
      <div className="w-10 h-10 border border-cyan/20 flex items-center justify-center mb-4 bg-cyan/5">
        <span className="font-display font-700 text-cyan text-xs tracking-wider">PDF</span>
      </div>
      <h3 className="font-display font-600 text-lg text-sand leading-snug mb-3 tracking-wide group-hover:text-cyan transition-colors flex-1">
        {report.title}
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-5 line-clamp-3">{report.description}</p>
      <div className="flex items-center justify-between pt-4 border-t border-cyan/8">
        <span className="text-[0.68rem] text-muted">{fmt(report.date)}</span>
        {report.file_url ? (
          <a href={report.file_url} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-[0.68rem] tracking-[0.1em] uppercase text-cyan hover:text-blueLight transition-colors font-semibold"
            download>
            Download ↓
          </a>
        ) : (
          <span className="text-[0.68rem] text-muted/30 uppercase tracking-wider">Coming soon</span>
        )}
      </div>
    </div>
  );
}