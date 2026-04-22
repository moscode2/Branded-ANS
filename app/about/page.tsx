import type { Metadata } from "next";
import SectionLabel from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Africa Narrative Signals — our mission, focus areas, approach, and the team behind Africa's leading information integrity research organization.",
};

const focusDetails = [
  {
    id: "01",
    title: "Narrative Intelligence",
    description:
      "We track how political narratives form, evolve, and travel across digital and traditional media ecosystems. By mapping narrative lifecycles — from origin to peak spread to decline — we help stakeholders understand how information shapes public opinion, political behavior, and social cohesion.",
    capabilities: [
      "Real-time narrative monitoring",
      "Cross-platform content analysis",
      "Influencer and amplification mapping",
      "Longitudinal trend tracking",
    ],
  },
  {
    id: "02",
    title: "Information Integrity",
    description:
      "We identify and analyze misinformation, disinformation, and coordinated inauthentic behavior that threatens democratic processes and public discourse. Our work goes beyond fact-checking to understand the structural conditions that enable harmful information to spread.",
    capabilities: [
      "Misinformation incident documentation",
      "Network analysis of disinformation actors",
      "Platform policy gap assessment",
      "Synthetic media detection support",
    ],
  },
  {
    id: "03",
    title: "Digital Democracy",
    description:
      "We examine how digital platforms shape civic participation, electoral integrity, and public discourse. We investigate how algorithmic systems, platform policies, and digital infrastructure interact with democratic norms — and what it takes to strengthen them.",
    capabilities: [
      "Electoral information environment monitoring",
      "Platform accountability research",
      "Digital civic space mapping",
      "AI and democracy impact assessment",
    ],
  },
];

