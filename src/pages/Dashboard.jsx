import React from "react";
import { Brain, Newspaper, PenLine, Trophy, TrendingUp, Target, Flame, Clock } from "lucide-react";
import { EXAMS, EXAM_COLORS } from "../data/exams";

const QUICK_ACTIONS = [
  { icon: Brain,     label: "Start Quiz",        page: "quiz",            color: "saffron" },
  { icon: Newspaper, label: "Today's Affairs",   page: "current-affairs", color: "indigo" },
  { icon: PenLine,   label: "Write Answer",       page: "answer-writing",  color: "emerald" },
  { icon: Trophy,    label: "Leaderboard",        page: "leaderboard",     color: "amber" },
];

export default function Dashboard({ onNavigate, userProfile, stats }) {
  const selectedExam = EXAMS.find(e => e.name === userProfile?.exam) || EXAMS[0];
  const c = EXAM_COLORS[selectedExam.color];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in">
      {/* Welcome header */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-dark-700 to-dark-600 border border-white/5">
        <div className="absolute inset-0 bg-hero-pattern opacity-60" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-white/40 text-sm mb-1">Welcome back,</p>
            <h2 className="font-display text-3xl font-bold text-white">
              {userProfile?.name || "Aspirant"} 🙏
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <span className={`badge ${c.bg} ${c.text} border ${c.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                {selectedExam.name}
              </span>
              <span className="badge bg-white/5 text-white/40 border border-white/10">
                <Flame size={11} className="text-saffron-400" />
                {stats?.streak || 0} day streak
              </span>
            </div>
          </div>
          <div className="text-5xl">{selectedExam.icon}</div>
        </div>

        {/* Progress bar */}
        <div className="relative z-10 mt-5">
          <div className="flex justify-between text-xs text-white/40 mb-1.5">
            <span>Daily Goal</span>
            <span>{stats?.todayQuestions || 0} / 20 questions</span>
          </div>
          <div className="h-1.5 bg-dark-500 rounded-full overflow-hidden">
            <div
              className="progress-bar h-full"
              style={{ width: `${Math.min(((stats?.todayQuestions || 0) / 20) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Brain,      label: "Total Quizzes",  val: stats?.totalQuizzes || 0,  color: "saffron" },
          { icon: Target,     label: "Accuracy",        val: `${stats?.accuracy || 0}%`, color: "indigo" },
          { icon: TrendingUp, label: "Avg Score",       val: `${stats?.avgScore || 0}%`, color: "emerald" },
          { icon: Clock,      label: "Study Hours",     val: `${stats?.studyHours || 0}h`, color: "amber" },
        ].map(({ icon: Icon, label, val, color }) => (
          <div key={label} className="card">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3
              bg-${color}-500/10 border border-${color}-500/20`}>
              <Icon size={15} className={`text-${color}-400`} />
            </div>
            <p className="text-2xl font-bold text-white font-mono">{val}</p>
            <p className="text-xs text-white/40 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-3">Quick Start</h3>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map(({ icon: Icon, label, page, color }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`card flex items-center gap-4 text-left hover:scale-[1.01] active:scale-[0.99] cursor-pointer`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                bg-${color}-500/10 border border-${color}-500/20 flex-shrink-0`}>
                <Icon size={19} className={`text-${color}-400`} />
              </div>
              <span className="font-medium text-white/80 hover:text-white transition-colors">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subjects */}
      <div>
        <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-3">
          {selectedExam.name} Subjects
        </h3>
        <div className="flex flex-wrap gap-2">
          {selectedExam.subjects.map(sub => (
            <button
              key={sub}
              onClick={() => onNavigate("quiz")}
              className="px-3 py-1.5 rounded-lg text-sm bg-dark-600/60 border border-white/5 text-white/60
                         hover:border-saffron-500/30 hover:text-saffron-400 hover:bg-saffron-500/5 transition-all"
            >
              {sub}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
