import { useState, useRef } from "react";
import { uploadDocument } from "../services/api";

export default function DocumentUpload({ onUpload }: { onUpload: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setStatus(null);
    try {
      await uploadDocument(file);
      setStatus({ type: "success", msg: `✓ ${file.name}` });
      onUpload();
    } catch {
      setStatus({ type: "error", msg: "Upload failed. Try again." });
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Upload</p>

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-5
          flex flex-col items-center gap-2 text-center
          transition-all duration-200
          ${dragging
            ? "border-indigo-500 bg-indigo-50 scale-[1.02]"
            : "border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50"
          }
          ${uploading ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        {uploading ? (
          <>
            <svg className="animate-spin w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <p className="text-xs text-indigo-500 font-medium">Uploading…</p>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <svg width="20" height="20" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-xs font-medium text-indigo-600">Click or drag to upload</p>
            <p className="text-xs text-gray-400">PDF · DOCX · TXT</p>
          </>
        )}
      </div>

      <input ref={inputRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFile} className="hidden" />

      {status && (
        <p className={`text-xs px-3 py-1.5 rounded-lg animate-fade-in
          ${status.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
          {status.msg}
        </p>
      )}
    </div>
  );
}
