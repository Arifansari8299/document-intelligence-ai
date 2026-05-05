import { useState } from "react";
import DocumentUpload from "./components/DocumentUpload";
import DocumentList from "./components/DocumentList";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [refreshDocs, setRefreshDocs] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden font-sans"
      style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#faf5ff 100%)" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-30 md:z-auto
        h-full w-72 flex flex-col
        glass border-r border-white/60 shadow-xl
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0 animate-sidebar" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-white/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
              <span className="text-white text-base font-bold">T</span>
            </div>
            <div>
              <p className="font-bold text-gray-800 leading-none">Tynor AI</p>
              <p className="text-xs text-gray-400 mt-0.5">Doc Intelligence</p>
            </div>
            <button
              className="ml-auto md:hidden text-gray-400 hover:text-gray-600"
              onClick={() => setSidebarOpen(false)}
            >✕</button>
          </div>
        </div>

        {/* Upload + Docs */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <DocumentUpload onUpload={() => { setRefreshDocs(r => r + 1); setSidebarOpen(false); }} />
          <DocumentList key={refreshDocs} refreshKey={refreshDocs} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/40">
          <p className="text-xs text-center text-gray-400">Powered by Ollama · llama3.2</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="glass border-b border-white/60 px-4 md:px-6 py-4 flex items-center gap-3 shadow-sm">
          <button
            className="md:hidden w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-gray-800 text-base truncate">Ask anything about your documents</h1>
            <p className="text-xs text-gray-400 hidden sm:block">Upload PDFs, DOCX or TXT and chat with them instantly</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Online" />
        </header>

        <ChatWindow />
      </main>
    </div>
  );
}
