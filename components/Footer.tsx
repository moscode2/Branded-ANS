"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-navyMid mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand — matches footer's own font/color system */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 mb-4 group">
            {/* Square logo mark — matches the admin/navbar ANS mark style */}
            <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-cyan/10 border border-cyan/30 group-hover:border-cyan/60 transition-colors" />
            <div className="absolute inset-0 rounded-full bg-cyan/5 blur-sm" />
            <span className="relative font-display font-800 text-sm text-cyan tracking-wider">ANS</span>
          </div>
            <span className="font-mono text-[11px] tracking-[1.5px] uppercase text-gray500/50 group-hover:text-gray500/70 transition-colors leading-tight">
              Africa Narrative Signals
            </span>
          </Link>
          <p className="text-[0.78rem] text-gray500/60 leading-relaxed max-w-[220px]">
            Independent research on political narratives, misinformation, and
            information integrity across Africa.
          </p>
        </div>

        {/* Research */}
        <div>
          <p className="section-label">Research</p>
          <ul className="flex flex-col gap-2.5">
            {[
              { href: "/insights", label: "Insights" },
              { href: "/reports", label: "Reports" },
              { href: "/reports", label: "Working Papers" },
              { href: "/reports", label: "Data" },
            ].map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="gold-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Organization */}
        <div>
          <p className="section-label">Organization</p>
          <ul className="flex flex-col gap-2.5">
            {[
              { href: "/about", label: "About ANS" },
              { href: "/about", label: "Team" },
              { href: "/about", label: "Partners" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="gold-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <p className="section-label">Connect</p>
          <div className="flex items-center gap-3 mt-1">
            {/* Facebook */}
            <Link href="https://www.facebook.com/profile.php?id=61576490236388" aria-label="Facebook"
              className="w-9 h-9 flex items-center justify-center border border-white/10 text-gray500/50 hover:text-gold hover:border-gold/40 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </Link>
            {/* X / Twitter */}
            <Link href="#" aria-label="X (Twitter)"
              className="w-9 h-9 flex items-center justify-center border border-white/10 text-gray500/50 hover:text-gold hover:border-gold/40 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </Link>
            {/* Instagram */}
            <Link href="#" aria-label="Instagram"
              className="w-9 h-9 flex items-center justify-center border border-white/10 text-gray500/50 hover:text-gold hover:border-gold/40 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </Link>
            {/* LinkedIn */}
            <Link href="https://www.linkedin.com/company/africanarrativesignals/posts/?feedView=all" aria-label="LinkedIn"
              className="w-9 h-9 flex items-center justify-center border border-white/10 text-gray500/50 hover:text-gold hover:border-gold/40 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8 max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-[0.7rem] text-gray500/50 font-mono">
          © {new Date().getFullYear()} Africa Narrative Signals. All rights reserved.
        </p>
        <div className="flex gap-8">
          <Link href="#" className="text-[0.7rem] text-gray500/40 hover:text-gray500/70 transition-colors font-mono">
            Privacy Policy
          </Link>
          <Link href="#" className="text-[0.7rem] text-gray500/40 hover:text-gray500/70 transition-colors font-mono">
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
}