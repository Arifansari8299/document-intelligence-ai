import { useEffect, useState } from "react";
import { getDocuments } from "../services/api";

export default function DocumentList() {
  const [docs, setDocs] = useState<string[]>([]);

  useEffect(() => {
    getDocuments().then(setDocs).catch(() => setDocs([]));
  }, []);

  if (docs.length === 0) {
    return (
      <div className="text-xs text-gray-400 mt-2">
        No documents uploaded yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 mt-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Uploaded Documents
      </p>
      {docs.map((doc, i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-xs"
        >
          <span>📄</span>
          <span className="truncate">{doc}</span>
        </div>
      ))}
    </div>
  );
}