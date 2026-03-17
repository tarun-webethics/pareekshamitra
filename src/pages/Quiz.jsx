import React, { useState, useCallback } from "react";
import { Brain, ChevronRight, RotateCcw, CheckCircle, XCircle, Loader2, Lightbulb, AlertCircle } from "lucide-react";
import { generateQuiz, explainAnswer } from "../utils/api";
import { EXAMS, DIFFICULTY_LEVELS } from "../data/exams";

const STEPS = { CONFIG: "config", LOADING: "loading", QUIZ: "quiz", REVIEW: "review" };

export default function Quiz({ userProfile, onStatsUpdate }) {
  const [step, setStep] = useState(STEPS.CONFIG);
  const [config, setConfig] = useState({
    exam: userProfile?.exam || "UPSC CSE",
    subject: "",
    topic: "",
    difficulty: "Mixed",
    count: 5,
  });
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [loadingExp, setLoadingExp] = useState(false);
  const [error, setError] = useState("");
  const [score, setScore] = useState(null);

  const selectedExam = EXAMS.find(e => e.name === config.exam) || EXAMS[0];

  const startQuiz = useCallback(async () => {
    setStep(STEPS.LOADING);
    setError("");
    try {
      const qs = await generateQuiz({
        exam: config.exam,
        subject: config.subject || selectedExam.subjects[0],
        topic: config.topic,
        difficulty: config.difficulty,
        count: config.count,
      });
      setQuestions(qs);
      setAnswers({});
      setCurrent(0);
      setSelected(null);
      setRevealed(false);
      setExplanation("");
      setStep(STEPS.QUIZ);
    } catch (e) {
      setError(e.message);
      setStep(STEPS.CONFIG);
    }
  }, [config, selectedExam]);

  const handleSelect = (opt) => {
    if (revealed) return;
    setSelected(opt);
  };

  const handleReveal = async () => {
    if (!selected) return;
    setRevealed(true);
    const q = questions[current];
    setAnswers(prev => ({ ...prev, [current]: selected }));

    // Fetch AI explanation
    setLoadingExp(true);
    try {
      const exp = await explainAnswer({
        question: q.question,
        correct: q.options[q.correct.charCodeAt(0) - 65],
        userAnswer: q.options[selected.charCodeAt(0) - 65],
        explanation: q.explanation,
      });
      setExplanation(exp);
    } catch {}
    setLoadingExp(false);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setRevealed(false);
      setExplanation("");
    } else {
      // Calculate score
      const correct = questions.filter((q, i) => answers[i] === q.correct).length;
      const pct = Math.round((correct / questions.length) * 100);
      setScore({ correct, total: questions.length, pct });
      onStatsUpdate?.({ quizCompleted: true, score: pct, questionCount: questions.length });
      setStep(STEPS.REVIEW);
    }
  };

  const q = questions[current];
  const optLabels = ["A", "B", "C", "D"];

  // ── Config Screen ──────────────────────────────────────────────────────────
  if (step === STEPS.CONFIG) return (
    <div className="p-6 max-w-2xl mx-auto animate-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-saffron-500/10 border border-saffron-500/20 flex items-center justify-center">
          <Brain size={20} className="text-saffron-400" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Smart Quiz</h2>
          <p className="text-sm text-white/40">AI-generated, adaptive MCQs</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Exam */}
        <div>
          <label className="block text-sm text-white/50 mb-2">Exam</label>
          <div className="grid grid-cols-3 gap-2">
            {EXAMS.map(ex => (
              <button
                key={ex.id}
                onClick={() => setConfig(c => ({ ...c, exam: ex.name, subject: "" }))}
                className={`p-3 rounded-xl border text-sm font-medium transition-all
                  ${config.exam === ex.name
                    ? "border-saffron-500/50 bg-saffron-500/10 text-saffron-400"
                    : "border-white/5 bg-dark-700/40 text-white/50 hover:border-white/10 hover:text-white/70"
                  }`}
              >
                <span className="block text-lg mb-1">{ex.icon}</span>
                {ex.name}
              </button>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm text-white/50 mb-2">Subject</label>
          <select
            value={config.subject}
            onChange={e => setConfig(c => ({ ...c, subject: e.target.value }))}
            className="input"
          >
            <option value="">All Subjects</option>
            {selectedExam.subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-sm text-white/50 mb-2">Specific Topic (optional)</label>
          <input
            type="text"
            value={config.topic}
            onChange={e => setConfig(c => ({ ...c, topic: e.target.value }))}
            placeholder="e.g. Fundamental Rights, Trigonometry, Organelles..."
            className="input"
          />
        </div>

        {/* Difficulty & Count */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/50 mb-2">Difficulty</label>
            <div className="grid grid-cols-2 gap-1.5">
              {DIFFICULTY_LEVELS.map(d => (
                <button
                  key={d}
                  onClick={() => setConfig(c => ({ ...c, difficulty: d }))}
                  className={`py-2 rounded-lg text-xs font-medium border transition-all
                    ${config.difficulty === d
                      ? "border-saffron-500/50 bg-saffron-500/10 text-saffron-400"
                      : "border-white/5 bg-dark-700/40 text-white/40 hover:text-white/60"
                    }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-2">No. of Questions</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[5, 10, 15].map(n => (
                <button
                  key={n}
                  onClick={() => setConfig(c => ({ ...c, count: n }))}
                  className={`py-2 rounded-lg text-sm font-mono font-medium border transition-all
                    ${config.count === n
                      ? "border-saffron-500/50 bg-saffron-500/10 text-saffron-400"
                      : "border-white/5 bg-dark-700/40 text-white/40 hover:text-white/60"
                    }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={startQuiz} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
          <Brain size={18} />
          Generate Quiz with AI
        </button>
      </div>
    </div>
  );

  // ── Loading ────────────────────────────────────────────────────────────────
  if (step === STEPS.LOADING) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="w-14 h-14 rounded-2xl bg-saffron-500/10 border border-saffron-500/20 flex items-center justify-center">
        <Loader2 size={24} className="text-saffron-400 animate-spin" />
      </div>
      <p className="text-white/60">Generating your personalized quiz...</p>
      <p className="text-white/30 text-sm">AI is crafting {config.count} questions for {config.exam}</p>
    </div>
  );

  // ── Review Screen ──────────────────────────────────────────────────────────
  if (step === STEPS.REVIEW) return (
    <div className="p-6 max-w-2xl mx-auto animate-in space-y-5">
      <div className="text-center py-4">
        <div className={`text-6xl font-display font-bold mb-2
          ${score.pct >= 80 ? "text-emerald-400" : score.pct >= 50 ? "text-saffron-400" : "text-red-400"}`}>
          {score.pct}%
        </div>
        <p className="text-white/60">{score.correct} / {score.total} correct</p>
        <p className="text-white/40 text-sm mt-1">
          {score.pct >= 80 ? "🎉 Excellent! Keep it up!" : score.pct >= 50 ? "👍 Good effort! Practice more." : "💪 Keep practicing — you'll get there!"}
        </p>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => {
          const userAns = answers[i];
          const isCorrect = userAns === q.correct;
          return (
            <div key={i} className={`card border ${isCorrect ? "border-emerald-500/20" : "border-red-500/20"}`}>
              <div className="flex items-start gap-3">
                {isCorrect
                  ? <CheckCircle size={17} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  : <XCircle size={17} className="text-red-400 flex-shrink-0 mt-0.5" />
                }
                <div>
                  <p className="text-sm text-white/80">{q.question}</p>
                  <p className="text-xs text-white/40 mt-1">
                    Correct: <span className="text-emerald-400">{q.correct}. {q.options[q.correct.charCodeAt(0)-65]}</span>
                    {!isCorrect && <> · Your answer: <span className="text-red-400">{userAns}. {q.options[userAns?.charCodeAt(0)-65]}</span></>}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={() => setStep(STEPS.CONFIG)} className="btn-secondary w-full flex items-center justify-center gap-2">
        <RotateCcw size={16} />
        Start New Quiz
      </button>
    </div>
  );

  // ── Quiz Screen ────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-2xl mx-auto animate-in">
      {/* Progress */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm text-white/40 font-mono">{current + 1} / {questions.length}</span>
        <span className={`badge text-xs
          ${q?.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400" :
            q?.difficulty === "Hard" ? "bg-red-500/10 text-red-400" : "bg-saffron-500/10 text-saffron-400"}`}>
          {q?.difficulty}
        </span>
      </div>
      <div className="h-1 bg-dark-600 rounded-full mb-6 overflow-hidden">
        <div className="progress-bar h-full" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="card border-indigo-500/10 bg-indigo-500/5 mb-5">
        <p className="text-base text-white/90 leading-relaxed">{q?.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2.5 mb-5">
        {q?.options.map((opt, i) => {
          const label = optLabels[i];
          const isSelected = selected === label;
          const isCorrect = q.correct === label;
          let cls = "border-white/5 bg-dark-700/40 text-white/70 hover:border-white/15 hover:text-white";
          if (revealed) {
            if (isCorrect) cls = "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
            else if (isSelected && !isCorrect) cls = "border-red-500/50 bg-red-500/10 text-red-300";
            else cls = "border-white/5 bg-dark-700/20 text-white/30";
          } else if (isSelected) {
            cls = "border-saffron-500/50 bg-saffron-500/10 text-saffron-300";
          }

          return (
            <button
              key={label}
              onClick={() => handleSelect(label)}
              disabled={revealed}
              className={`w-full flex items-start gap-4 p-4 rounded-xl border text-sm text-left transition-all duration-200 ${cls}`}
            >
              <span className="font-mono font-medium flex-shrink-0 mt-0.5">{label}.</span>
              <span>{opt}</span>
              {revealed && isCorrect && <CheckCircle size={16} className="ml-auto flex-shrink-0 mt-0.5 text-emerald-400" />}
              {revealed && isSelected && !isCorrect && <XCircle size={16} className="ml-auto flex-shrink-0 mt-0.5 text-red-400" />}
            </button>
          );
        })}
      </div>

      {/* AI Explanation */}
      {revealed && (
        <div className="card border-indigo-500/15 bg-indigo-500/5 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={14} className="text-indigo-400" />
            <span className="text-xs font-medium text-indigo-400">AI Explanation</span>
          </div>
          {loadingExp
            ? <div className="flex items-center gap-2 text-white/30 text-sm"><Loader2 size={13} className="animate-spin" /> Generating explanation...</div>
            : <p className="text-sm text-white/70 leading-relaxed">{explanation || q?.explanation}</p>
          }
        </div>
      )}

      {/* CTA */}
      {!revealed
        ? <button
            onClick={handleReveal}
            disabled={!selected}
            className={`w-full py-3 rounded-xl font-medium text-sm transition-all
              ${selected ? "btn-primary" : "bg-dark-600 text-white/20 cursor-not-allowed"}`}
          >
            Check Answer
          </button>
        : <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
            {current < questions.length - 1 ? "Next Question" : "See Results"}
            <ChevronRight size={16} />
          </button>
      }
    </div>
  );
}
