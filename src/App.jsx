import React, { useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import OnboardingModal from "./components/OnboardingModal";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import CurrentAffairs from "./pages/CurrentAffairs";
import AnswerWriting from "./pages/AnswerWriting";
import Tutor from "./pages/Tutor";
import PYQSolver from "./pages/PYQSolver";
import Leaderboard from "./pages/Leaderboard";
import SettingsPage from "./pages/Settings";
import { useLocalStorage } from "./hooks/useLocalStorage";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  quiz: "Smart Quiz",
  "current-affairs": "Current Affairs",
  "answer-writing": "Answer Writing Coach",
  tutor: "AI Tutor",
  pyq: "PYQ Solver",
  leaderboard: "Leaderboard",
  settings: "Settings",
};

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [userProfile, setUserProfile] = useLocalStorage("pm_profile", null);
  const [stats, setStats] = useLocalStorage("pm_stats", {
    totalQuizzes: 0,
    accuracy: 0,
    avgScore: 0,
    studyHours: 0,
    streak: 0,
    todayQuestions: 0,
    totalScore: 0,
  });

  const handleStatsUpdate = useCallback(({ quizCompleted, score, questionCount }) => {
    setStats(prev => {
      const newTotal = prev.totalQuizzes + (quizCompleted ? 1 : 0);
      const newAvg = newTotal > 0
        ? Math.round((prev.avgScore * prev.totalQuizzes + score) / newTotal)
        : score;
      return {
        ...prev,
        totalQuizzes: newTotal,
        avgScore: newAvg,
        accuracy: newAvg,
        todayQuestions: (prev.todayQuestions || 0) + (questionCount || 0),
        totalScore: (prev.totalScore || 0) + Math.round(score * 10),
        streak: prev.streak || 1,
      };
    });
  }, [setStats]);

  const navigate = useCallback((page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Show onboarding if no profile
  if (!userProfile) {
    return <OnboardingModal onComplete={(profile) => setUserProfile(profile)} />;
  }

  const renderPage = () => {
    const props = { userProfile, stats, onNavigate: navigate, onStatsUpdate: handleStatsUpdate };
    switch (activePage) {
      case "dashboard":       return <Dashboard {...props} />;
      case "quiz":            return <Quiz {...props} />;
      case "current-affairs": return <CurrentAffairs {...props} />;
      case "answer-writing":  return <AnswerWriting {...props} />;
      case "tutor":           return <Tutor {...props} />;
      case "pyq":             return <PYQSolver {...props} />;
      case "leaderboard":     return <Leaderboard {...props} />;
      case "settings":        return <SettingsPage {...props} onUpdateProfile={(p) => setUserProfile(p)} />;
      default:                return <Dashboard {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-saffron-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Sidebar — desktop only */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar activePage={activePage} onNavigate={navigate} userProfile={userProfile} />
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-y-auto relative">
        {/* Top bar — mobile */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3
          border-b border-white/5 bg-dark-900/80 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-saffron-500 to-amber-400 flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="font-display font-bold text-white text-sm">PareekshaMitra</span>
          </div>
          <h1 className="text-sm font-medium text-white/60">{PAGE_TITLES[activePage]}</h1>
          <div className="w-7 h-7 rounded-lg bg-dark-600 flex items-center justify-center text-xs font-bold text-saffron-400">
            {userProfile.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
        </div>

        {/* Page content */}
        <div className={activePage === "tutor" ? "" : "pb-20 lg:pb-0"}>
          {renderPage()}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <div className="lg:hidden">
        <MobileNav activePage={activePage} onNavigate={navigate} />
      </div>
    </div>
  );
}
