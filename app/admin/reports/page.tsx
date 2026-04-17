"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { supabase } from "@/lib/supabase";
import { Report, formatDate } from "@/lib/data";
import Link from "next/link";

const EMPTY = { title: "", description: "", file_url: "", date: new Date().toISOString().split("T")[0] };

export default function AdminReportsPage() {
  const [reports, setReports]   = useState<Report[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [confirm, setConfirm]   = useState<string | null>(null);
  const [toast, setToast]       = useState<{ msg: string; type: "success" | "error" }>({ msg: "", type: "success" });
  const [form, setForm]         = useState(EMPTY);

  // Fetch reports from Supabase on mount
  async function fetchReports() {
    setLoading(true);
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("date", { ascending: false });

    if (error) showToast("Failed to load reports: " + error.message, "error");
    else setReports(data as Report[]);
    setLoading(false);
  }

  useEffect(() => { fetchReports(); }, []);

  //Add new report to Supabase
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from("reports").insert([{
      title:       form.title,
      description: form.description,
      file_url:    form.file_url || null,
      date:        form.date,
    }]);

    if (error) {
      showToast("Error adding report: " + error.message, "error");
    } else {
      showToast("Report added successfully.");
      setShowForm(false);
      setForm(EMPTY);
      fetchReports();
    }
    setSaving(false);
  }

  // Delete report from Supabase
  async function handleDelete(id: string) {
    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (error) {
      showToast("Error deleting report: " + error.message, "error");
    } else {
      showToast("Report deleted.");
      setReports((prev) => prev.filter((r) => r.id !== id));
    }
    setConfirm(null);
  }

  function setF(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 4000);
  }

  return (
    <AdminShell>
      <div className="px-8 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-sand font-medium">Reports</h1>
            <p className="text-sm text-muted mt-1">
              {loading ? "Loading..." : `${reports.length} publication${reports.length !== 1 ? "s" : ""} in Supabase`}
            </p>
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
          <form onSubmit={handleAdd} className="mb-8 border border-white/8 bg-white/2 p-6 flex flex-col gap-5">
            <h2 className="font-display text-lg text-sand font-medium">New Report</h2>

            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-1.5 font-mono">Title *</label>
              <input
                required value={form.title} onChange={(e) => setF("title", e.target.value)}
                placeholder="Report title..."
                className="w-full bg-white/4 border border-white/8 px-4 py-2.5 text-sm text-sand placeholder:text-muted/30 outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-1.5 font-mono">Description *</label>
              <textarea
                required rows={3} value={form.description} onChange={(e) => setF("description", e.target.value)}
                placeholder="Brief description of the report..."
                className="w-full bg-white/4 border border-white/8 px-4 py-2.5 text-sm text-sand placeholder:text-muted/30 outline-none focus:border-gold/50 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-1.5 font-mono">
                  File URL <span className="text-muted/40 normal-case">(Supabase Storage or external link)</span>
                </label>
                <input
                  value={form.file_url} onChange={(e) => setF("file_url", e.target.value)}
                  placeholder="https://... or /storage/v1/object/..."
                  className="w-full bg-white/4 border border-white/8 px-4 py-2.5 text-sm text-sand placeholder:text-muted/30 outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-1.5 font-mono">Date</label>
                <input
                  type="date" value={form.date} onChange={(e) => setF("date", e.target.value)}
                  className="w-full bg-white/4 border border-white/8 px-4 py-2.5 text-sm text-sand outline-none focus:border-gold/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-1 border-t border-white/6">
              <button
                type="submit" disabled={saving}
                className="px-6 py-2.5 bg-gold text-ink text-[0.72rem] tracking-[0.12em] uppercase font-medium hover:bg-gold2 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving to Supabase..." : "Publish Report"}
              </button>
              <button
                type="button" onClick={() => { setShowForm(false); setForm(EMPTY); }}
                className="px-4 py-2.5 text-[0.72rem] tracking-[0.1em] uppercase text-muted hover:text-sand transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Table */}
        <div className="border border-white/6">
          {/* Head */}
          <div className="grid grid-cols-[1fr_160px_110px_120px] px-5 py-2.5 border-b border-white/6 bg-white/2">
            {["Title", "File", "Date", "Actions"].map((h) => (
              <span key={h} className="text-[0.62rem] tracking-[0.18em] uppercase text-muted font-medium">{h}</span>
            ))}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="divide-y divide-white/5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="grid grid-cols-[1fr_160px_110px_120px] px-5 py-4 animate-pulse">
                  <div className="h-3 bg-white/5 rounded w-2/3" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                  <div className="h-3 bg-white/5 rounded w-1/3" />
                  <div className="h-3 bg-white/5 rounded w-1/4" />
                </div>
              ))}
            </div>
          )}

          {/* Rows */}
          {!loading && (
            <div className="divide-y divide-white/5">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="grid grid-cols-[1fr_160px_110px_120px] px-5 py-4 hover:bg-white/2 transition-colors items-center group"
                >
                  <div className="min-w-0 pr-4">
                    <p className="text-sm text-sand truncate font-medium">{report.title}</p>
                    <p className="text-[0.68rem] text-muted/60 truncate mt-0.5">
                      {report.description?.slice(0, 65)}...
                    </p>
                  </div>

                  <div>
                    {report.file_url ? (
                      <a
                        href={report.file_url} target="_blank" rel="noreferrer"
                        className="text-[0.6rem] tracking-[0.12em] uppercase text-gold border border-gold/25 px-2 py-0.5 hover:bg-gold/10 transition-colors inline-block"
                      >
                        ↗ View PDF
                      </a>
                    ) : (
                      <span className="text-[0.6rem] tracking-[0.12em] uppercase text-muted/40 border border-white/8 px-2 py-0.5">
                        No file
                      </span>
                    )}
                  </div>

                  <span className="text-[0.68rem] text-muted font-mono">{formatDate(report.date)}</span>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setConfirm(report.id)}
                      className="text-[0.65rem] tracking-[0.1em] uppercase text-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {reports.length === 0 && (
                <div className="px-5 py-14 text-center">
                  <p className="text-sm text-muted mb-1">No reports in Supabase yet.</p>
                  <p className="text-[0.7rem] text-muted/50">Click "+ Add Report" above to publish your first one.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Supabase hint */}
        <p className="text-[0.65rem] text-muted/30 font-mono mt-3">
          ↳ Data source: supabase · table: reports · ordered by date desc
        </p>
      </div>

      {/* Delete confirm modal */}
      {confirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] border border-white/10 p-7 max-w-sm w-full">
            <h3 className="font-display text-xl text-sand mb-2">Delete report?</h3>
            <p className="text-sm text-muted mb-6">
              This will permanently remove the record from Supabase. The file itself will not be deleted from storage.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(confirm)}
                className="px-5 py-2 bg-red-500/80 text-white text-[0.72rem] tracking-[0.1em] uppercase font-medium hover:bg-red-500 transition-colors"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirm(null)}
                className="px-5 py-2 border border-white/10 text-muted text-[0.72rem] tracking-[0.1em] uppercase font-medium hover:text-sand transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.msg && (
        <div className={`fixed bottom-6 right-6 border text-sm px-5 py-3 z-50 font-mono transition-all ${
          toast.type === "error"
            ? "bg-red-950 border-red-700 text-red-300"
            : "bg-emerald-900 border-emerald-700 text-emerald-200"
        }`}>
          {toast.type === "error" ? "✗" : "✓"} {toast.msg}
        </div>
      )}
    </AdminShell>
  );
}