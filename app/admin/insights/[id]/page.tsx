"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const CATEGORIES = ["Politics", "Elections", "Misinformation", "Technology", "Policy", "Conflict", "Media", "Research"];

const inp: React.CSSProperties = {
  background: "#0d1b2e", border: "1px solid #1a3a5c", color: "#e8f4f8",
  padding: "11px 14px", fontSize: 13, width: "100%", outline: "none",
  borderRadius: 4, boxSizing: "border-box", fontFamily: "inherit",
};
const lbl: React.CSSProperties = {
  display: "block", fontSize: "0.62rem", letterSpacing: "0.18em",
  textTransform: "uppercase", color: "#7a9bb5", marginBottom: 7,
  fontFamily: "monospace", fontWeight: 600,
};
const box: React.CSSProperties = {
  background: "#0a0f1a", border: "1px solid #1a3a5c", borderRadius: 4, padding: 18,
};

interface FormState {
  title:     string;
  summary:   string;
  category:  string;
  date:      string;
  read_time: string;
  body:      string;
  slug:      string;
}

export default function EditInsightPage() {
  const router    = useRouter();
  const { id }    = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [toast,   setToast]   = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState<FormState>({
    title: "", summary: "", category: "Politics",
    date: "", read_time: "5 min read", body: "", slug: "",
  });

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setForm({
          title:     data.title     ?? "",
          summary:   data.summary   ?? "",
          category:  data.category  ?? "Politics",
          date:      data.date?.split("T")[0] ?? "",
          read_time: data.read_time ?? "5 min read",
          body:      data.body      ?? "",
          slug:      data.slug      ?? "",
        });
      }
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  function setF(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("articles")
      .update({
        title:     form.title,
        summary:   form.summary,
        category:  form.category,
        date:      form.date,
        read_time: form.read_time,
        body:      form.body,
      })
      .eq("id", id);

    if (error) {
      showToast("Error saving: " + error.message, "error");
      setSaving(false);
    } else {
      showToast("Insight updated!");
      setTimeout(() => router.push("/admin/insights"), 800);
    }
  }

  if (loading) return (
    <AdminShell>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "60px 0" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00d4ff", animation: "pulse 1s infinite" }} />
        <span style={{ fontSize: 13, color: "#7a9bb5", fontFamily: "monospace" }}>Loading article…</span>
      </div>
    </AdminShell>
  );

  if (notFound) return (
    <AdminShell>
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ fontSize: 18, color: "#7a9bb5", marginBottom: 16 }}>Article not found.</p>
        <Link href="/admin/insights" style={{ color: "#00d4ff", fontSize: 13 }}>← Back to insights</Link>
      </div>
    </AdminShell>
  );

  return (
    <AdminShell>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
        <Link href="/admin/insights"
          style={{ fontSize: 12, color: "#7a9bb5", textDecoration: "none", padding: "6px 12px", border: "1px solid #1a3a5c", borderRadius: 4 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#e8f4f8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#7a9bb5")}>
          ← Insights
        </Link>
        <span style={{ color: "#1a3a5c" }}>/</span>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#e8f4f8", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 500 }}>
          {form.title || "Edit Insight"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 16 }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            <div style={box}>
              <label style={lbl}>Title *</label>
              <input required value={form.title} onChange={(e) => setF("title", e.target.value)}
                placeholder="Article title" style={inp} />
            </div>

            <div style={box}>
              <label style={lbl}>Summary * <span style={{ textTransform: "none", fontWeight: 400, color: "#3d5a73" }}>— shown on article cards</span></label>
              <textarea required rows={3} value={form.summary} onChange={(e) => setF("summary", e.target.value)}
                placeholder="A concise summary…" style={{ ...inp, resize: "none" }} />
            </div>

            <div style={box}>
              <label style={lbl}>
                Body Content <span style={{ textTransform: "none", fontWeight: 400, color: "#3d5a73" }}>— HTML: &lt;h2&gt;, &lt;p&gt;, &lt;blockquote&gt;, &lt;ul&gt;</span>
              </label>
              <textarea rows={18} value={form.body} onChange={(e) => setF("body", e.target.value)}
                style={{ ...inp, resize: "vertical", fontFamily: "monospace", fontSize: 12, lineHeight: 1.6 }} />
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            <div style={box}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#e8f4f8", marginBottom: 14, letterSpacing: "0.08em", textTransform: "uppercase" }}>Update</p>
              <button type="submit" disabled={saving}
                style={{ width: "100%", padding: 13, background: saving ? "#1a3a5c" : "linear-gradient(135deg, #00d4ff, #1a6fe8)", color: saving ? "#7a9bb5" : "#060a12", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", borderRadius: 4, cursor: saving ? "not-allowed" : "pointer", marginBottom: 10 }}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <div style={{ display: "flex", gap: 8 }}>
                <Link href="/admin/insights"
                  style={{ flex: 1, display: "block", textAlign: "center", padding: 11, border: "1px solid #1a3a5c", color: "#7a9bb5", fontSize: 12, borderRadius: 4, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Cancel
                </Link>
                {form.slug && (
                  <Link href={`/insights/${form.slug}`} target="_blank"
                    style={{ display: "block", textAlign: "center", padding: 11, border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff", fontSize: 12, borderRadius: 4, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    ↗ Live
                  </Link>
                )}
              </div>
            </div>

            <div style={box}>
              <label style={lbl}>Category</label>
              <select value={form.category} onChange={(e) => setF("category", e.target.value)}
                style={{ ...inp, appearance: "none" }}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={box}>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Publish Date</label>
                <input type="date" value={form.date} onChange={(e) => setF("date", e.target.value)} style={inp} />
              </div>
              <div>
                <label style={lbl}>Read Time</label>
                <input value={form.read_time} onChange={(e) => setF("read_time", e.target.value)}
                  placeholder="5 min read" style={inp} />
              </div>
            </div>

            <div style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)", borderRadius: 4, padding: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#7a9bb5", marginBottom: 4, fontFamily: "monospace" }}>ID</p>
              <p style={{ fontSize: 10, color: "#3d5a73", fontFamily: "monospace", wordBreak: "break-all" }}>{id}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#7a9bb5", marginTop: 10, marginBottom: 4, fontFamily: "monospace" }}>Slug</p>
              <p style={{ fontSize: 10, color: "#3d5a73", fontFamily: "monospace" }}>{form.slug}</p>
            </div>
          </div>
        </div>
      </form>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200, padding: "12px 20px", borderRadius: 4, fontSize: 13, fontFamily: "monospace", background: toast.type === "error" ? "#450a0a" : "#0d1b2e", border: toast.type === "error" ? "1px solid rgba(248,113,113,0.4)" : "1px solid rgba(0,212,255,0.3)", color: toast.type === "error" ? "#f87171" : "#00d4ff" }}>
          {toast.type === "error" ? "✗" : "✓"} {toast.msg}
        </div>
      )}
    </AdminShell>
  );
}