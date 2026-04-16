import type { Metadata } from "next";
import { reports } from "@/lib/data";
import ReportCard from "@/components/ReportCard";
import SectionLabel from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "Reports",
  description: "Downloadable research reports, policy briefs, and threat assessments from Africa Narrative Signals.",
};

export default function ReportsPage() {
  return (
    <>
      <section className="pt-36 pb-20 border-b border-cyan/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 60% at 75% 50%, rgba(0,60,140,0.14) 0%, transparent 65%)" }} />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            <div>
              <SectionLabel>Research Output</SectionLabel>
              <h1 className="font-display font-800 text-5xl md:text-7xl text-sand tracking-tight leading-[1.0]">
                Reports &<br /><span className="italic text-cyan">Publications</span>
              </h1>
            </div>
            <div>
              <p className="text-sm text-muted leading-relaxed">
                Our research output includes annual intelligence reports, election monitoring findings, disinformation network analyses, policy briefs, and field research from across the continent. All publications are available for free download.
              </p>
            </div>
          </div>

          <div className="mt-16 pt-10 border-t border-cyan/10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: "6",    label: "Reports in 2024" },
              { num: "331",  label: "Total Pages" },
              { num: "Free", label: "Open Access" },
              { num: "6",    label: "Categories" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display font-700 text-3xl text-cyan mb-1">{s.num}</p>
                <p className="text-[0.68rem] tracking-[0.12em] uppercase text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-cyan/5">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-cyan/5 bg-spaceDeep/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <SectionLabel>Bespoke Research</SectionLabel>
            <h2 className="font-display font-700 text-3xl text-sand tracking-tight mb-5">Need Custom Research?</h2>
            <p className="text-sm text-muted leading-relaxed mb-8">
              ANS produces bespoke research and strategic intelligence briefings for organizations operating in complex African information environments — governments, international organizations, foundations, and media houses.
            </p>
            <a href="/contact" className="btn-primary">Request Research →</a>
          </div>
        </div>
      </section>
    </>
  );
}
