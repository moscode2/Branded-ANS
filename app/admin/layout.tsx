import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Africa Narrative Signals",
  robots: { index: false, follow: false },
};

// Admin has its own layout — no public Navbar/Footer
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080808] text-sand">
      {children}
    </div>
  );
}