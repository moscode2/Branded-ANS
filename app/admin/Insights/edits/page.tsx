"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const CATEGORIES = [
  "Narrative Intelligence", "Information Integrity", "Digital Democracy",
  "Elections", "Misinformation", "Technology", "Policy", "Conflict", "Media", "Research",
];

interface Article {
  id: string; slug: string; title: string; summary: string;
  category: string; date: string; read_time?: string;
  body?: string; author?: string; cover_image?: string;
}

const inp = "w-full px-4 py-3 text-sm outline-none transition-all rounded-sm";
const inpStyle = { background: "#0d1b2e", border: "1px solid #1a3a5c", color: "#e8f4f8" };
const lbl = { display: "block" as const, fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#7a9bb5", marginBottom: 8, fontFamily: "monospace", fontWeight: 600 };

export default function EditInsightPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [form,      setForm]      = useState<Article | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [error,     setError]     = useState("");
  const [toast,     setToast]     = useState("");
  const [notFound,  setNotFound]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDel,setConfirmDel]= useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); return; }
    supabase.from("articles").select("*").eq("id", id).single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setForm(data as Article);
      });
  }, [id]);

  function set(key: keyof Article, val: string) {
    setForm((f) => f ? { ...f, [key]: val } : f);
  }

  // Upload image to Supabase Storage
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !form) return;
    setUploading(true);
    const ext  = file.name.split(".").pop();
    const path = `insights/${form.id}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("ans-media").upload(path, file, { upsert: true });
    if (upErr) { setError("Image upload failed: " + upErr.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("ans-media").getPublicUrl(path);
    set("cover_image", urlData.publicUrl);
    setUploading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true); setError("");
    const { error } = await supabase.from("articles").update({
      title:       form.title,
      summary:     form.summary,
      category:    form.category,
      date:        form.date,
      read_time:   form.read_time,
      author:      form.author,
      body:        form.body,
      cover_image: form.cover_image,
    }).eq("id", id);
    if (error) { setError(error.message); setSaving(false); }
    else {
      setToast("Saved successfully!");
      setTimeout(() => router.push("/admin/insights"), 900);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) { setError(error.message); setDeleting(false); setConfirmDel(false); }
    else router.push("/admin/insights");
  }

  const box: React.CSSProperties = { background: "#0a0f1a", border: "1px solid #1a3a5c", borderRadius: 4, padding: 20, marginBottom: 0 };

  if (notFound) return (
    <AdminShell>
      <div style={{ padding: "80px 0", textAlign: "center" }}>
        <p style={{ color: "#7a9bb5", fontSize: 18, marginBottom: 16 }}>Insight not found</p>
        <Link href="/admin/insights" style={{ color: "#00d4ff", fontSize: 14 }}>← Back to Insights</Link>
      </div>
    </AdminShell>
  );

  if (!form) return (
    <AdminShell>
      <div style={{ padding: "80px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00d4ff", animation: "pulse 1.5s infinite" }} />
        <span style={{ color: "#7a9bb5", fontSize: 13, fontFamily: "monospace" }}>Loading from Supabase…</span>
      </div>
    </AdminShell>
  );

  return (
    <AdminShell>
      <div style={{ maxWidth: 960 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <Link href="/admin/insights" style={{ color: "#7a9bb5", fontSize: 13, textDecoration: "none" }}>← Insights</Link>
          <span style={{ color: "#1a3a5c" }}>/</span>
          <span style={{ color: "#e8f4f8", fontSize: 15, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 400 }}>
            {form.title}
          </span>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{ marginBottom: 20, padding: "12px 16px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", fontSize: 13, borderRadius: 4 }}>
            ⚠ {error}
          </div>
        )}
        {toast && (
          <div style={{ marginBottom: 20, padding: "12px 16px", background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff", fontSize: 13, borderRadius: 4 }}>
            ✓ {toast}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>

            {/* ── LEFT: Content ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Title */}
              <div style={box}>
                <label style={lbl}>Title *</label>
                <input required value={form.title} onChange={(e) => set("title", e.target.value)}
                  className={inp} style={inpStyle} />
                <p style={{ fontSize: 11, color: "#3d5a73", marginTop: 6, fontFamily: "monospace" }}>slug: {form.slug}</p>
              </div>

              {/* Executive Summary */}
              <div style={box}>
                <label style={lbl}>Executive Summary * <span style={{ textTransform: "none", fontWeight: 400, color: "#3d5a73", marginLeft: 6 }}>shown on cards</span></label>
                <textarea required rows={4} value={form.summary} onChange={(e) => set("summary", e.target.value)}
                  style={{ ...inpStyle, width: "100%", resize: "none", padding: "12px 16px", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", borderRadius: 4 }} />
                <p style={{ fontSize: 11, color: "#3d5a73", marginTop: 4, fontFamily: "monospace" }}>{form.summary?.length ?? 0} chars</p>
              </div>

              {/* Cover Image */}
              <div style={box}>
                <label style={lbl}>Cover Image <span style={{ textTransform: "none", fontWeight: 400, color: "#3d5a73", marginLeft: 6 }}>appears at top of article</span></label>

                {form.cover_image && (
                  <div style={{ marginBottom: 12, position: "relative" }}>
                    <img src={form.cover_image} alt="Cover" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 4, border: "1px solid #1a3a5c" }} />
                    <button type="button" onClick={() => set("cover_image", "")}
                      style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", border: "1px solid #f87171", color: "#f87171", padding: "2px 8px", fontSize: 11, borderRadius: 2, cursor: "pointer" }}>
                      Remove
                    </button>
                  </div>
                )}

                <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <div style={{ padding: "10px 20px", background: uploading ? "#1a3a5c" : "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.25)", color: "#00d4ff", fontSize: 12, borderRadius: 4, cursor: "pointer", whiteSpace: "nowrap" }}>
                    {uploading ? "Uploading…" : "Upload Image"}
                  </div>
                  <span style={{ fontSize: 12, color: "#3d5a73" }}>JPG, PNG, WebP — stored in Supabase Storage</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
                </label>

                <div style={{ marginTop: 10 }}>
                  <label style={{ ...lbl, marginBottom: 4 }}>Or paste image URL</label>
                  <input value={form.cover_image ?? ""} onChange={(e) => set("cover_image", e.target.value)}
                    placeholder="https://…" className={inp} style={inpStyle} />
                </div>
              </div>

              {/* Full Body Content */}
              <div style={box}>
                <label style={lbl}>Full Content <span style={{ textTransform: "none", fontWeight: 400, color: "#3d5a73", marginLeft: 6 }}>HTML supported</span></label>

                {/* Quick insert buttons */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                  {[
                    { label: "H2", tag: "" },
                    { label: "P",  tag: "" },
                    { label: "Quote", tag: "" },
                    { label: "List", tag: "" },
                    { label: "Bold", tag: "" },
                    { label: "Image", tag: '' },
                  ].map(({ label: l, tag }) => (
                    <button key={l} type="button"
                      onClick={() => set("body", (form.body ?? "") + "\n" + tag)}
                      style={{ padding: "4px 10px", background: "#0d1b2e", border: "1px solid #1a3a5c", color: "#00d4ff", fontSize: 11, borderRadius: 3, cursor: "pointer", fontFamily: "monospace" }}>
                      {l}
                    </button>
                  ))}
                </div>

                <textarea rows={24} value={form.body ?? ""} onChange={(e) => set("body", e.target.value)}
                  placeholder={``}
                  style={{ ...inpStyle, width: "100%", resize: "vertical", padding: "12px 16px", fontSize: 12, fontFamily: "monospace", lineHeight: 1.7, boxSizing: "border-box", borderRadius: 4 }} />
              </div>
            </div>

            {/* ── RIGHT: Sidebar ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Actions */}
              <div style={box}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#e8f4f8", marginBottom: 14, letterSpacing: "0.08em", textTransform: "uppercase" }}>Actions</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button type="submit" disabled={saving}
                    style={{ padding: "13px", background: saving ? "#1a3a5c" : "linear-gradient(135deg, #00d4ff, #1a6fe8)", color: saving ? "#7a9bb5" : "#060a12", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", borderRadius: 4, cursor: saving ? "not-allowed" : "pointer", transition: "opacity 0.2s" }}>
                    {saving ? "Saving…" : "Save Changes"}
                  </button>

                  <Link href={`/insights/${form.slug}`} target="_blank"
                    style={{ display: "block", padding: "11px", border: "1px solid #1a3a5c", color: "#7a9bb5", fontSize: 12, textAlign: "center", borderRadius: 4, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    ↗ Preview Live
                  </Link>

                  <button type="button" onClick={() => setConfirmDel(true)}
                    style={{ padding: "11px", border: "1px solid rgba(248,113,113,0.2)", color: "rgba(248,113,113,0.6)", fontSize: 12, background: "none", borderRadius: 4, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Delete Insight
                  </button>
                </div>
              </div>

              {/* Category */}
              <div style={box}>
                <label style={lbl}>Category</label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)}
                  style={{ ...inpStyle, width: "100%", padding: "12px 16px", fontSize: 14, borderRadius: 4, appearance: "none" as const }}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Date & Read Time */}
              <div style={box}>
                <div style={{ marginBottom: 14 }}>
                  <label style={lbl}>Publication Date</label>
                  <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)}
                    style={{ ...inpStyle, width: "100%", padding: "12px 16px", fontSize: 14, borderRadius: 4, boxSizing: "border-box" as const }} />
                </div>
                <div>
                  <label style={lbl}>Read Time</label>
                  <input value={form.read_time ?? ""} onChange={(e) => set("read_time", e.target.value)}
                    placeholder="8 min read"
                    style={{ ...inpStyle, width: "100%", padding: "12px 16px", fontSize: 14, borderRadius: 4, boxSizing: "border-box" as const }} />
                </div>
              </div>

              {/* Author */}
              <div style={box}>
                <label style={lbl}>Author</label>
                <input value={form.author ?? ""} onChange={(e) => set("author", e.target.value)}
                  placeholder="e.g. Dr Sue Katue"
                  style={{ ...inpStyle, width: "100%", padding: "12px 16px", fontSize: 14, borderRadius: 4, boxSizing: "border-box" as const }} />
              </div>
            </div>
          </div>
        </form>

        {/* Delete confirm modal */}
        {confirmDel && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
            <div style={{ background: "#0d1b2e", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 8, padding: 32, maxWidth: 400, width: "90%" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#e8f4f8", marginBottom: 8 }}>Delete this insight?</h3>
              <p style={{ fontSize: 13, color: "#7a9bb5", lineHeight: 1.6, marginBottom: 24 }}>
                <strong style={{ color: "#e8f4f8" }}>{form.title}</strong><br />
                This permanently removes the record from Supabase and cannot be undone.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={handleDelete} disabled={deleting}
                  style={{ padding: "10px 24px", background: "#dc2626", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: 4 }}>
                  {deleting ? "Deleting…" : "Yes, delete"}
                </button>
                <button onClick={() => setConfirmDel(false)}
                  style={{ padding: "10px 24px", background: "none", border: "1px solid #1a3a5c", color: "#7a9bb5", fontSize: 13, cursor: "pointer", borderRadius: 4 }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}