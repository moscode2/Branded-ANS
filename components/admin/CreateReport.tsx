"use client";
import { useState } from "react";

export default function CreateReport() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("/api/reports", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        file_url: fileUrl,
      }),
    });

    alert("Report added!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="File URL" onChange={(e) => setFileUrl(e.target.value)} />

      <button type="submit">Add Report</button>
    </form>
  );
}