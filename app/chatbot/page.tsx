"use client";

import { useState } from "react";

type ImageRecord = {
  id: string;
  url: string;
  description: string;
};

export default function ChatbotPage() {
  const [mode, setMode] = useState<"upload" | "search" | null>(null);
  const [result, setResult] = useState<ImageRecord | null>(null);

  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const resp = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await resp.json();
    setResult(json);
  }

  async function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = (e.currentTarget as any).query.value as string;
    const resp = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const arr = await resp.json();
    setResult(arr[0] ?? null);
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">AI Image Bot</h1>

      {!mode && (
        <div className="space-x-4 mt-4">
          <button onClick={() => setMode("upload")} className="btn">
            Upload
          </button>
          <button onClick={() => setMode("search")} className="btn">
            Search
          </button>
        </div>
      )}

      {mode === "upload" && (
        <form onSubmit={onUpload} className="mt-4 space-y-2">
          <input type="file" name="image" accept="image/*" required />
          <button type="submit" className="btn">
            Submit
          </button>
        </form>
      )}

      {mode === "search" && (
        <form onSubmit={onSearch} className="mt-4 space-y-2">
          <input
            type="text"
            name="query"
            placeholder="Describe your image..."
            required
            className="input"
          />
          <button type="submit" className="btn">
            Search
          </button>
        </form>
      )}

      {result && (
        <div className="mt-6 border p-4 rounded">
          <img src={result.url} alt="Result" className="w-full object-contain" />
          <p className="mt-2 text-gray-700">{result.description}</p>
        </div>
      )}
    </div>
  );
}
