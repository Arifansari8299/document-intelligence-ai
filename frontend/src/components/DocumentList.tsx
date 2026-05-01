import { useEffect, useState } from "react";
import { getDocuments, deleteDocument } from "../services/api";

interface Props {
  refreshKey?: number;
}

export default function DocumentList({ refreshKey }: Props) {
  const [docs, setDocs] = useState<string[]>([]);

  const fetchDocs = () => {
    getDocuments().then(setDocs).catch(() => setDocs([]));
  };

  useEffect(() => {
    fetchDocs();
  }, [refreshKey]);

  const handleDelete = async (filename: string) => {
    try {
      await deleteDocument(filename);
      setDocs((prev) => prev.filter((d) => d !== filename));
    } catch {
      alert("Failed to delete document");
    }
  };

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
          <span className="truncate flex-1">{doc}</span>
          <button
            onClick={() => handleDelete(doc)}
            className="text-red-400 hover:text-red-600 ml-auto shrink-0"
            title="Delete"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
