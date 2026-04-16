"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getStoredReports, addReport, deleteReport } from "@/lib/adminStore";
import { Report, formatDate } from "@/lib/data";
import Link from "next/link";

const REPORT_CATEGORIES = ["Annual Report", "Election", "Disinformation", "Policy Brief", "Threat Assessment", "Field Research", "Working Paper"];

function genId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const EMPTY: Omit<Report, "id"> = {
  title: "", description: "", date: new Date().toISOString().split("T")[0],
  category: "Policy Brief", pages: 20, downloadUrl: "#",
};

export default function AdminReportsPage() {
  const [reports, setReports]   = useState<Report[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [confirm, setConfirm]   = useState<string | null>(null);
  const [toast, setToast]       = useState("");
  const [form, setForm]         = useState<Omit<Report, "id">>(EMPTY);

  useEffect(() => { setReports(getStoredReports()); }, []);

  function setF(key: string, val: string | number) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const report: Report = { ...form, id: genId(form.title) };
    setTimeout(() => {
      const updated = addReport(report);
      setReports(updated);
      setShowForm(false);
      setForm(EMPTY);
      setSaving(false);
      showToast("Report added successfully.");
    }, 400);
  }

  function handleDelete(id: string) {
    const updated = deleteReport(id);
    setReports(updated);
    setConfirm(null);
    showToast("Report deleted.");
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <AdminShell>
      <div className="px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-sand font-medium">Reports</h1>
            <p className="text-sm text-muted mt-1">{reports.length} publications</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 bg-gold text-ink text-[0.72rem] tracking-[0.12em] uppercase font-medium hover:bg-gold2 transition-colors"
          >
            {showForm ? "Cancel" : "+ Add Report"}
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <form onSubmit={handleAdd} className="mb-8 border border-white/8 bg-white/2 p-6 flex flex-col gap-4">
            <h2 className="font-display text-lg text-sand font-medium mb-1">New Report</h2>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-1.5 font-mono">Title *</label>
              <input required value={form.title} onChange={(e) => setF("title", e.target.value)}
                placeholder="Report title..." className="w-full bg-white/4 border border-white/8 px-4 py-2.5 text-sm text-sand placeholder:text-muted/30 outline-none focus:border-gold/50 transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-1.5 font-mono">Description *</label>
              <textarea required rows={3} value={form.description} onChange={(e) => setF("description", e.target.value)}
                placeholder="Brief description..." className="w-full bg-white/4 border border-white/8 px-4 py-2.5 text-sm text-sand placeholder:text-muted/30 outline-none focus:border-gold/50 transition-colors resize-none" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-1.5 font-mono">Category</label>
                <select value={form.category} onChange={(e) => setF("category", e.target.value)}
                  className="w-full bg-white/4 border border-white/8 px-3 py-2.5 text-sm text-sand outline-none focus:border-gold/50 transition-colors">
                  {REPORT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-1.5 font-mono">Date</label>
                <input type="date" value={form.date} onChange={(e) => setF("date", e.target.value)}
                  className="w-full bg-white/4 border border-white/8 px-3 py-2.5 text-sm text-sand outline-none focus:border-gold/50 transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-1.5 font-mono">Pages</label>
                <input type="number" min={1} value={form.pages} onChange={(e) => setF("pages", parseInt(e.target.value))}
                  className="w-full bg-white/4 border border-white/8 px-3 py-2.5 text-sm text-sand outline-none focus:border-gold/50 transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-1.5 font-mono">Download URL</label>
                <input value={form.downloadUrl} onChange={(e) => setF("downloadUrl", e.target.value)} placeholder="/reports/file.pdf"
                  className="w-full bg-white/4 border border-white/8 px-3 py-2.5 text-sm text-sand placeholder:text-muted/30 outline-none focus:border-gold/50 transition-colors" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-gold text-ink text-[0.72rem] tracking-[0.12em] uppercase font-medium hover:bg-gold2 transition-colors disabled:opacity-50">
                {saving ? "Adding..." : "Add Report"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-[0.72rem] tracking-[0.1em] uppercase text-muted hover:text-sand transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Reports list */}
        <div className="border border-white/6">
          <div className="grid grid-cols-[1fr_130px_80px_90px_100px] px-5 py-2.5 border-b border-white/6 bg-white/2">
            {["Title", "Category", "Pages", "Date", "Actions"].map((h) => (
              <span key={h} className="text-[0.62rem] tracking-[0.18em] uppercase text-muted font-medium">{h}</span>
            ))}
          </div>
          <div className="divide-y divide-white/5">
            {reports.map((report) => (
              <div key={report.id} className="grid grid-cols-[1fr_130px_80px_90px_100px] px-5 py-4 hover:bg-white/2 transition-colors items-center group">
                <div className="min-w-0 pr-4">
                  <p className="text-sm text-sand truncate font-medium">{report.title}</p>
                  <p className="text-[0.68rem] text-muted/60 truncate mt-0.5">{report.description.slice(0, 60)}...</p>
                </div>
                <span className="text-[0.6rem] tracking-[0.12em] uppercase text-emerald-400 border border-emerald-400/25 px-2 py-0.5 w-fit">
                  {report.category}
                </span>
                <span className="text-[0.68rem] text-muted font-mono">{report.pages}pp</span>
                <span className="text-[0.68rem] text-muted font-mono">{formatDate(report.date)}</span>
                <div className="flex items-center gap-4">
                  <a href={report.downloadUrl} target="_blank" rel="noreferrer"
                    className="text-[0.65rem] tracking-[0.1em] uppercase text-muted hover:text-gold transition-colors">
                    ↗ View
                  </a>
                  <button onClick={() => setConfirm(report.id)}
                    className="text-[0.65rem] tracking-[0.1em] uppercase text-muted hover:text-red-400 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <p className="px-5 py-12 text-sm text-muted text-center">No reports yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirm */}
      {confirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] border border-white/10 p-7 max-w-sm w-full">
            <h3 className="font-display text-xl text-sand mb-2">Delete report?</h3>
            <p className="text-sm text-muted mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirm)} className="px-5 py-2 bg-red-500/80 text-white text-[0.72rem] tracking-[0.1em] uppercase font-medium hover:bg-red-500 transition-colors">
                Yes, delete
              </button>
              <button onClick={() => setConfirm(null)} className="px-5 py-2 border border-white/10 text-muted text-[0.72rem] tracking-[0.1em] uppercase font-medium hover:text-sand transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-900 border border-emerald-700 text-emerald-200 text-sm px-5 py-3 z-50 font-mono">
          ✓ {toast}
        </div>
      )}
    </AdminShell>
  );
}