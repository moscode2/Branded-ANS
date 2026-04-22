'use client';
import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function NewsletterForm() {
  const [email,        setEmail]        = useState("");
  const [formState,    setFormState]    = useState<FormState>("idle");
  const [responseMsg,  setResponseMsg]  = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("loading");
    try {
      const res  = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (res.ok) { setFormState("success"); setResponseMsg(data.message); setEmail(""); }
      else         { setFormState("error");   setResponseMsg(data.error || "Something went wrong."); }
    } catch { setFormState("error"); setResponseMsg("Network error. Please try again."); }
  };

  return (
    <section className="py-16 border-t border-cyan/5 bg-spaceDeep/70">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="dot-pulse" />
              <span className="text-[0.62rem] tracking-[0.22em] uppercase text-cyan font-semibold">Intelligence Briefing</span>
            </div>
            <h2 className="font-display font-700 text-2xl text-sand tracking-tight mb-2">
              Signals Behind the Stories
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              Weekly analysis on African narrative trends, misinformation incidents, and digital democracy — free, every Friday.
            </p>
          </div>
          <div className="w-full md:w-auto md:min-w-[380px]">
            {formState === "success" ? (
              <div className="border border-cyan/25 bg-cyan/5 px-5 py-4">
                <p className="text-sm text-cyan">{responseMsg}</p>
              </div>
            ) : (
              <>
                <form className="flex gap-0" onSubmit={handleSubmit} noValidate>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="your@email.com" className="form-input text-sm py-3 flex-1" />
                  <button type="submit" disabled={formState === "loading"} className="btn-primary py-3 px-6 text-xs disabled:opacity-50">
                    {formState === "loading" ? "…" : "Subscribe"}
                  </button>
                </form>
                {formState === "error" && <p className="text-xs text-red-400 mt-2">{responseMsg}</p>}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}