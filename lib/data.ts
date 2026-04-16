// lib/data.ts — CMS-ready data layer. Replace with API/CMS calls later.

export type Article = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  readTime: string;
  body?: string;
};

export type Report = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  pages: number;
  downloadUrl: string;
};

export type FocusArea = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const focusAreas: FocusArea[] = [
  {
    id: "narrative-intelligence",
    title: "Narrative Intelligence",
    description:
      "Tracking how political narratives form, evolve, and spread across digital and traditional media ecosystems in Africa.",
    icon: "◎",
  },
  {
    id: "information-integrity",
    title: "Information Integrity",
    description:
      "Identifying and analyzing misinformation, disinformation, and coordinated inauthentic behavior that threatens democratic processes.",
    icon: "◈",
  },
  {
    id: "digital-democracy",
    title: "Digital Democracy",
    description:
      "Examining how digital platforms shape civic participation, electoral integrity, and public discourse across the continent.",
    icon: "◇",
  },
  {
    id: "policy-research",
    title: "Policy Research",
    description:
      "Producing rigorous, evidence-based policy briefs and research publications that inform decision-makers and civil society.",
    icon: "◉",
  },
];

export const articles: Article[] = [
  {
    slug: "election-narratives-west-africa-2024",
    title: "Election Narratives in West Africa: Tracking the 2024 Cycle",
    summary:
      "An analysis of dominant political narratives across Ghana, Senegal, and Nigeria during the 2024 electoral period, tracing how coordinated messaging shaped public perception.",
    date: "2024-11-18",
    category: "Elections",
    readTime: "8 min read",
    body: `<h2>Overview</h2><p>The 2024 electoral cycle in West Africa presented a complex landscape of competing narratives. From Accra to Lagos, political actors deployed sophisticated messaging strategies across both digital and traditional media platforms.</p><blockquote>Narrative control has become as important as ground-level mobilization in modern African elections.</blockquote><p>Our monitoring team tracked over 1.2 million posts across Twitter/X, Facebook, and WhatsApp channels in the six months preceding each election. The findings reveal distinct patterns in how political narratives were seeded, amplified, and contested.</p><h2>Key Findings</h2><p>In Senegal, narratives around judicial independence dominated the pre-election period. In Ghana, economic messaging outpaced all other themes by a ratio of 3:1. Nigeria presented the most fragmented narrative ecosystem, with regional fault lines producing sharply divergent information environments.</p>`,
  },
  {
    slug: "disinformation-infrastructure-east-africa",
    title: "Disinformation Infrastructure in East Africa: A Network Analysis",
    summary:
      "Mapping the coordinated accounts, pages, and channels that form the backbone of disinformation campaigns targeting Kenya, Uganda, and Ethiopia.",
    date: "2024-10-05",
    category: "Misinformation",
    readTime: "12 min read",
    body: `<h2>Introduction</h2><p>Disinformation in East Africa does not emerge organically — it is manufactured, distributed, and maintained through deliberate infrastructure. This report maps those networks for the first time.</p><p>Drawing on platform data, open-source intelligence, and journalist investigations, we identified over 340 coordinated accounts operating across three countries.</p><blockquote>The infrastructure of disinformation is more resilient than the platforms designed to contain it.</blockquote><h2>Methodology</h2><p>Our analysis combined network graph analysis with qualitative content review. We tracked account creation dates, posting patterns, linguistic signatures, and cross-platform coordination signals.</p>`,
  },
  {
    slug: "ai-synthetic-media-african-elections",
    title: "AI-Generated Synthetic Media and African Electoral Integrity",
    summary:
      "How deepfakes, voice clones, and AI-generated images are being deployed in African political contexts — and what regulators need to know.",
    date: "2024-09-12",
    category: "Technology",
    readTime: "10 min read",
    body: `<h2>The Emerging Threat</h2><p>Synthetic media — AI-generated audio, video, and images — represents a qualitatively new challenge for electoral integrity in Africa. Unlike text-based disinformation, synthetic media exploits cognitive shortcuts that make visual content inherently more persuasive.</p><p>ANS documented 47 confirmed instances of synthetic media deployed in African political contexts in 2024 alone, a 380% increase from the previous year.</p>`,
  },
  {
    slug: "social-media-platform-accountability-africa",
    title: "Platform Accountability in Africa: A Policy Gap Analysis",
    summary:
      "Examining the regulatory vacuum that allows global social media platforms to operate with minimal accountability for harmful content in African markets.",
    date: "2024-08-20",
    category: "Policy",
    readTime: "9 min read",
    body: `<h2>The Accountability Gap</h2><p>Global technology platforms have invested disproportionately in content moderation for high-revenue markets, leaving African users exposed to harmful content at rates far exceeding those in Europe or North America.</p><p>This policy brief examines the structural causes of this gap and proposes a regional framework for platform accountability.</p>`,
  },
  {
    slug: "civic-information-sahel-conflict",
    title: "Civic Information Environments in the Sahel Conflict Zone",
    summary:
      "Investigating how armed conflict disrupts information ecosystems and what strategies communities use to maintain information access in Mali, Burkina Faso, and Niger.",
    date: "2024-07-03",
    category: "Conflict",
    readTime: "11 min read",
    body: `<h2>Information Under Siege</h2><p>In conflict-affected areas of the Sahel, access to reliable information is not merely a convenience — it is a matter of survival. Displacement, infrastructure destruction, and deliberate information suppression converge to create severe information poverty.</p>`,
  },
  {
    slug: "narrative-framing-climate-africa",
    title: "How Climate Change is Framed in African Political Discourse",
    summary:
      "A comparative study of climate narrative framing across 12 African countries, analyzing government, civil society, and media positioning.",
    date: "2024-06-15",
    category: "Policy",
    readTime: "7 min read",
    body: `<h2>Framing the Crisis</h2><p>Climate change communication in Africa occupies a contested space between international development narratives and locally grounded experiences of environmental change. This study examines how the framing of climate issues differs across political, civil society, and media actors.</p>`,
  },
];

