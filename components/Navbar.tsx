"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/",        label: "Home" },
  { href: "/about",   label: "About" },
  { href: "/insights",label: "Insights" },
  { href: "/reports", label: "Reports" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname  = usePathname();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-spaceDeep/95 backdrop-blur-md border-b border-cyan/8 py-3"
          : "py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* ANS icon — glowing Africa-map dot grid */}
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-cyan/10 border border-cyan/30 group-hover:border-cyan/60 transition-colors" />
            <div className="absolute inset-0 rounded-full bg-cyan/5 blur-sm" />
            <span className="relative font-display font-800 text-sm text-cyan tracking-wider">ANS</span>
          </div>
          <div className="flex flex-col leading-none">
          <span className="font-mono text-[11px] tracking-[1.5px] uppercase text-gray500/50 group-hover:text-gray500/70 transition-colors leading-tight">
              Africa Narrative Signals
            </span>
            <span className="text-[0.52rem] tracking-[0.22em] uppercase text-cyan/60 mt-0.5">
              Narrative Intelligence · Information Integrity . Digital Democracy
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Desktop CTA ── */}
        <Link href="/subscribe" className="hidden md:inline-flex btn-primary">
          Subscribe
        </Link>

        {/* ── Mobile toggle ── */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-1"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-sand transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-px bg-sand transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-sand transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-spaceMid border-t border-cyan/10 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`font-display font-900 text-sm uppercase tracking-wider ${
                pathname === link.href ? "text-cyan" : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/subscribe" className="btn-primary self-start mt-2" onClick={() => setMenuOpen(false)}>
            Subscribe
          </Link>
        </div>
      )}
    </header>
  );
}