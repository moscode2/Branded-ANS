import type { Metadata } from "next";
import "./globals.css";
import RootProviders from "@/components/RootProviders";

export const metadata: Metadata = {
  title: {
    default: "Africa Narrative Signals | Signals Behind the Stories",
    template: "%s | Africa Narrative Signals",
  },
  description: "Africa Narrative Signals (ANS) decodes political narratives, protects truth, and powers digital democracy across Africa.",
  openGraph: {
    title: "Africa Narrative Signals — Signals Behind the Stories",
    description: "We decode narratives. We protect truth. We power digital democracy across Africa.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-space text-sand">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}