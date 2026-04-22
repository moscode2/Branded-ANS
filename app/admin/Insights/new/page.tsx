"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const CATEGORIES = [
  "Narrative Intelligence", "Information Integrity", "Digital Democracy",
  "Elections", "Misinformation", "Technology", "Policy", "Conflict", "Media", "Research",
];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const inp = { background: "#0d1b2e", border: "1px solid #1a3a5c", color: "#e8f4f8", padding: "12px 16px", fontSize: 14, width: "100%", outline: "none", borderRadius: 4, boxSizing: "border-box" as const, fontFamily: "inherit" };
const lbl = { display: "block" as const, fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#7a9bb5", marginBottom: 8, fontFamily: "monospace", fontWeight: 600 };
const box: React.CSSProperties = { background: "#0a0f1a", border: "1px solid #1a3a5c", borderRadius: 4, padding: 20 };

export default function NewInsightPage() {
  const router = useRouter();
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState("");
  const [form, setForm] = useState({
    title: "", summary: "", category: "Narrative Intelligence",
    date: new Date().toISOString().split("T")[0],
    read_time: "5 min read", author: "", body: "", cover_image: "",
  });

  function set(key: string, val: string) { setForm((f) => ({ ...f, [key]: val })); }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext  = file.name.split(".").pop();
    const path = `insights/new-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("ans-media").upload(path, file, { upsert: true });
    if (upErr) { setError("Upload failed: " + upErr.message); setUploading(false); return; }
    const { data } = supabase.storage.from("ans-media").getPublicUrl(path);
    set("cover_image", data.publicUrl);
    setUploading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const slug = slugify(form.title);
    const payload: Record<string, unknown> = {
      slug, title: form.title, summary: form.summary,
      category: form.category, date: form.date, read_time: form.read_time,
    };
    if (form.author)      payload.author      = form.author;
    if (form.body)        payload.body        = form.body;
    if (form.cover_image) payload.cover_image = form.cover_image;

    const { error } = await supabase.from("articles").insert([payload]);
    if (error) { setError(error.message); setSaving(false); }
    else router.push("/admin/insights");
  }

  return (
    <AdminShell>
      <div style={{ maxWidth: 960 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <Link href="/admin/insights" style={{ color: "#7a9bb5", fontSize: 13, textDecoration: "none" }}>â† Insights</Link>
          <span style={{ color: "#1a3a5c" }}>/</span>
          <span style={{ color: "#e8f4f8", fontSize: 15, fontWeight: 600 }}>New Insight</span>
        </div>

        {error && (
          <div style={{ marginBottom: 20, padding: "12px 16px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", fontSize: 13, borderRadius: 4 }}>
            âš  {error}
            {error.includes("body") || error.includes("cover") ? (
              <p style={{ marginTop: 6, fontSize: 11, color: "rgba(248,113,113,0.7)" }}>
                Run the ALTER TABLE lines in SUPABASE_SETUP.sql to add missing columns.
              </p>
            ) : null}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>

            {/* LEFT */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Title */}
              <div style={box}>
                <label style={lbl}>Title *</label>
                <input required value={form.title} onChange={(e) => set("title", e.target.value)}
                  placeholder=" Signals Behind the Stories.."
                  style={inp} />
                {form.title && <p style={{ fontSize: 11, color: "#3d5a73", marginTop: 6, fontFamily: "monospace" }}>slug: {slugify(form.title)}</p>}
              </div>

              {/* Summary */}
              <div style={box}>
                <label style={lbl}>Executive Summary * <span style={{ textTransform: "none", fontWeight: 400, color: "#3d5a73", marginLeft: 6 }}>shown on cards & article intro</span></label>
                <textarea required rows={4} value={form.summary} onChange={(e) => set("summary", e.target.value)}
                  placeholder="A concise overview of the insight's key findings...."
                  style={{ ...inp, resize: "none" as const }} />
                <p style={{ fontSize: 11, color: "#3d5a73", marginTop: 4, fontFamily: "monospace" }}>{form.summary.length} chars</p>
              </div>

              {/* Cover Image */}
              <div style={box}>
                <label style={lbl}>Cover Image <span style={{ textTransform: "none", fontWeight: 400, color: "#3d5a73", marginLeft: 6 }}>appears at top of article</span></label>

                {form.cover_image && (
                  <div style={{ marginBottom: 12, position: "relative" }}>
                    <img src={form.cover_image} alt="Cover preview" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 4, border: "1px solid #1a3a5c" }} />
                    <button type="button" onClick={() => set("cover_image", "")}
                      style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.75)", border: "1px solid #f87171", color: "#f87171", padding: "2px 10px", fontSize: 11, borderRadius: 2, cursor: "pointer" }}>
                      Remove
                    </button>
                  </div>
                )}

                <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 10 }}>
                  <div style={{ padding: "10px 20px", background: uploading ? "#1a3a5c" : "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.25)", color: uploading ? "#7a9bb5" : "#00d4ff", fontSize: 12, borderRadius: 4, whiteSpace: "nowrap" as const }}>
                    {uploading ? "Uploadingâ€¦" : "â†‘ Upload Image"}
                  </div>
                  <span style={{ fontSize: 12, color: "#3d5a73" }}>JPG, PNG, WebP</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
                </label>

                <label style={lbl}> image URL</label>
                <input value={form.cover_image} onChange={(e) => set("cover_image", e.target.value)}
                  placeholder="https:.." style={inp} />
              </div>
               {/* Body */}
               <div style={box}>
                <label style={lbl}>Full Content <span style={{ textTransform: "none", fontWeight: 400, color: "#3d5a73", marginLeft: 6 }}>HTML supported</span></label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                  {[
                    { l: "H2",    t: "" },
                    { l: "P",     t: "" },
                    { l: "Quote", t: "" },
                    { l: "List",  t: "" },
                    { l: "Bold",  t: "" },
                    { l: "Image", t: '' },
                  ].map(({ l, t }) => (
                    <button key={l} type="button" onClick={() => set("body", form.body + "\n" + t)}
                      style={{ padding: "4px 10px", background: "#0d1b2e", border: "1px solid #1a3a5c", color: "#00d4ff", fontSize: 11, borderRadius: 3, cursor: "pointer", fontFamily: "monospace" }}>
                      {l}
                    </button>
                  ))}
                </div>
                <textarea rows={24} value={form.body} onChange={(e) => set("body", e.target.value)}
                  placeholder={`Full content here..`}
                  style={{ ...inp, resize: "vertical" as const, fontFamily: "monospace", fontSize: 12, lineHeight: 1.7 }} />
              </div>
            </div>

            {/* RIGHT */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Publish */}
              <div style={box}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#e8f4f8", marginBottom: 14, letterSpacing: "0.08em", textTransform: "uppercase" }}>Publish</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button type="submit" disabled={saving}
                    style={{ padding: 13, background: saving ? "#1a3a5c" : "linear-gradient(135deg, #00d4ff, #1a6fe8)", color: saving ? "#7a9bb5" : "#060a12", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", borderRadius: 4, cursor: saving ? "not-allowed" : "pointer" }}>
                    {saving ? "Publishingâ€¦" : "Publish Insight"}
                  </button>
                  <Link href="/admin/insights"
                    style={{ display: "block", padding: 11, border: "1px solid #1a3a5c", color: "#7a9bb5", fontSize: 12, textAlign: "center", borderRadius: 4, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Cancel
                  </Link>
                </div>
              </div>

              {/* Category */}
              <div style={box}>
                <label style={lbl}>Category</label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)}
                  style={{ ...inp, appearance: "none" as const }}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Date & Read time */}
              <div style={box}>
                <div style={{ marginBottom: 14 }}>
                  <label style={lbl}>Publication Date</label>
                  <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Read Time</label>
                  <input value={form.read_time} onChange={(e) => set("read_time", e.target.value)} placeholder="8 min read" style={inp} />
                </div>
              </div>

              {/* Author */}
              <div style={box}>
                <label style={lbl}>Author</label>
                <input value={form.author} onChange={(e) => set("author", e.target.value)}
                  placeholder="Sir Henry" style={inp} />
              </div>

            </div>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}