import { useState, useRef } from "react";
import { uploadDocument } from "../services/api";

export default function DocumentUpload({ onUpload }: { onUpload: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      await uploadDocument(file);
      setMessage(`✓ ${file.name} uploaded`);
      onUpload();
    } catch {
      setMessage("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Upload Document
      </p>
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full py-2 px-3 rounded-lg border-2 border-dashed border-indigo-300 
                   text-sm text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50 
                   transition-colors disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "+ Upload PDF / DOCX / TXT"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFile}
        className="hidden"
      />
      {message && (
        <p className="text-xs text-green-600">{message}</p>
      )}
    </div>
  );
}