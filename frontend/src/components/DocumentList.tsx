import { useEffect, useState } from "react";
import { getDocuments, deleteDocument } from "../services/api";

interface Props {
  refreshKey?: number;
}

export default function DocumentList({ refreshKey }: Props) {
  const [docs, setDocs] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    getDocuments().then(setDocs).catch(() => setDocs([]));
  }, [refreshKey]);

  const handleDelete = async (filename: string) => {
    setDeleting(filename);
    try {
      await deleteDocument(filename);
      setDocs(prev => prev.filter(d => d !== filename));
    } catch {
      alert("Failed to delete document");
    } finally {
      setDeleting(null);
    }
  };

  // Strip uuid prefix for display: "uuid_filename.pdf" → "filename.pdf"
  const displayName = (f: string) => {
    const parts = f.split("_");
    return parts.length > 1 ? parts.slice(1).join("_") : f;
  };

  if (docs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center animate-fade-in">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <svg width="18" height="18" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-xs text-gray-400">No documents yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
        Documents ({docs.length})
      </p>
      {docs.map((doc, i) => (
        <div
          key={doc}
          className="group flex items-center gap-2 px-3 py-2.5 rounded-xl
                     bg-white/60 border border-white/80 hover:bg-indigo-50/80
                     transition-all duration-200 animate-fade-in shadow-sm"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
            <svg width="13" height="13" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" strokeLinecap="round"/>
              <path d="M14 2v6h6" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="truncate flex-1 text-xs text-gray-700 font-medium">
            {displayName(doc)}
          </span>
          <button
            onClick={() => handleDelete(doc)}
            disabled={deleting === doc}
            className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center
                       text-gray-300 hover:text-red-500 hover:bg-red-50
                       opacity-0 group-hover:opacity-100 transition-all duration-150
                       disabled:opacity-50"
            title="Delete"
          >
            {deleting === doc ? (
              <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : (
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
