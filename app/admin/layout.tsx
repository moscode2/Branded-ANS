"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/lib/adminStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [ready,  setReady] = useState(false);

  useEffect(() => {
    // Login page — always show
    if (pathname === "/admin") {
      setReady(true);
      return;
    }
    // All other admin pages — check auth
    if (isAuthenticated()) {
      setReady(true);
    } else {
      router.replace("/admin");
    }
  }, [pathname, router]);

  // Show a minimal loader while auth check runs (prevents flash AND 404)
  if (!ready) {
    return (
      <div style={{
        minHeight: "100vh", background: "#060a12",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: "#00d4ff",
            animation: "pulse 1.5s ease-in-out infinite",
          }} />
          <style>{`@keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
          <span style={{ fontSize: 12, color: "#7a9bb5", fontFamily: "monospace", letterSpacing: "0.1em" }}>
            LOADING
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}