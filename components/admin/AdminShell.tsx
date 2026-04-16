"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, logout } from "@/lib/adminStore";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard",  icon: "▦" },
  { href: "/admin/articles",  label: "Articles",   icon: "✦" },
  { href: "/admin/reports",   label: "Reports",    icon: "⊡" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/admin");
    } else {
      setReady(true);
    }
  }, [router]);

  function handleLogout() {
    logout();
    router.push("/admin");
  }

  if (!ready) return null;

  return (
    <div className="flex min-h-screen" style={{ background: "#080808" }}>
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-white/6 flex flex-col">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-white/6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-emerald-900 flex items-center justify-center font-mono text-[9px] font-medium text-emerald-200 shrink-0">
              ANS
            </div>
            <div>
              <p className="font-mono text-[9px] tracking-[2px] uppercase text-sand/50 leading-none">Admin</p>
              <p className="font-mono text-[8px] tracking-[1px] uppercase text-sand/25 leading-none mt-0.5">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-[0.72rem] tracking-[0.08em] uppercase font-medium transition-all duration-150 ${
                  active
                    ? "bg-gold/10 text-gold border-l-2 border-gold pl-[10px]"
                    : "text-muted hover:text-sand hover:bg-white/4 border-l-2 border-transparent pl-[10px]"
                }`}
              >
                <span className="text-[0.7rem] w-4">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-5 border-t border-white/6 flex flex-col gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-[0.65rem] tracking-[0.1em] uppercase text-muted/50 hover:text-muted transition-colors"
          >
            <span>↗</span> View site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[0.65rem] tracking-[0.1em] uppercase text-muted/50 hover:text-red-400 transition-colors text-left"
          >
            <span>→</span> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}