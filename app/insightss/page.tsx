import SectionLabel from "@/components/SectionLabel";
import LiveArticles from "@/components/admin/LiveaArticles";

export default function InsightsPage() {
  return (
    <>
      <section className="pt-36 pb-16 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <SectionLabel>Research & Analysis</SectionLabel>
          <h1 className="font-display text-5xl md:text-6xl font-medium text-sand tracking-tight leading-[1.08] mb-6">
            Insights
          </h1>
          <p className="text-base text-muted max-w-xl leading-relaxed">
            In-depth analysis of political narratives, misinformation trends,
            and digital democracy across Africa — from our research team.
          </p>
        </div>
      </section>

      {/* LiveArticles reads from adminStore so edits appear instantly */}
      <LiveArticles />
    </>
  );
}