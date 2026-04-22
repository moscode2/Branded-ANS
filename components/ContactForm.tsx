'use client';
import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [name,         setName]         = useState("");
  const [email,        setEmail]        = useState("");
  const [organization, setOrganization] = useState("");
  const [inquiryType,  setInquiryType]  = useState("");
  const [message,      setMessage]      = useState("");
  const [subscribe,    setSubscribe]    = useState(false);
  const [formState,    setFormState]    = useState<FormState>("idle");
  const [responseMsg,  setResponseMsg]  = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("loading");
    try {
      const res  = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, organization, inquiryType, message, subscribe }) });
      const data = await res.json();
      if (res.ok) {
        setFormState("success"); setResponseMsg(data.message);
        setName(""); setEmail(""); setOrganization(""); setInquiryType(""); setMessage(""); setSubscribe(false);
      } else {
        setFormState("error"); setResponseMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch { setFormState("error"); setResponseMsg("Network error. Please check your connection."); }
  };

  const inputClass = "bg-spaceMid border border-cyan/15 px-4 py-3 text-sm text-sand placeholder:text-muted/40 outline-none focus:border-cyan/40 focus:shadow-[0_0_0_2px_rgba(0,212,255,0.06)] transition-all";

  return (
    <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.62rem] tracking-[0.18em] uppercase text-muted font-semibold">Full Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" required placeholder="Your name" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.62rem] tracking-[0.18em] uppercase text-muted font-semibold">Email Address *</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="your@email.com" className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.62rem] tracking-[0.18em] uppercase text-muted font-semibold">Organization</label>
        <input value={organization} onChange={(e) => setOrganization(e.target.value)} type="text" placeholder="Your organization (optional)" className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.62rem] tracking-[0.18em] uppercase text-muted font-semibold">Inquiry Type</label>
        <select value={inquiryType} onChange={(e) => setInquiryType(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
          <option value="">Select type</option>
          <option>Research Inquiry</option>
          <option>Media Request</option>
          <option>Partnership Proposal</option>
          <option>Newsletter Subscription</option>
          <option>General</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.62rem] tracking-[0.18em] uppercase text-muted font-semibold">Message *</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={6} placeholder="Tell us about your inquiry..." className={`${inputClass} resize-none`} />
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" checked={subscribe} onChange={(e) => setSubscribe(e.target.checked)} id="newsletter" className="accent-cyan" />
        <label htmlFor="newsletter" className="text-sm text-muted cursor-pointer">Subscribe me to the ANS weekly intelligence briefing</label>
      </div>

      {formState === "success" && (
        <div className="border border-cyan/25 bg-cyan/5 px-4 py-3">
          <p className="text-sm text-cyan">{responseMsg}</p>
        </div>
      )}
      {formState === "error" && (
        <div className="border border-red-500/25 bg-red-500/5 px-4 py-3">
          <p className="text-sm text-red-400">{responseMsg}</p>
        </div>
      )}

      <button type="submit" disabled={formState === "loading"} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
        {formState === "loading" ? "Sending…" : "Send Message →"}
      </button>

      <p className="text-[0.62rem] text-muted/40">
        We typically respond within 2–3 business days. For urgent media requests, please indicate in your message.
      </p>
    </form>
  );
}