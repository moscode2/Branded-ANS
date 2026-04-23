import type { Metadata } from "next";
import SectionLabel from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "About",
  description: "Africa Narrative Signals — our mission, focus areas, and approach to information integrity research across Africa.",
};

const focusDetails = [
  {
    id: "01", icon: "◎", color: "text-cyan",
    title: "Narrative Intelligence",
    description: "We track how political narratives form, evolve, and travel across digital and traditional media ecosystems. By mapping narrative lifecycles — from origin to peak spread to decline — we help stakeholders understand how information shapes public opinion, political behavior, and social cohesion.",
    capabilities: ["Real-time narrative monitoring", "Cross-platform content analysis", "Influencer and amplification mapping", "Longitudinal trend tracking"],
  },
  {
    id: "02", icon: "◈", color: "text-blueLight",
    title: "Information Integrity",
    description: "We identify and analyze misinformation, disinformation, and coordinated inauthentic behavior that threatens democratic processes. Our work goes beyond fact-checking to understand the structural conditions that enable harmful information to spread.",
    capabilities: ["Misinformation incident documentation", "Network analysis of disinformation actors", "Platform policy gap assessment", "Synthetic media detection support"],
  },
  {
    id: "03", icon: "◇", color: "text-cyan",
    title: "Digital Democracy",
    description: "We examine how digital platforms shape civic participation, electoral integrity, and public discourse. We investigate how algorithmic systems, platform policies, and digital infrastructure interact with democratic norms — and what it takes to strengthen them.",
    capabilities: ["Electoral information environment monitoring", "Platform accountability research", "Digital civic space mapping", "AI and democracy impact assessment"],
  },
];

const whatWeDo = [
  { icon: "◎", title: "Narrative Monitoring & Analysis", description: "Continuous monitoring of political narratives across 47 African countries, using human analysis and computational methods to track how stories spread and evolve." },
  { icon: "◈", title: "Misinformation Tracking & Reporting", description: "Systematic documentation of misinformation incidents, disinformation campaigns, and coordinated inauthentic behavior, with detailed incident reports for journalists, platforms, and policymakers." },
  { icon: "◉", title: "Research Publications & Policy Briefs", description: "Rigorous, peer-reviewed research and accessible policy briefs that translate complex findings into actionable recommendations for decision-makers and civil society." },
  { icon: "◇", title: "Digital Ecosystem Mapping", description: "Detailed mapping of digital information ecosystems, including platform penetration, infrastructure gaps, media landscape analysis, and civil society capacity assessments." },
  { icon: "○", title: "Strategic Insights", description: "Bespoke intelligence briefings and strategic analysis for organizations operating in complex African information environments." },
];

