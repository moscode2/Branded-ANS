"use client";
import { useState } from "react";

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("/api/articles", {
      method: "POST",
      body: JSON.stringify({
        title,
        category,
        content,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
      }),
    });

    alert("Article added!");
    setTitle("");
    setCategory("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />

      <button type="submit">Add Article</button>
    </form>
  );
}