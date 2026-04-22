"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Report } from "@/lib/data";
import ReportCard from "@/components/ReportCard";
import SectionLabel from "@/components/SectionLabel";

export default function ReportsPage() {
  const [reports, setReports]   = useState<Report[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        setError("Failed to load reports. Please try again later.");
        console.error("Supabase error:", error);
      } else {
        setReports(data as Report[]);
      }
      setLoading(false);
    }
    fetchReports();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-20 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            <div>
              <SectionLabel>Research Output</SectionLabel>
              <h1 className="font-display text-5xl md:text-6xl font-medium text-sand tracking-tight leading-[1.08]">
                Reports &<br />
                <span className="italic text-gold/90">Publications</span>
              </h1>
            </div>
            <div>
              <p className="text-base text-muted leading-relaxed">
                Our research output includes annual intelligence reports, election monitoring
                findings, disinformation network analyses, policy briefs, and field research
                from across the continent. All publications are available for free download.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 pt-10 border-t border-white/6 grid grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { num: reports.length > 0 ? `${reports.length}` : "—", label: "Publications" },
              { num: "Free", label: "Open Access" },
              { num: "2025–26", label: "Coverage Period" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl text-gold font-medium mb-1">{s.num}</p>
                <p className="text-[0.7rem] tracking-[0.12em] uppercase text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reports grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-ink2/60 p-6 animate-pulse">
                  <div className="w-10 h-10 bg-white/5 mb-5" />
                  <div className="h-4 bg-white/5 rounded mb-2 w-3/4" />
                  <div className="h-4 bg-white/5 rounded mb-2 w-full" />
                  <div className="h-4 bg-white/5 rounded w-2/3" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="border border-red-500/20 bg-red-500/5 px-6 py-5 text-sm text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && reports.length === 0 && (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-muted italic mb-2">No reports yet</p>
              <p className="text-sm text-muted/50">Check back soon for our latest publications.</p>
            </div>
          )}

          {!loading && !error && reports.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/5 bg-ink2/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <SectionLabel>Bespoke Research</SectionLabel>
            <h2 className="font-display text-3xl text-sand font-medium tracking-tight mb-5">
              Need Custom Research?
            </h2>
            <p className="text-base text-muted leading-relaxed mb-8">
              ANS produces bespoke research and strategic intelligence briefings for organizations
              operating in complex African information environments — governments, international
              organizations, foundations, and media houses.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-ink text-[0.75rem] tracking-[0.12em] uppercase font-medium hover:bg-gold2 transition-colors"
            >
              Request Research →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}