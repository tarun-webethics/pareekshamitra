import React, { useState, useRef } from "react";
import { PenLine, Send, Loader2, AlertCircle, RotateCcw } from "lucide-react";
import { evaluateAnswer } from "../utils/api";
import { EXAMS } from "../data/exams";

const SAMPLE_QUESTIONS = {
  "UPSC CSE": [
    "Discuss the significance of the Preamble to the Constitution of India. How does it reflect the aspirations of the founding fathers?",
    "Examine the role of civil society in strengthening democracy in India.",
    "What are the major challenges facing Indian federalism in the 21st century?",
  ],
  "SSC CGL": [
    "Write a short note on the economic impact of GST implementation in India.",
    "Describe the importance of skill development for India's economic growth.",
  ],
  "IBPS PO": [
    "What are the challenges and opportunities of financial inclusion in rural India?",
    "Discuss the role of digital banking in transforming the Indian economy.",
  ],
  "NEET UG": [
    "Explain the mechanism of action potential in a nerve cell.",
    "Describe the process of photosynthesis and its significance.",
  ],
  "JEE Mains": [
    "Explain the concept of entropy and its significance in thermodynamics.",
    "Discuss the applications of Bernoulli's principle.",
  ],
};

export default function AnswerWriting({ userProfile }) {
  const [exam, setExam] = useState(userProfile?.exam || "UPSC CSE");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const feedbackRef = useRef(null);

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
    setWordCount(e.target.value.trim().split(/\s+/).filter(Boolean).length);
  };

  const evaluate = async () => {
    if (!question.trim() || !answer.trim()) return;
    setLoading(true);
    setError("");
    setFeedback("");

    try {
      await evaluateAnswer({
        question, userAnswer: answer, exam,
        onChunk: (chunk, full) => {
          setFeedback(full);
          feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        },
      });
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const reset = () => {
    setQuestion("");
    setAnswer("");
    setFeedback("");
    setError("");
    setWordCount(0);
  };

  const samples = SAMPLE_QUESTIONS[exam] || SAMPLE_QUESTIONS["UPSC CSE"];

  // Format feedback markdown-lite
  const formatFeedback = (text) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-medium">$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto animate-in space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <PenLine size={20} className="text-emerald-400" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Answer Writing Coach</h2>
          <p className="text-sm text-white/40">AI scores & improves your answers</p>
        </div>
      </div>

      {/* Exam selector */}
      <div className="flex gap-2 flex-wrap">
        {EXAMS.map(ex => (
          <button
            key={ex.id}
            onClick={() => { setExam(ex.name); setQuestion(""); setFeedback(""); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
              ${exam === ex.name
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                : "border-white/5 bg-dark-700/40 text-white/40 hover:text-white/60"
              }`}
          >
            {ex.icon} {ex.name}
          </button>
        ))}
      </div>

      {/* Sample questions */}
      <div>
        <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Sample Questions</p>
        <div className="space-y-1.5">
          {samples.map((q, i) => (
            <button
              key={i}
              onClick={() => { setQuestion(q); setFeedback(""); }}
              className={`w-full text-left p-3 rounded-xl text-sm border transition-all
                ${question === q
                  ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
                  : "border-white/5 bg-dark-700/30 text-white/50 hover:border-white/10 hover:text-white/70"
                }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Custom question */}
      <div>
        <label className="block text-sm text-white/50 mb-2">Or enter your own question</label>
        <textarea
          value={question}
          onChange={e => { setQuestion(e.target.value); setFeedback(""); }}
          rows={2}
          placeholder="Paste a question from PYQ or your study material..."
          className="input resize-none"
        />
      </div>

      {/* Answer */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-white/50">Your Answer</label>
          <span className={`text-xs font-mono ${wordCount > 250 ? "text-saffron-400" : "text-white/30"}`}>
            {wordCount} words
          </span>
        </div>
        <textarea
          value={answer}
          onChange={handleAnswerChange}
          rows={8}
          placeholder="Write your answer here... Aim for 150-250 words for descriptive questions."
          className="input resize-none leading-relaxed"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={evaluate}
          disabled={loading || !question.trim() || !answer.trim()}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all
            ${(!loading && question.trim() && answer.trim())
              ? "btn-primary" : "bg-dark-600 text-white/20 cursor-not-allowed"}`}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {loading ? "Evaluating..." : "Evaluate with AI"}
        </button>
        {(feedback || question) && (
          <button onClick={reset} className="btn-secondary flex items-center gap-2 px-4">
            <RotateCcw size={15} />
          </button>
        )}
      </div>

      {/* Feedback */}
      {(feedback || loading) && (
        <div ref={feedbackRef} className="card border-emerald-500/15 bg-emerald-500/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
              <PenLine size={12} className="text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-emerald-400">AI Evaluation</span>
            {loading && <Loader2 size={13} className="text-emerald-400/50 animate-spin ml-auto" />}
          </div>
          {feedback && (
            <div
              className="text-sm text-white/70 leading-relaxed space-y-1"
              dangerouslySetInnerHTML={{ __html: formatFeedback(feedback) }}
            />
          )}
          {loading && !feedback && (
            <div className="text-white/30 text-sm typing-cursor">Analyzing your answer</div>
          )}
        </div>
      )}
    </div>
  );
}
