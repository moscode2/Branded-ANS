"use client";
import { useState } from "react";
<CreateReport onSuccess={() => window.location.reload()} />
export default function CreateReport({ onSuccess }: { onSuccess?: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          file_url: fileUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      alert("Report added successfully ✅");

      setTitle("");
      setDescription("");
      setFileUrl("");

      onSuccess?.(); // refresh dashboard
    } catch (err) {
      alert("Failed to add report ❌");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-10">
      <h2 className="text-lg text-sand font-semibold">Add New Report</h2>

      <input
        type="text"
        placeholder="Report Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 bg-ink2 border border-white/10 text-sand"
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-4 py-2 bg-ink2 border border-white/10 text-sand"
      />

      <input
        type="text"
        placeholder="PDF Link (or file URL)"
        value={fileUrl}
        onChange={(e) => setFileUrl(e.target.value)}
        className="w-full px-4 py-2 bg-ink2 border border-white/10 text-sand"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-gold text-ink px-5 py-2 text-sm uppercase"
      >
        {loading ? "Adding..." : "Add Report"}
      </button>
    </form>
  );
}