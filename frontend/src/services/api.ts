const BASE_URL = "http://localhost:8000/api";

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE_URL}/upload`, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function askQuestion(question: string) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error("Chat failed");
  return res.json();
}

export async function getDocuments(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/documents`);
  const data = await res.json();
  return data.documents;
}

export async function deleteDocument(filename: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/documents/${encodeURIComponent(filename)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
}