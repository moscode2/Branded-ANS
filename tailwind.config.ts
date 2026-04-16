import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── ANS Brand: Deep Space Blue + Cyan ──
        space:     "#060a12",       // deepest bg
        spaceDeep: "#080d18",       // hero bg
        spaceMid:  "#0d1b2e",       // card bg
        spaceLight:"#112240",       // elevated surface
        spaceBorder:"#1a3a5c",      // subtle borders

        cyan:      "#00d4ff",       // primary accent — electric cyan
        cyanDim:   "#0099cc",       // secondary cyan
        cyanGlow:  "#00d4ff22",     // glow tint
        blue:      "#1a6fe8",       // data-viz blue
        blueLight: "#4a9eff",       // lighter blue

        sand:      "#e8f4f8",       // near-white text
        muted:     "#7a9bb5",       // subdued text
        mutedDark: "#3d5a73",       // very muted

        gold:      "#f0a500",       // warm accent (kept for tags/CTAs)
        gold2:     "#f5bc3a",

        // legacy aliases
        ink:       "#060a12",
        ink2:      "#080d18",
        ink3:      "#0d1b2e",
      },
      fontFamily: {
        display: ["'Barlow Condensed'", "'DM Sans'", "sans-serif"],
        body:    ["'DM Sans'", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      boxShadow: {
        "cyan-glow":  "0 0 30px rgba(0,212,255,0.15), 0 0 60px rgba(0,212,255,0.06)",
        "cyan-glow-sm":"0 0 12px rgba(0,212,255,0.2)",
        "blue-glow":  "0 0 40px rgba(26,111,232,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
