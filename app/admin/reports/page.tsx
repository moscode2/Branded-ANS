"use client";
import { useEffect, useState, memo } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { supabase } from "@/lib/supabase";

interface Report {
  id: string; title: string; description: string;
  file_url?: string; cover_image?: string; date: string;
  category?: string; pages?: number; author?: string;
}

type FormState = Omit<Report, "id">;

const EMPTY: FormState = {
  title: "", description: "", file_url: "", cover_image: "",
  date: new Date().toISOString().split("T")[0],
  category: "Report", pages: undefined, author: "",
};

const CATEGORIES = [
  "Annual Report", "Strategic Briefing", "Election Report",
  "Disinformation", "Policy Brief", "Threat Assessment", "Field Research", "Report",
];

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const inp: React.CSSProperties = {
  background: "#0d1b2e", border: "1px solid #1a3a5c", color: "#e8f4f8",
  padding: "11px 14px", fontSize: 13, width: "100%", outline: "none",
  borderRadius: 4, boxSizing: "border-box", fontFamily: "inherit",
  transition: "border-color 0.2s",
};
const lbl: React.CSSProperties = {
  display: "block", fontSize: "0.62rem", letterSpacing: "0.18em",
  textTransform: "uppercase", color: "#7a9bb5", marginBottom: 7,
  fontFamily: "monospace", fontWeight: 600,
};
const box: React.CSSProperties = {
  background: "#0a0f1a", border: "1px solid #1a3a5c",
  borderRadius: 4, padding: 18,
};

// ─────────────────────────────────────────────────────────────────────────────
// ReportForm is defined OUTSIDE the page component so React never unmounts it
// on parent re-render — this is what fixes the cursor-jumping bug.
// ─────────────────────────────────────────────────────────────────────────────
interface FormProps {
  form: FormState;
  setF: (key: string, val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
  saving: boolean;
  uploadingImg: boolean;
  uploadingPDF: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPDFUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mode: "add" | "edit";
}

const ReportForm = memo(function ReportForm({
  form, setF, onSubmit, onCancel, submitLabel, saving,
  uploadingImg, uploadingPDF, onImageUpload, onPDFUpload, mode,
}: FormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 16, marginBottom: 24 }}>