export default function AboutPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="pt-36 pb-0 border-b border-cyan/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(0,80,180,0.12) 0%, transparent 65%)" }} />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch min-h-[520px]">

            {/* Left: text */}
            <div className="py-20 pr-12 flex flex-col justify-center">
              <SectionLabel>About ANS</SectionLabel>
              <h1 className="font-display font-800 text-5xl md:text-6xl text-sand tracking-tight leading-[1.05] mb-8">
                Who We <span className="italic text-cyan">Are</span>
              </h1>
              <div className="space-y-4 text-base text-muted leading-relaxed">
                <p>
                  Africa Narrative Signals (ANS) is an independent research organization dedicated to
                  analyzing political narratives, tracking misinformation, and strengthening
                  information integrity across Africa.
                </p>
                <p>
                  We operate at the intersection of data science, political analysis, and journalism —
                  producing research that is rigorous, independent, and directly relevant to the
                  challenges facing African democracies and information ecosystems.
                </p>
                <p>
                  Founded on the conviction that Africa deserves the same quality of independent
                  information environment research as any other region, ANS fills a critical gap:
                  bringing systematic, continent-wide analysis to narratives and information flows
                  that too often go unmapped and unstudied.
                </p>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-cyan/10">
                {[
                  { num: "47+",  label: "Countries" },
                  { num: "84",   label: "Publications" },
                  { num: "2024", label: "Est." },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-display font-700 text-2xl text-cyan">{s.num}</p>
                    <p className="text-[0.68rem] tracking-[0.12em] uppercase text-muted mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: visual panel */}
            <div className="relative lg:block hidden">
              {/* Background fill */}
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #080f1e 100%)", borderLeft: "1px solid rgba(0,212,255,0.08)" }} />

              {/* Network SVG illustration */}
              <div className="absolute inset-0 flex items-center justify-center p-10">
                <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-sm opacity-90">
                  {/* Connection lines */}
                  <g stroke="rgba(0,212,255,0.15)" strokeWidth="1">
                    <line x1="200" y1="200" x2="100" y2="100"/>
                    <line x1="200" y1="200" x2="300" y2="100"/>
                    <line x1="200" y1="200" x2="320" y2="240"/>
                    <line x1="200" y1="200" x2="260" y2="320"/>
                    <line x1="200" y1="200" x2="100" y2="300"/>
                    <line x1="200" y1="200" x2="80" y2="200"/>
                    <line x1="100" y1="100" x2="300" y2="100"/>
                    <line x1="300" y1="100" x2="320" y2="240"/>
                    <line x1="100" y1="300" x2="260" y2="320"/>
                    <line x1="80" y1="200" x2="100" y2="100"/>
                    <line x1="80" y1="200" x2="100" y2="300"/>
                    <line x1="150" y1="60" x2="100" y2="100"/>
                    <line x1="150" y1="60" x2="300" y2="100"/>
                    <line x1="360" y1="160" x2="300" y2="100"/>
                    <line x1="360" y1="160" x2="320" y2="240"/>
                    <line x1="60" y1="140" x2="80" y2="200"/>
                    <line x1="60" y1="140" x2="100" y2="100"/>
                  </g>
                  {/* Secondary lines */}
                  <g stroke="rgba(0,212,255,0.07)" strokeWidth="0.5">
                    <line x1="150" y1="60" x2="60" y2="140"/>
                    <line x1="360" y1="160" x2="260" y2="320"/>
                    <line x1="100" y1="300" x2="80" y2="200"/>
                    <line x1="260" y1="320" x2="320" y2="240"/>
                  </g>

                  {/* Africa continent shape — simplified */}
                  <path d="M185 120 L210 115 L230 125 L238 145 L235 170 L245 195 L240 220 L230 250 L215 275 L200 290 L185 275 L170 250 L165 220 L160 195 L162 170 L158 145 L165 125 Z"
                    fill="rgba(0,212,255,0.06)" stroke="rgba(0,212,255,0.25)" strokeWidth="1.5" />

                  {/* Main hub node */}
                  <circle cx="200" cy="200" r="12" fill="rgba(0,212,255,0.15)" stroke="#00d4ff" strokeWidth="1.5"/>
                  <circle cx="200" cy="200" r="5" fill="#00d4ff"/>
                  <circle cx="200" cy="200" r="20" fill="none" stroke="rgba(0,212,255,0.2)" strokeWidth="1">
                    <animate attributeName="r" from="12" to="28" dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" from="0.4" to="0" dur="2.5s" repeatCount="indefinite"/>
                  </circle>

                  {/* Secondary nodes */}
                  {[
                    [100, 100, "#00d4ff", "0.8"],
                    [300, 100, "#1a6fe8", "0.8"],
                    [320, 240, "#00d4ff", "0.7"],
                    [260, 320, "#1a6fe8", "0.7"],
                    [100, 300, "#00d4ff", "0.7"],
                    [80,  200, "#1a6fe8", "0.6"],
                    [150, 60,  "#00d4ff", "0.5"],
                    [360, 160, "#1a6fe8", "0.5"],
                    [60,  140, "#00d4ff", "0.5"],
                  ].map(([cx, cy, color, opacity], i) => (
                    <g key={i}>
                      <circle cx={cx} cy={cy} r="6" fill={`${color}22`} stroke={color as string} strokeWidth="1" opacity={opacity as string}/>
                      <circle cx={cx} cy={cy} r="2.5" fill={color as string} opacity={opacity as string}/>
                    </g>
                  ))}

                  {/* Floating labels */}
                  <g fontFamily="monospace" fill="rgba(0,212,255,0.5)" fontSize="8">
                    <text x="108" y="95">Kenya</text>
                    <text x="285" y="95">Nigeria</text>
                    <text x="328" y="238">Uganda</text>
                    <text x="255" y="338">Ethiopia</text>
                    <text x="62" y="318">Ghana</text>
                  </g>
                </svg>
              </div>

              {/* ANS label overlay */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                <div style={{ background: "rgba(6,10,18,0.85)", border: "1px solid rgba(0,212,255,0.2)", padding: "10px 20px", backdropFilter: "blur(8px)" }}>
                  <p className="text-[0.6rem] tracking-[0.2em] uppercase text-cyan font-mono text-center">
                    Narrative Signal Network · Africa
                  </p>
                </div>
              </div>
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
      <section className="py-24 border-b border-cyan/5 bg-spaceDeep/50">
        <div className="max-w-6xl mx-auto px-6">
          <SectionLabel>Our Work</SectionLabel>
          <h2 className="font-display font-700 text-4xl text-sand tracking-tight mb-16">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-cyan/5">
            {whatWeDo.map((item) => (
              <div key={item.title} className="data-card p-8 group">
                <span className="block text-xl text-cyan/40 mb-5 group-hover:text-cyan/70 transition-colors">{item.icon}</span>
                <h3 className="font-display font-600 text-lg text-sand mb-3 tracking-wide">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
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