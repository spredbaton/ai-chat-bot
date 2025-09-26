export async function fetchCaptionAndEmbedding(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const resp = await fetch("http://localhost:8000/caption", {
    method: "POST",
    body: formData,
  });
  if (!resp.ok) {
    throw new Error("Failed to fetch caption");
  }
  return resp.json() as Promise<{ caption: string; embedding: number[] }>;
}

export async function fetchEmbedding(query: string) {
  const form = new FormData();
  form.append("query", query);

  const resp = await fetch("http://localhost:8000/embed", {
    method: "POST",
    body: form,
  });
  if (!resp.ok) {
    throw new Error("Failed to embed query");
  }
  return resp.json() as Promise<{ embedding: number[] }>;
}
