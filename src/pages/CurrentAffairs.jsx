import React, { useState } from "react";
import { Newspaper, RefreshCw, Star, Tag, Loader2, AlertCircle, Bookmark } from "lucide-react";
import { generateCurrentAffairs } from "../utils/api";
import { EXAMS } from "../data/exams";

const IMPORTANCE_LABELS = ["", "Low", "Medium", "High", "Very High", "Critical"];
const IMPORTANCE_COLORS = ["", "text-white/30", "text-blue-400", "text-saffron-400", "text-amber-400", "text-red-400"];

export default function CurrentAffairs({ userProfile }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(new Set());
  const [filter, setFilter] = useState("All");
  const [selectedExams, setSelectedExams] = useState(
    [userProfile?.exam].filter(Boolean)
  );

  const allTags = [...new Set(items.flatMap(i => i.tags || []))];
  const filtered = filter === "All" ? items : items.filter(i => i.tags?.includes(filter));

  const fetchAffairs = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await generateCurrentAffairs({
        topics: selectedExams.length ? selectedExams : EXAMS.map(e => e.name),
      });
      setItems(data);
      setFilter("All");
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const toggleSave = (idx) =>
    setSaved(prev => { const s = new Set(prev); s.has(idx) ? s.delete(idx) : s.add(idx); return s; });

  return (
    <div className="p-6 max-w-3xl mx-auto animate-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Newspaper size={20} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Current Affairs</h2>
            <p className="text-sm text-white/40">AI-curated daily digest</p>
          </div>
        </div>
        <button
          onClick={fetchAffairs}
          disabled={loading}
          className="btn-primary flex items-center gap-2 text-sm py-2"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
          {items.length ? "Refresh" : "Generate"}
        </button>
      </div>

      {/* Exam filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {EXAMS.map(ex => (
          <button
            key={ex.id}
            onClick={() => setSelectedExams(prev =>
              prev.includes(ex.name) ? prev.filter(e => e !== ex.name) : [...prev, ex.name]
            )}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
              ${selectedExams.includes(ex.name)
                ? "border-saffron-500/50 bg-saffron-500/10 text-saffron-400"
                : "border-white/5 bg-dark-700/40 text-white/40 hover:text-white/60"
              }`}
          >
            {ex.icon} {ex.name}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          <button
            onClick={() => setFilter("All")}
            className={`px-3 py-1 rounded-full text-xs border transition-all
              ${filter === "All" ? "border-white/20 bg-white/10 text-white" : "border-white/5 text-white/40 hover:border-white/10"}`}
          >
            All
          </button>
          {allTags.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 rounded-full text-xs border transition-all
                ${filter === t ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-400" : "border-white/5 text-white/40 hover:border-white/10"}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!items.length && !loading && (
        <div className="text-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
            <Newspaper size={24} className="text-indigo-400/60" />
          </div>
          <p className="text-white/40">Select exams above and click Generate</p>
          <p className="text-white/20 text-sm">AI will fetch today's most relevant current affairs</p>
        </div>
      )}

      {/* Items */}
      <div className="space-y-3">
        {filtered.map((item, idx) => (
          <div key={idx} className="card hover:border-white/10 group">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-white/90 leading-snug">{item.title}</h3>
                  </div>
                  <button
                    onClick={() => toggleSave(idx)}
                    className={`flex-shrink-0 p-1.5 rounded-lg transition-all hover:bg-white/5
                      ${saved.has(idx) ? "text-saffron-400" : "text-white/20 hover:text-white/50"}`}
                  >
                    <Bookmark size={14} fill={saved.has(idx) ? "currentColor" : "none"} />
                  </button>
                </div>

                <p className="text-sm text-white/60 leading-relaxed mb-3">{item.summary}</p>

                {/* Exam relevance */}
                <div className="p-2.5 rounded-lg bg-dark-600/50 border border-white/5 mb-3">
                  <p className="text-xs text-indigo-400 font-medium mb-0.5">Exam Relevance</p>
                  <p className="text-xs text-white/50">{item.examRelevance}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags?.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-dark-500/80 text-white/40 text-xs border border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(item.importanceScore || 3)].map((_, i) => (
                      <Star key={i} size={10} className={IMPORTANCE_COLORS[item.importanceScore || 3]} fill="currentColor" />
                    ))}
                    <span className={`text-xs ml-1 ${IMPORTANCE_COLORS[item.importanceScore || 3]}`}>
                      {IMPORTANCE_LABELS[item.importanceScore || 3]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
