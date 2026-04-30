import { useState } from "react";
import DocumentUpload from "./components/DocumentUpload";
import DocumentList from "./components/DocumentList";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [refreshDocs, setRefreshDocs] = useState(0);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col p-4 gap-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl font-bold text-indigo-600">Tynor</span>
          <span className="text-sm text-gray-400">Doc Intelligence</span>
        </div>
        <DocumentUpload onUpload={() => setRefreshDocs(r => r + 1)} />
        <DocumentList key={refreshDocs} />
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-800">
            Ask anything about your documents
          </h1>
          <p className="text-sm text-gray-500">
            Powered by Gemini 2.5 Flash
          </p>
        </div>
        <ChatWindow />
      </div>
    </div>
  );
}