        {/* LEFT: Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Title */}
          <div style={box}>
            <label style={lbl}>Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setF("title", e.target.value)}
              placeholder=" Signals Behind the Stories"
              style={inp}
            />
          </div>

          {/* Description */}
          <div style={box}>
            <label style={lbl}>
              Description *{" "}
              <span style={{ textTransform: "none", fontWeight: 400, color: "#3d5a73", marginLeft: 6 }}>
                shown on report cards
              </span>
            </label>
            <textarea
              required rows={4}
              value={form.description}
              onChange={(e) => setF("description", e.target.value)}
              placeholder="A concise summary of the report's scope, methodology, and key findings..."
              style={{ ...inp, resize: "none" }}
            />
            <p style={{ fontSize: 11, color: "#3d5a73", marginTop: 4, fontFamily: "monospace" }}>
              {form.description.length} chars
            </p>
          </div>

          {/* Cover Image */}
          <div style={box}>
            <label style={lbl}>
              Cover Image{" "}
              <span style={{ textTransform: "none", fontWeight: 400, color: "#3d5a73", marginLeft: 6 }}>
                report thumbnail / hero
              </span>
            </label>

            {form.cover_image && (
              <div style={{ marginBottom: 12, position: "relative" }}>
                <img src={form.cover_image} alt="Cover"
                  style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 4, border: "1px solid #1a3a5c" }} />
                <button type="button" onClick={() => setF("cover_image", "")}
                  style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.75)", border: "1px solid #f87171", color: "#f87171", padding: "3px 10px", fontSize: 11, borderRadius: 3, cursor: "pointer" }}>
                  Remove
                </button>
              </div>
            )}

            <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 10 }}>
              <div style={{ padding: "10px 18px", background: uploadingImg ? "#1a3a5c" : "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.25)", color: uploadingImg ? "#7a9bb5" : "#00d4ff", fontSize: 12, borderRadius: 4, whiteSpace: "nowrap" }}>
                {uploadingImg ? "Uploading…" : "↑ Upload Image"}
              </div>
              <span style={{ fontSize: 12, color: "#3d5a73" }}>JPG, PNG, WebP</span>
              <input type="file" accept="image/*" onChange={onImageUpload} style={{ display: "none" }} disabled={uploadingImg} />
            </label>

            <label style={{ ...lbl, marginBottom: 6 }}>Or paste image URL</label>
            <input
              value={form.cover_image ?? ""}
              onChange={(e) => setF("cover_image", e.target.value)}
              placeholder="https://…"
              style={inp}
            />
          </div>

          {/* PDF Upload */}
          <div style={box}>
            <label style={lbl}>
              Report PDF{" "}
              <span style={{ textTransform: "none", fontWeight: 400, color: "#3d5a73", marginLeft: 6 }}>
                downloadable file
              </span>
            </label>

            {form.file_url && (
              <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 4 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <a href={form.file_url} target="_blank" rel="noreferrer"
                  style={{ fontSize: 12, color: "#00d4ff", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: "none" }}>
                  {form.file_url.split("/").pop() || "View PDF ↗"}
                </a>
                <button type="button" onClick={() => setF("file_url", "")}
                  style={{ background: "none", border: "none", color: "#f87171", fontSize: 18, cursor: "pointer", lineHeight: 1 }}>
                  ×
                </button>
              </div>
            )}

            <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 10 }}>
              <div style={{ padding: "10px 18px", background: uploadingPDF ? "#1a3a5c" : "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.25)", color: uploadingPDF ? "#7a9bb5" : "#00d4ff", fontSize: 12, borderRadius: 4, whiteSpace: "nowrap" }}>
                {uploadingPDF ? "Uploading PDF…" : "↑ Upload PDF"}
              </div>
              <span style={{ fontSize: 12, color: "#3d5a73" }}>PDF files only — stored in Supabase Storage</span>
              <input type="file" accept="application/pdf" onChange={onPDFUpload} style={{ display: "none" }} disabled={uploadingPDF} />
            </label>

            <label style={{ ...lbl, marginBottom: 6 }}>Or paste PDF / external URL</label>
            <input
              value={form.file_url ?? ""}
              onChange={(e) => setF("file_url", e.target.value)}
              placeholder="https://… or Supabase storage URL"
              style={inp}
            />
          </div>
        </div>

        {/* RIGHT: Metadata */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Publish actions */}
          <div style={box}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#e8f4f8", marginBottom: 14, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {mode === "edit" ? "Update" : "Publish"}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button type="submit" disabled={saving}
                style={{ padding: 13, background: saving ? "#1a3a5c" : "linear-gradient(135deg, #00d4ff, #1a6fe8)", color: saving ? "#7a9bb5" : "#060a12", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", borderRadius: 4, cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "Saving…" : submitLabel}
              </button>
              <button type="button" onClick={onCancel}
                style={{ padding: 11, border: "1px solid #1a3a5c", background: "none", color: "#7a9bb5", fontSize: 12, borderRadius: 4, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Cancel
              </button>
            </div>
          </div>

          {/* Category */}
          <div style={box}>
            <label style={lbl}>Category</label>
            <select value={form.category ?? "Report"} onChange={(e) => setF("category", e.target.value)}
              style={{ ...inp, appearance: "none" }}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Date + Pages */}
          <div style={box}>
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Publication Date</label>
              <input type="date" value={form.date} onChange={(e) => setF("date", e.target.value)} style={inp} />
            </div>
            <div>
              <label style={lbl}>Number of Pages</label>
              <input type="number" value={form.pages ?? ""}
                onChange={(e) => setF("pages", e.target.value)}
                placeholder="" style={inp} />
            </div>
          </div>

          {/* Author */}
          <div style={box}>
            <label style={lbl}>Lead Researcher</label>
            <input
              value={form.author ?? ""}
              onChange={(e) => setF("author", e.target.value)}
              placeholder=" Sir Henry"
              style={inp}
            />
          </div>
        </div>
      </div>
    </form>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Page component — only state lives here, form is stable above
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminReportsPage() {
  const [reports,      setReports]      = useState<Report[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [mode,         setMode]         = useState<"list" | "add" | "edit">("list");
  const [editing,      setEditing]      = useState<Report | null>(null);
  const [saving,       setSaving]       = useState(false);
  const [confirm,      setConfirm]      = useState<string | null>(null);
  const [toast,        setToast]        = useState<{ msg: string; type: "success" | "error" }>({ msg: "", type: "success" });
  const [form,         setForm]         = useState<FormState>(EMPTY);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingPDF, setUploadingPDF] = useState(false);

  async function fetchReports() {
    setLoading(true);
    const { data, error } = await supabase.from("reports").select("*").order("date", { ascending: false });
    if (error) showToast("Failed to load: " + error.message, "error");
    else setReports(data as Report[]);
    setLoading(false);
  }

  useEffect(() => { fetchReports(); }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    const ext  = file.name.split(".").pop();
    const path = `reports/cover-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("ans-media").upload(path, file, { upsert: true });
    if (upErr) { showToast("Image upload failed: " + upErr.message, "error"); setUploadingImg(false); return; }
    const { data } = supabase.storage.from("ans-media").getPublicUrl(path);
    setF("cover_image", data.publicUrl);
    setUploadingImg(false);
  }

  async function handlePDFUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPDF(true);
    const path = `reports/pdf-${Date.now()}.pdf`;
    const { error: upErr } = await supabase.storage.from("ans-media").upload(path, file, { upsert: true, contentType: "application/pdf" });
    if (upErr) { showToast("PDF upload failed: " + upErr.message, "error"); setUploadingPDF(false); return; }
    const { data } = supabase.storage.from("ans-media").getPublicUrl(path);
    setF("file_url", data.publicUrl);
    showToast("PDF uploaded successfully.");
    setUploadingPDF(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const { error } = await supabase.from("reports").insert([{
      title: form.title, description: form.description,
      file_url: form.file_url || null, cover_image: form.cover_image || null,
      date: form.date, category: form.category,
      pages: form.pages ? Number(form.pages) : null,
      author: form.author || null,
    }]);
    if (error) showToast("Error adding: " + error.message, "error");
    else { showToast("Report published."); setMode("list"); setForm(EMPTY); fetchReports(); }
    setSaving(false);
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault(); if (!editing) return; setSaving(true);
    const { error } = await supabase.from("reports").update({
      title: form.title, description: form.description,
      file_url: form.file_url || null, cover_image: form.cover_image || null,
      date: form.date, category: form.category,
      pages: form.pages ? Number(form.pages) : null,
      author: form.author || null,
    }).eq("id", editing.id);
    if (error) showToast("Error saving: " + error.message, "error");
    else { showToast("Report updated."); setMode("list"); setEditing(null); setForm(EMPTY); fetchReports(); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (error) showToast("Error deleting: " + error.message, "error");
    else { showToast("Report deleted."); setReports((p) => p.filter((r) => r.id !== id)); }
    setConfirm(null);
  }

  function openEdit(r: Report) {
    setEditing(r);
    setForm({ title: r.title, description: r.description, file_url: r.file_url ?? "", cover_image: r.cover_image ?? "", date: r.date, category: r.category ?? "Report", pages: r.pages, author: r.author ?? "" });
    setMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setF(key: string, val: string) { setForm((f) => ({ ...f, [key]: val })); }

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 4000);
  }

  function cancelForm() { setMode("list"); setEditing(null); setForm(EMPTY); }

  return (
    <AdminShell>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#e8f4f8", letterSpacing: "0.02em", margin: 0 }}>Reports</h1>
          <p style={{ fontSize: 12, color: "#7a9bb5", marginTop: 4 }}>
            {loading ? "Loading from Supabase…" : `${reports.length} publication${reports.length !== 1 ? "s" : ""} in database`}
          </p>
        </div>
        {mode === "list" && (
          <button onClick={() => setMode("add")}
            style={{ padding: "10px 20px", background: "linear-gradient(135deg, #00d4ff, #1a6fe8)", color: "#060a12", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", borderRadius: 4, cursor: "pointer" }}>
            + Add Report
          </button>
        )}
      </div>

      {/* Add form */}
      {mode === "add" && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#e8f4f8" }}>New Report</span>
            <div style={{ height: 1, flex: 1, background: "#1a3a5c" }} />
          </div>
          <ReportForm
            form={form} setF={setF} onSubmit={handleAdd} onCancel={cancelForm}
            submitLabel="Publish Report" saving={saving} mode="add"
            uploadingImg={uploadingImg} uploadingPDF={uploadingPDF}
            onImageUpload={handleImageUpload} onPDFUpload={handlePDFUpload}
          />
        </div>
      )}

      {/* Edit form */}
      {mode === "edit" && editing && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#e8f4f8" }}>
              Editing: <span style={{ color: "#00d4ff" }}>{editing.title.slice(0, 50)}{editing.title.length > 50 ? "…" : ""}</span>
            </span>
            <div style={{ height: 1, flex: 1, background: "#1a3a5c" }} />
          </div>
          <ReportForm
            form={form} setF={setF} onSubmit={handleEdit} onCancel={cancelForm}
            submitLabel="Save Changes" saving={saving} mode="edit"
            uploadingImg={uploadingImg} uploadingPDF={uploadingPDF}
            onImageUpload={handleImageUpload} onPDFUpload={handlePDFUpload}
          />
        </div>
      )}

      {/* Table */}
      <div style={{ border: "1px solid #1a3a5c", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 90px 100px 110px", padding: "10px 16px", background: "#080d18", borderBottom: "1px solid #1a3a5c" }}>
          {["Cover", "Title", "Category", "Pages", "Date", "Actions"].map((h) => (
            <span key={h} style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(122,155,181,0.5)", fontWeight: 600 }}>{h}</span>
          ))}
        </div>

        {loading && [...Array(3)].map((_, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 90px 100px 110px", padding: "14px 16px", borderBottom: "1px solid #0d2035" }}>
            {[...Array(6)].map((__, j) => (
              <div key={j} style={{ height: 10, background: "#1a3a5c", borderRadius: 3, width: "60%", marginTop: 4 }} />
            ))}
          </div>
        ))}

        {!loading && reports.length === 0 && (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#7a9bb5", marginBottom: 8 }}>No reports yet.</p>
            <button onClick={() => setMode("add")} style={{ fontSize: 12, color: "#00d4ff", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              Add your first report →
            </button>
          </div>
        )}

        {!loading && reports.map((r) => (
          <div key={r.id}
            style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 90px 100px 110px", padding: "12px 16px", borderBottom: "1px solid #0d2035", alignItems: "center", transition: "background 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>

            <div style={{ width: 44, height: 32, borderRadius: 3, overflow: "hidden", background: "#1a3a5c" }}>
              {r.cover_image
                ? <img src={r.cover_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3d5a73" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9l4-4 4 4 4-5 4 5"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
                  </div>
              }
            </div>

            <div style={{ minWidth: 0, paddingRight: 16 }}>
              <p style={{ fontSize: 12, color: "#e8f4f8", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</p>
              <p style={{ fontSize: 11, color: "rgba(122,155,181,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{r.description?.slice(0, 60)}…</p>
            </div>

            <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)", padding: "2px 7px", borderRadius: 2, background: "rgba(0,212,255,0.05)", whiteSpace: "nowrap" }}>
              {r.category ?? "Report"}
            </span>
            <span style={{ fontSize: 11, color: "#7a9bb5", fontFamily: "monospace" }}>{r.pages ? `${r.pages} pp.` : "—"}</span>
            <span style={{ fontSize: 11, color: "#7a9bb5", fontFamily: "monospace" }}>{fmt(r.date)}</span>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {r.file_url && (
                <a href={r.file_url} target="_blank" rel="noreferrer"
                  style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,212,255,0.5)", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0,212,255,0.5)")}>
                  PDF ↗
                </a>
              )}
              <button onClick={() => openEdit(r)}
                style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7a9bb5", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a9bb5")}>
                Edit
              </button>
              <button onClick={() => setConfirm(r.id)}
                style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7a9bb5", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a9bb5")}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 10, color: "rgba(122,155,181,0.25)", fontFamily: "monospace", marginTop: 8 }}>
        ↳ supabase · table: reports · ordered by date desc
      </p>

      {/* Delete modal */}
      {confirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#0d1b2e", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 8, padding: 32, maxWidth: 400, width: "90%" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#e8f4f8", marginBottom: 8 }}>Delete report?</h3>
            <p style={{ fontSize: 13, color: "#7a9bb5", lineHeight: 1.6, marginBottom: 24 }}>
              Permanently removes the record from Supabase. The file itself is not deleted from storage.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => handleDelete(confirm)} style={{ padding: "10px 24px", background: "#dc2626", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, borderRadius: 4, cursor: "pointer" }}>
                Yes, delete
              </button>
              <button onClick={() => setConfirm(null)} style={{ padding: "10px 24px", background: "none", border: "1px solid #1a3a5c", color: "#7a9bb5", fontSize: 13, borderRadius: 4, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.msg && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200, padding: "12px 20px", borderRadius: 4, fontSize: 13, fontFamily: "monospace", background: toast.type === "error" ? "#450a0a" : "#0d1b2e", border: toast.type === "error" ? "1px solid rgba(248,113,113,0.4)" : "1px solid rgba(0,212,255,0.3)", color: toast.type === "error" ? "#f87171" : "#00d4ff" }}>
          {toast.type === "error" ? "✗" : "✓"} {toast.msg}
        </div>
      )}
    </AdminShell>
  );
}