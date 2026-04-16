"use client";
import { useEffect, useRef } from "react";

export default function HeroImage() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapRef.current) return;
      // Parallax: video drifts at 30% of scroll speed
      wrapRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Parallax wrapper */}
      <div
        ref={wrapRef}
        className="absolute will-change-transform"
        style={{
          top: "-15%",
          left: 0,
          right: 0,
          bottom: "-15%",
        }}
      >
        <video
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Layer 1: Dark gradient — left heavy so text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(14,14,14,0.93) 0%, rgba(14,14,14,0.78) 50%, rgba(14,14,14,0.45) 100%)",
        }}
      />

      {/* Layer 2: Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-56"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #0e0e0e 100%)",
        }}
      />

      {/* Layer 3: Top fade from nav */}
      <div
        className="absolute top-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to top, transparent 0%, rgba(14,14,14,0.6) 100%)",
        }}
      />

      {/* Layer 4: Warm gold accent glow — right side */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(196,154,60,0.07) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}