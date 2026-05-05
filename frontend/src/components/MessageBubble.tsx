import ReactMarkdown from "react-markdown";

type Props = {
  role: "user" | "ai";
  text: string;
  index?: number;
};

export default function MessageBubble({ role, text, index = 0 }: Props) {
  const isUser = role === "user";
  const delay = Math.min(index * 0.05, 0.3);

  return (
    <div
      className={`flex items-end gap-2 ${isUser ? "justify-end animate-slide-right" : "justify-start animate-slide-left"}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* AI avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center shrink-0 shadow-md mb-0.5">
          <span className="text-white text-xs font-bold">T</span>
        </div>
      )}

      <div
        className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
          ${isUser
            ? "gradient-bg text-white rounded-br-sm"
            : "glass border border-white/60 text-gray-800 rounded-bl-sm"
          }`}
      >
        {isUser ? (
          <p>{text}</p>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold text-indigo-700">{children}</strong>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 text-gray-700">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-700">{children}</ol>,
              li: ({ children }) => <li className="ml-2">{children}</li>,
              h1: ({ children }) => <h1 className="text-base font-bold mb-2 text-gray-900">{children}</h1>,
              h2: ({ children }) => <h2 className="text-sm font-bold mb-1 text-gray-900">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 text-gray-800">{children}</h3>,
              code: ({ children }) => (
                <code className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">
                  {children}
                </code>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-indigo-300 pl-3 italic text-gray-500 my-2">
                  {children}
                </blockquote>
              ),
            }}
          >
            {text}
          </ReactMarkdown>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 shadow-sm mb-0.5">
          <span className="text-indigo-600 text-xs font-bold">U</span>
        </div>
      )}
    </div>
  );
}
