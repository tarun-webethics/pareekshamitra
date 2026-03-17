import React, { useState } from "react";
import { BookOpen, Send, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import { callClaude } from "../utils/api";
import { EXAMS } from "../data/exams";

const SAMPLE_PYQS = {
  "UPSC CSE": [
    { year: "2023", q: "Consider the following statements regarding the 'Pradhan Mantri Jan Dhan Yojana': 1. It aims to expand banking facilities to the unbanked population. 2. It provides an accident insurance cover of ₹2 lakh. Which of the above statements is/are correct? (a) 1 only (b) 2 only (c) Both 1 and 2 (d) Neither 1 nor 2" },
    { year: "2022", q: "With reference to the Indian freedom struggle, Usha Mehta is well known for: (a) Running the secret Congress Radio in the wake of Quit India Movement (b) Participating in the Second Round Table Conference (c) Leading a contingent of Indian National Army (d) Assisting in the formation of Interim Government under Pandit Jawaharlal Nehru" },
  ],
  "SSC CGL": [
    { year: "2023", q: "If a number is decreased by 4 and divided by 6, the result is 8. What would be the result if 2 is subtracted from the number and then it is divided by 5? (a) 9 (b) 10 (c) 11 (d) 12" },
    { year: "2022", q: "Select the most appropriate synonym of the word 'EPHEMERAL': (a) Permanent (b) Transitory (c) Eternal (d) Everlasting" },
  ],
  "IBPS PO": [
    { year: "2023", q: "Which of the following is NOT a function of the Reserve Bank of India? (a) Issuing currency notes (b) Acting as banker to the government (c) Regulating commercial banks (d) Granting loans to individuals" },
  ],
};

export default function PYQSolver({ userProfile }) {
  const [exam, setExam] = useState(userProfile?.exam || "UPSC CSE");
  const [question, setQuestion] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSamples, setShowSamples] = useState(true);

  const solve = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError("");
    setExplanation("");

    const system = `You are an expert ${exam} coach. When given a PYQ:
1. Identify the correct answer
2. Explain the concept behind it clearly (2-3 paragraphs)
3. Give a memory trick or shortcut if applicable
4. Mention related topics to study
Format with clear sections. Use **bold** for key terms.`;

    try {
      const res = await callClaude(system, [{ role: "user", content: question }], { maxTokens: 800 });
      setExplanation(res);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const samples = SAMPLE_PYQS[exam] || SAMPLE_PYQS["UPSC CSE"];

  const formatText = (t) => t
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-medium">$1</strong>')
    .replace(/\n/g, '<br/>');

  return (
    <div className="p-6 max-w-3xl mx-auto animate-in space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <BookOpen size={20} className="text-amber-400" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">PYQ Solver</h2>
          <p className="text-sm text-white/40">Paste any past year question for AI explanation</p>
        </div>
      </div>

      {/* Exam */}
      <div className="flex gap-2 flex-wrap">
        {EXAMS.map(ex => (
          <button key={ex.id}
            onClick={() => { setExam(ex.name); setQuestion(""); setExplanation(""); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
              ${exam === ex.name
                ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                : "border-white/5 bg-dark-700/40 text-white/40 hover:text-white/60"
              }`}
          >
            {ex.icon} {ex.name}
          </button>
        ))}
      </div>

      {/* Sample PYQs */}
      <div className="card">
        <button
          onClick={() => setShowSamples(s => !s)}
          className="w-full flex items-center justify-between text-sm text-white/50 hover:text-white/70"
        >
          <span>Sample PYQs for {exam}</span>
          <ChevronDown size={15} className={`transition-transform ${showSamples ? "rotate-180" : ""}`} />
        </button>
        {showSamples && (
          <div className="mt-3 space-y-2">
            {samples.map((s, i) => (
              <button
                key={i}
                onClick={() => { setQuestion(s.q); setExplanation(""); }}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all leading-relaxed
                  ${question === s.q
                    ? "border-amber-500/30 bg-amber-500/5 text-amber-300"
                    : "border-white/5 bg-dark-700/30 text-white/50 hover:border-white/10 hover:text-white/70"
                  }`}
              >
                <span className="badge bg-dark-500 text-white/30 mr-2">{s.year}</span>
                {s.q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Question input */}
      <div>
        <label className="block text-sm text-white/50 mb-2">Paste your PYQ</label>
        <textarea
          value={question}
          onChange={e => { setQuestion(e.target.value); setExplanation(""); }}
          rows={5}
          placeholder="Paste any previous year question here, including options if available..."
          className="input resize-none leading-relaxed"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <button
        onClick={solve}
        disabled={loading || !question.trim()}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all
          ${!loading && question.trim() ? "btn-primary" : "bg-dark-600 text-white/20 cursor-not-allowed"}`}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {loading ? "Solving..." : "Explain this Question"}
      </button>

      {explanation && (
        <div className="card border-amber-500/15 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-amber-500/20 flex items-center justify-center">
              <BookOpen size={12} className="text-amber-400" />
            </div>
            <span className="text-sm font-medium text-amber-400">AI Explanation</span>
          </div>
          <div
            className="text-sm text-white/70 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatText(explanation) }}
          />
        </div>
      )}
    </div>
  );
}