const whatWeDo = [
  {
    icon: "◎",
    title: "Narrative Monitoring & Analysis",
    description:
      "Continuous monitoring of political narratives across 47 African countries, using a combination of human analysis and computational methods to track how stories spread and evolve.",
  },
  {
    icon: "◈",
    title: "Misinformation Tracking & Reporting",
    description:
      "Systematic documentation of misinformation incidents, disinformation campaigns, and coordinated inauthentic behavior, with detailed incident reports for journalists, platforms, and policymakers.",
  },
  {
    icon: "◉",
    title: "Research Publications & Policy Briefs",
    description:
      "Rigorous, peer-reviewed research and accessible policy briefs that translate complex findings into actionable recommendations for decision-makers and civil society organizations.",
  },
  {
    icon: "◇",
    title: "Digital Ecosystem Mapping",
    description:
      "Detailed mapping of digital information ecosystems across Africa, including platform penetration, infrastructure gaps, media landscape analysis, and civil society capacity assessments.",
  },
  {
    icon: "○",
    title: "Strategic Insights",
    description:
      "Bespoke intelligence briefings and strategic analysis for organizations operating in complex African information environments, including governments, international organizations, and foundations.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="pt-36 pb-20 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <SectionLabel>About ANS</SectionLabel>
            <h1 className="font-display text-5xl md:text-6xl font-medium text-sand tracking-tight leading-[1.08] mb-8">
              Who We <span className="italic text-gold/90">Are</span>
            </h1>
            <div className="space-y-5 text-base text-muted leading-relaxed max-w-2xl">
              <p>
                Africa Narrative Signals (ANS) is an independent research
                organization dedicated to analyzing political narratives,
                tracking misinformation, and strengthening information integrity
                across the African continent.
              </p>
              <p>
                We operate at the intersection of data science, political
                analysis, and journalism — producing research that is
                rigorous, independent, and directly relevant to the challenges
                facing African democracies and information ecosystems.
              </p>
              <p>
                Founded on the conviction that Africa deserves the same quality
                of independent information environment research as any other
                region, ANS fills a critical gap: bringing systematic,
                continent-wide analysis to narratives and information flows that
                too often go unmapped and unstudied.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOCUS AREAS ── */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <SectionLabel>Focus Areas</SectionLabel>
          <h2 className="font-display text-4xl text-sand font-medium tracking-tight mb-16">
            What We Study
          </h2>

          <div className="flex flex-col gap-4">
            {focusDetails.map((area) => (
              <div
                key={area.id}
                className="grid grid-cols-1 md:grid-cols-5 gap-0 bg-white/[0.03] hover:bg-white/[0.06] transition-colors duration-300 group"
              >
                {/* Number */}
                <div className="md:col-span-1 py-10 px-8 flex items-start">
                  <span className="font-display text-5xl text-gold/15 font-medium group-hover:text-gold/30 transition-colors duration-300">
                    {area.id}
                  </span>
                </div>

                {/* Content */}
                <div className="md:col-span-2 py-10 pr-8">
                  <h3 className="font-display text-2xl text-sand font-medium mb-4 group-hover:text-gold/90 transition-colors duration-300">
                    {area.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {area.description}
                  </p>
                </div>

                {/* Capabilities */}
                <div className="md:col-span-2 py-10 pr-8">
                  <p className="text-[0.65rem] tracking-[0.18em] uppercase text-gold/60 font-medium mb-4">
                    Capabilities
                  </p>
                  <ul className="space-y-2.5">
                    {area.capabilities.map((cap) => (
                      <li key={cap} className="flex items-start gap-2.5">
                        <span className="text-gold/35 mt-1 text-xs shrink-0">—</span>
                        <span className="text-sm text-muted">{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section className="py-24 border-b border-white/5 bg-ink2/40">
        <div className="max-w-6xl mx-auto px-6">
          <SectionLabel>Our Work</SectionLabel>
          <h2 className="font-display text-4xl text-sand font-medium tracking-tight mb-16">
            What We Do
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {whatWeDo.map((item) => (
              <div key={item.title} className="bg-ink p-8 hover:bg-ink2 transition-colors duration-300">
                <span className="block text-xl text-gold/50 mb-5 font-display">
                  {item.icon}
                </span>
                <h3 className="font-display text-lg text-sand font-medium mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY IT MATTERS ── */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <SectionLabel>Why It Matters</SectionLabel>
              <h2 className="font-display text-4xl text-sand font-medium tracking-tight mb-8">
                The Stakes for African{" "}
                <span className="italic">Democracy</span>
              </h2>
              <div className="space-y-4 text-sm text-muted leading-relaxed">
              <p>
  Africa is home to 54 countries, over 1.4 billion people, and
  some of the world&apos;s fastest-growing digital populations.
  Across the continent, elections are being won and lost in
  information environments that few people systematically study.
</p>
                <p>
                  Political narratives — accurate and false alike — travel at
                  unprecedented speed across WhatsApp groups, Facebook pages,
                  and Twitter feeds. Coordinated actors exploit information
                  gaps. Platforms deploy moderation resources unevenly. Local
                  journalists lack the tools to document what is happening.
                </p>
                <p>
                  Without rigorous, independent analysis, democratic actors —
                  civil society, journalists, policymakers, international
                  observers — make decisions blind. ANS exists to change that.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <SectionLabel>Our Approach</SectionLabel>
              <h2 className="font-display text-4xl text-sand font-medium tracking-tight mb-8">
                How We Work
              </h2>
              {[
                {
                  title: "Independence",
                  desc: "ANS does not accept funding that creates conflicts of interest with our research mission. We publish our funding sources and maintain editorial independence.",
                },
                {
                  title: "Rigor",
                  desc: "Our research combines computational methods with deep regional expertise. We document methodology transparently and subject findings to peer review.",
                },
                {
                  title: "Relevance",
                  desc: "We prioritize research questions that matter to African stakeholders — civil society, journalists, policymakers — not external audiences.",
                },
                {
                  title: "Accessibility",
                  desc: "Complex findings are translated into accessible formats. We publish in multiple African languages and provide open-access research where possible.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 items-start">
                  <span className="block w-px h-12 bg-gold/30 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-sand mb-1">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}