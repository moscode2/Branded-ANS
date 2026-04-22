"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin  = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Admin pages: no Navbar, no Footer, full dark background
    return (
      <div style={{ minHeight: "100vh", background: "#060a12" }}>
        {children}
      </div>
    );
  }

  // Public pages: full Navbar + Footer
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}