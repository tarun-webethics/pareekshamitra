import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Loader2, Trash2, Sparkles } from "lucide-react";
import { chatWithTutor } from "../utils/api";
import { EXAMS } from "../data/exams";

const SUGGESTIONS = [
  "Explain Article 370 of the Indian Constitution",
  "What is the difference between Rajya Sabha and Lok Sabha?",
  "Explain photosynthesis in simple terms",
  "What is the current repo rate set by RBI?",
  "How to prepare for UPSC in 1 year?",
  "Explain the difference between prokaryotes and eukaryotes",
  "What is GDP and how is it calculated?",
  "What are the Fundamental Duties under the Constitution?",
];

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  const formatText = (t) => t
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-medium">$1</strong>')
    .replace(/\n/g, '<br/>');

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold
        ${isUser ? "bg-saffron-500/20 text-saffron-400" : "bg-indigo-500/20 text-indigo-400"}`}>
        {isUser ? "U" : "AI"}
      </div>
      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed
        ${isUser
          ? "bg-saffron-500/10 border border-saffron-500/20 text-white/80 rounded-tr-sm"
          : "bg-dark-600/60 border border-white/5 text-white/80 rounded-tl-sm"
        }`}
        dangerouslySetInnerHTML={{ __html: formatText(msg.content) }}
      />
    </div>
  );
}

export default function Tutor({ userProfile }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [exam, setExam] = useState(userProfile?.exam || "UPSC CSE");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const reply = await chatWithTutor({
        messages: newMessages,
        exam,
        subject: "",
      });
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Sorry, I encountered an error: ${e.message}. Please check your API key in Settings.`
      }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-1px)] animate-in">
      {/* Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <MessageCircle size={18} className="text-purple-400" />
          </div>
          <div>
            <h2 className="font-medium text-white">AI Tutor</h2>
            <p className="text-xs text-white/30">Ask anything about your exam</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={exam}
            onChange={e => setExam(e.target.value)}
            className="text-xs bg-dark-600/60 border border-white/10 rounded-lg px-2 py-1.5 text-white/60 focus:outline-none focus:border-white/20"
          >
            {EXAMS.map(ex => <option key={ex.id} value={ex.name}>{ex.name}</option>)}
          </select>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-5">
            {/* Welcome */}
            <div className="text-center pt-8 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={24} className="text-purple-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-1">Namaste! 🙏</h3>
              <p className="text-white/40 text-sm max-w-sm mx-auto">
                I'm your AI tutor for {exam}. Ask me anything — concepts, doubts, strategy, or current affairs.
              </p>
            </div>

            {/* Suggestions */}
            <div>
              <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Try asking</p>
              <div className="grid grid-cols-1 gap-2">
                {SUGGESTIONS.slice(0, 5).map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left p-3 rounded-xl border border-white/5 bg-dark-700/30 text-white/50 text-sm
                               hover:border-purple-500/20 hover:bg-purple-500/5 hover:text-white/70 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex-shrink-0 flex items-center justify-center text-xs font-bold text-indigo-400">AI</div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-dark-600/60 border border-white/5 flex items-center gap-2">
              <Loader2 size={14} className="text-indigo-400 animate-spin" />
              <span className="text-white/30 text-sm">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 flex-shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder="Ask your doubt... (Enter to send)"
            className="input resize-none min-h-[44px] max-h-[120px] overflow-y-auto leading-relaxed py-2.5"
            style={{ height: "auto" }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className={`p-2.5 rounded-xl transition-all flex-shrink-0
              ${input.trim() && !loading
                ? "bg-saffron-500 hover:bg-saffron-400 text-white shadow-lg shadow-saffron-500/20"
                : "bg-dark-600 text-white/20"
              }`}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-white/20 mt-1.5 text-center">Shift+Enter for new line</p>
      </div>
    </div>
  );
}
