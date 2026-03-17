import React, { useState } from "react";
import { Trophy, Medal, Flame, Target, TrendingUp } from "lucide-react";

const MOCK_LEADERS = [
  { rank: 1, name: "Priya Sharma", city: "Delhi", exam: "UPSC CSE", score: 9840, streak: 47, accuracy: 92 },
  { rank: 2, name: "Rahul Verma", city: "Lucknow", exam: "SSC CGL", score: 9210, streak: 38, accuracy: 88 },
  { rank: 3, name: "Anjali Nair", city: "Kochi", exam: "IBPS PO", score: 8975, streak: 31, accuracy: 90 },
  { rank: 4, name: "Amit Kumar", city: "Patna", exam: "UPSC CSE", score: 8640, streak: 29, accuracy: 85 },
  { rank: 5, name: "Sneha Reddy", city: "Hyderabad", exam: "NEET UG", score: 8420, streak: 25, accuracy: 87 },
  { rank: 6, name: "Vikram Singh", city: "Jaipur", exam: "SSC CGL", score: 8100, streak: 22, accuracy: 83 },
  { rank: 7, name: "Pooja Gupta", city: "Pune", exam: "JEE Mains", score: 7890, streak: 19, accuracy: 80 },
  { rank: 8, name: "Ravi Tiwari", city: "Varanasi", exam: "RRB NTPC", score: 7650, streak: 17, accuracy: 78 },
  { rank: 9, name: "Meera Das", city: "Kolkata", exam: "IBPS PO", score: 7430, streak: 15, accuracy: 82 },
  { rank: 10, name: "Sanjay Patel", city: "Ahmedabad", exam: "UPSC CSE", score: 7200, streak: 14, accuracy: 76 },
];

const MEDAL_COLORS = {
  1: "text-yellow-400",
  2: "text-slate-300",
  3: "text-amber-600",
};

export default function Leaderboard({ userProfile, stats }) {
  const [filter, setFilter] = useState("All");
  const exams = ["All", ...new Set(MOCK_LEADERS.map(l => l.exam))];

  const filtered = filter === "All" ? MOCK_LEADERS : MOCK_LEADERS.filter(l => l.exam === filter);

  // Simulated user rank
  const userScore = stats?.totalScore || 1240;
  const userRank = 142;

  return (
    <div className="p-6 max-w-3xl mx-auto animate-in space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Trophy size={20} className="text-amber-400" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Leaderboard</h2>
          <p className="text-sm text-white/40">Top aspirants this week</p>
        </div>
      </div>

      {/* Your rank card */}
      <div className="card border-saffron-500/20 bg-saffron-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-saffron-500/20 flex items-center justify-center text-sm font-bold text-saffron-400">
              {userProfile?.name?.charAt(0)?.toUpperCase() || "Y"}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{userProfile?.name || "You"}</p>
              <p className="text-xs text-white/40">{userProfile?.exam || "No exam selected"}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-lg font-bold font-mono text-saffron-400">#{userRank}</p>
              <p className="text-xs text-white/30">Rank</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold font-mono text-white">{userScore.toLocaleString()}</p>
              <p className="text-xs text-white/30">Points</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold font-mono text-white flex items-center gap-1">
                <Flame size={14} className="text-saffron-400" />
                {stats?.streak || 0}
              </p>
              <p className="text-xs text-white/30">Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {exams.map(ex => (
          <button
            key={ex}
            onClick={() => setFilter(ex)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
              ${filter === ex
                ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                : "border-white/5 bg-dark-700/40 text-white/40 hover:text-white/60"
              }`}
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3">
        {[filtered[1], filtered[0], filtered[2]].map((leader, podiumIdx) => {
          if (!leader) return null;
          const podiumRanks = [2, 1, 3];
          const rank = podiumRanks[podiumIdx];
          const heights = ["h-20", "h-28", "h-16"];
          return (
            <div key={leader.rank} className={`flex flex-col items-center gap-2 ${podiumIdx === 1 ? "mt-0" : "mt-4"}`}>
              <div className="w-10 h-10 rounded-full bg-dark-600 border-2 border-dark-400 flex items-center justify-center text-sm font-bold text-white">
                {leader.name.charAt(0)}
              </div>
              <p className="text-xs text-white/70 font-medium text-center truncate w-full text-center">{leader.name.split(" ")[0]}</p>
              <p className="text-xs text-white/30">{leader.score.toLocaleString()} pts</p>
              <div className={`w-full ${heights[podiumIdx]} rounded-t-xl flex items-center justify-center
                ${rank === 1 ? "bg-gradient-to-t from-yellow-500/30 to-yellow-400/10 border border-yellow-500/20" :
                  rank === 2 ? "bg-gradient-to-t from-slate-500/30 to-slate-400/10 border border-slate-500/20" :
                  "bg-gradient-to-t from-amber-700/30 to-amber-600/10 border border-amber-700/20"}`}>
                <Medal size={20} className={MEDAL_COLORS[rank]} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Full list */}
      <div className="space-y-2">
        {filtered.map((leader) => (
          <div key={leader.rank} className={`flex items-center gap-4 p-3 rounded-xl border transition-all
            ${leader.rank <= 3 ? "border-white/10 bg-dark-700/50" : "border-white/5 bg-dark-700/20 hover:border-white/10"}`}>
            <span className={`w-7 text-center font-mono text-sm font-bold flex-shrink-0
              ${MEDAL_COLORS[leader.rank] || "text-white/30"}`}>
              {leader.rank <= 3 ? <Medal size={16} className="mx-auto" /> : `#${leader.rank}`}
            </span>
            <div className="w-8 h-8 rounded-lg bg-dark-500 flex items-center justify-center text-xs font-bold text-white/70 flex-shrink-0">
              {leader.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/80 truncate">{leader.name}</p>
              <p className="text-xs text-white/30">{leader.city} · {leader.exam}</p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-center hidden sm:block">
                <p className="text-xs font-mono font-medium text-white/70">{leader.accuracy}%</p>
                <p className="text-[10px] text-white/25">accuracy</p>
              </div>
              <div className="flex items-center gap-1">
                <Flame size={12} className="text-saffron-400" />
                <span className="text-xs font-mono text-white/50">{leader.streak}d</span>
              </div>
              <p className="text-sm font-mono font-bold text-white">{leader.score.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-white/20">Scores update every 24 hours · Keep your streak alive!</p>
    </div>
  );
}
