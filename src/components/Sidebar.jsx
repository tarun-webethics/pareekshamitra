import React from "react";
import {
  LayoutDashboard, Brain, Newspaper, PenLine, MessageCircle,
  BookOpen, Trophy, Settings, ChevronRight, Zap
} from "lucide-react";

const NAV = [
  { id: "dashboard",      icon: LayoutDashboard, label: "Dashboard" },
  { id: "quiz",           icon: Brain,           label: "Smart Quiz" },
  { id: "current-affairs",icon: Newspaper,       label: "Current Affairs" },
  { id: "answer-writing", icon: PenLine,         label: "Answer Writing" },
  { id: "tutor",          icon: MessageCircle,   label: "AI Tutor" },
  { id: "pyq",            icon: BookOpen,        label: "PYQ Solver" },
  { id: "leaderboard",    icon: Trophy,          label: "Leaderboard" },
];

export default function Sidebar({ activePage, onNavigate, userProfile }) {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-screen sticky top-0 border-r border-white/5 bg-dark-800/50 backdrop-blur-xl">
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-saffron-500 to-amber-400 flex items-center justify-center shadow-lg shadow-saffron-500/30">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-white leading-none">Pareeksha</h1>
            <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Mitra AI</p>
          </div>
        </div>
      </div>

      {/* User profile pill */}
      {userProfile?.name && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-dark-600/50 border border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron-500 to-amber-400 flex items-center justify-center text-xs font-bold text-white">
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userProfile.name}</p>
            <p className="text-xs text-white/40 truncate">{userProfile.exam || "Select exam"}</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto mt-2">
        {NAV.map(({ id, icon: Icon, label }) => {
          const active = activePage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group
                ${active
                  ? "bg-saffron-500/15 text-saffron-400 border border-saffron-500/20"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
            >
              <Icon size={17} className={active ? "text-saffron-400" : "text-white/30 group-hover:text-white/60"} />
              <span className="font-medium">{label}</span>
              {active && <ChevronRight size={14} className="ml-auto text-saffron-400/60" />}
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => onNavigate("settings")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group
            ${activePage === "settings"
              ? "bg-saffron-500/15 text-saffron-400 border border-saffron-500/20"
              : "text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}
        >
          <Settings size={17} className="text-white/30 group-hover:text-white/60" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}
