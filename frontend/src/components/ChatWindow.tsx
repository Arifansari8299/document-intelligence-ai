import { useState, useRef, useEffect } from "react";
import { askQuestion } from "../services/api";
import MessageBubble from "./MessageBubble";

type Message = { role: "user" | "ai"; text: string };

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hello! Upload your documents and ask me anything — which document is for what purpose, which date, what content, etc." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      setMessages(prev => [...prev, { role: "ai", text: "Error getting response. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} text={msg.text} />
        ))}
        {loading && (
          <div className="flex gap-2 items-center text-gray-400 text-sm">
            <span className="animate-pulse">●●●</span> Thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white p-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="e.g. Which document mentions Q3 targets? What is the invoice date?"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm 
                     hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}