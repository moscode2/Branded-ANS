"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/lib/adminStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin") return;
    if (!isAuthenticated()) router.replace("/admin");
  }, [pathname, router]);

  // No wrapping div needed - RootProviders handles the background
  return <>{children}</>;
}