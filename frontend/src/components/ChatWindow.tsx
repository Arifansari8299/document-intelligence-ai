import { useState, useRef, useEffect } from "react";
import { askQuestion } from "../services/api";
import MessageBubble from "./MessageBubble";

type Message = { role: "user" | "ai"; text: string };

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hello! Upload your documents and ask me anything — dates, names, content, summaries, and more." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: question }]);
    setLoading(true);
    try {
      const { answer } = await askQuestion(question);
      setMessages(prev => [...prev, { role: "ai", text: answer }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-3">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} text={msg.text} index={i} />
        ))}

        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm glass border border-white/60 shadow-sm">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="glass border-t border-white/60 p-3 md:p-4 shadow-lg">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your documents… (Enter to send)"
              className="w-full resize-none rounded-2xl border border-indigo-100 bg-white/80
                         px-4 py-3 text-sm text-gray-800 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                         transition-all shadow-sm leading-relaxed"
              style={{ minHeight: "46px", maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="shrink-0 w-11 h-11 rounded-2xl shimmer-btn text-white
                       flex items-center justify-center shadow-lg
                       hover:scale-105 active:scale-95 transition-transform
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
        <p className="text-center text-xs text-gray-300 mt-2 hidden md:block">
          Shift+Enter for new line · Enter to send
        </p>
      </div>
    </div>
  );
}