export const reports: Report[] = [
  {
    id: "annual-report-2024",
    title: "Africa Narrative Signals: Annual Intelligence Report 2024",
    description:
      "A comprehensive review of information integrity challenges, narrative trends, and digital democracy developments across the African continent in 2024.",
    date: "2024-12-01",
    category: "Annual Report",
    pages: 84,
    downloadUrl: "#",
  },
  {
    id: "election-monitoring-west-africa",
    title: "West Africa Election Monitoring Report: 2024 Electoral Cycle",
    description:
      "Detailed findings from ANS election narrative monitoring operations in Ghana, Senegal, and Nigeria, including methodology, data, and recommendations.",
    date: "2024-11-30",
    category: "Election",
    pages: 52,
    downloadUrl: "#",
  },
  {
    id: "disinformation-network-report",
    title: "Disinformation Networks in East Africa: Full Network Analysis",
    description:
      "The complete dataset and analytical framework behind our investigation into coordinated disinformation infrastructure targeting East African democracies.",
    date: "2024-10-15",
    category: "Disinformation",
    pages: 67,
    downloadUrl: "#",
  },
  {
    id: "platform-policy-brief",
    title: "Policy Brief: Toward a Continental Framework for Platform Accountability",
    description:
      "Recommendations for African Union member states and regional bodies on establishing consistent, enforceable standards for social media platform operations.",
    date: "2024-09-01",
    category: "Policy Brief",
    pages: 28,
    downloadUrl: "#",
  },
  {
    id: "synthetic-media-threat-assessment",
    title: "Synthetic Media Threat Assessment: Africa 2024",
    description:
      "Assessment of AI-generated synthetic media incidents documented across African political contexts, with threat modelling and early warning indicators.",
    date: "2024-08-10",
    category: "Threat Assessment",
    pages: 41,
    downloadUrl: "#",
  },
  {
    id: "sahel-information-report",
    title: "Civic Information in the Sahel: A Field Research Report",
    description:
      "Field research findings on information access and ecosystem disruption in conflict-affected areas of Mali, Burkina Faso, and Niger.",
    date: "2024-07-20",
    category: "Field Research",
    pages: 59,
    downloadUrl: "#",
  },
];

export const categories = [
  "All",
  "Elections",
  "Misinformation",
  "Technology",
  "Policy",
  "Conflict",
];

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
