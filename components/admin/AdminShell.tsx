"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { logout, isAuthenticated } from "@/lib/adminStore";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
  )},
  { href: "/admin/insights", label: "Insights", icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  )},
  { href: "/admin/reports", label: "Reports", icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
  )},
  { href: "/admin/subscribers", label: "Subscribers", icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  )},
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  // Auth guard — runs client-side after hydration
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/admin");
    } else {
      setReady(true);
    }
  }, [router]);

  function handleLogout() { logout(); router.push("/admin"); }

  // Prevent flash of protected content before auth check
  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#060a12" }}>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
        <span className="text-[0.62rem] tracking-[0.2em] uppercase text-muted/40 font-mono">Authenticating…</span>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: "#060a12" }}>

      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 border-r border-cyan/8 flex flex-col" style={{ background: "#080d18" }}>

        {/* Brand */}
        <div className="px-5 py-5 border-b border-cyan/8">
          <Link href="/" target="_blank" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
              <div className="absolute inset-0 rounded-full border border-cyan/30 bg-cyan/8 group-hover:border-cyan/60 transition-colors" />
              <span className="relative font-display font-700 text-[10px] text-cyan tracking-wider">ANS</span>
            </div>
            <div>
              <p className="font-display font-700 text-xs text-sand tracking-wider leading-tight">Africa Narrative</p>
              <p className="font-display font-700 text-xs text-cyan tracking-wider leading-tight">Signals</p>
            </div>
          </Link>
          <div className="mt-3 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            <span className="text-[0.55rem] tracking-[0.2em] uppercase text-cyan/50 font-mono">Admin Portal</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-[0.72rem] tracking-[0.06em] font-medium transition-all duration-150 rounded-sm ${
                  active
                    ? "bg-cyan/10 text-cyan border-l-2 border-cyan pl-[10px]"
                    : "text-muted hover:text-sand hover:bg-white/3 border-l-2 border-transparent pl-[10px]"
                }`}
              >
                <span className={active ? "text-cyan" : "text-muted/60"}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mx-4 border-t border-cyan/6" />

        {/* Bottom */}
        <div className="px-4 py-5 flex flex-col gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-[0.65rem] tracking-[0.1em] uppercase text-muted/40 hover:text-cyan/70 transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            View live site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[0.65rem] tracking-[0.1em] uppercase text-muted/40 hover:text-red-400 transition-colors text-left"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="border-b border-cyan/6 px-8 py-3 flex items-center justify-between" style={{ background: "#080d18" }}>
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              if (pathname === item.href || pathname.startsWith(item.href + "/")) {
                return (
                  <span key={item.href} className="text-[0.72rem] tracking-[0.1em] uppercase text-muted font-mono">
                    {item.label}
                  </span>
                );
              }
              return null;
            })}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan/60" />
            <span className="text-[0.62rem] tracking-[0.15em] uppercase text-muted/40 font-mono">Database connected</span>
          </div>
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}