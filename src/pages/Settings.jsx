import React, { useState } from "react";
import { Settings, Eye, EyeOff, Save, CheckCircle, AlertCircle, Key, User, BookOpen } from "lucide-react";
import { getApiKey, setApiKey } from "../utils/api";
import { EXAMS, LANGUAGES } from "../data/exams";

export default function SettingsPage({ userProfile, onUpdateProfile }) {
  const [apiKey, setApiKeyState] = useState(getApiKey());
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: userProfile?.name || "",
    exam: userProfile?.exam || "",
    language: userProfile?.language || "en",
    dailyGoal: userProfile?.dailyGoal || 20,
  });

  const saveSettings = () => {
    setApiKey(apiKey.trim());
    onUpdateProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto animate-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-dark-500 border border-white/10 flex items-center justify-center">
          <Settings size={20} className="text-white/60" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Settings</h2>
          <p className="text-sm text-white/40">Configure your experience</p>
        </div>
      </div>

      {/* API Key section */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Key size={16} className="text-saffron-400" />
          <h3 className="font-medium text-white">Anthropic API Key</h3>
        </div>
        <div className="p-3 rounded-xl bg-dark-600/50 border border-white/5">
          <p className="text-xs text-white/40 leading-relaxed">
            This app uses Claude AI. Get your free API key from{" "}
            <a href="https://console.anthropic.com" target="_blank" rel="noreferrer"
              className="text-saffron-400 hover:text-saffron-300 underline">
              console.anthropic.com
            </a>
            . Your key is stored locally in your browser and never sent anywhere except Anthropic's servers.
          </p>
        </div>
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={e => setApiKeyState(e.target.value)}
            placeholder="sk-ant-api03-..."
            className="input font-mono pr-11 text-sm"
          />
          <button
            onClick={() => setShowKey(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {!apiKey && (
          <div className="flex items-center gap-2 text-xs text-amber-400">
            <AlertCircle size={13} />
            No API key set — AI features will not work
          </div>
        )}
        {apiKey && (
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle size={13} />
            API key configured
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User size={16} className="text-indigo-400" />
          <h3 className="font-medium text-white">Profile</h3>
        </div>
        <div>
          <label className="block text-sm text-white/50 mb-2">Your Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Rahul Kumar"
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm text-white/50 mb-2">Target Exam</label>
          <div className="grid grid-cols-3 gap-2">
            {EXAMS.map(ex => (
              <button
                key={ex.id}
                onClick={() => setProfile(p => ({ ...p, exam: ex.name }))}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all
                  ${profile.exam === ex.name
                    ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-400"
                    : "border-white/5 bg-dark-700/40 text-white/40 hover:border-white/10 hover:text-white/60"
                  }`}
              >
                <span className="block text-base mb-0.5">{ex.icon}</span>
                {ex.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-white/50 mb-2">Preferred Language</label>
          <select
            value={profile.language}
            onChange={e => setProfile(p => ({ ...p, language: e.target.value }))}
            className="input"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Study goals */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={16} className="text-emerald-400" />
          <h3 className="font-medium text-white">Study Goals</h3>
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-white/50">Daily Question Goal</label>
            <span className="text-sm font-mono text-saffron-400">{profile.dailyGoal} questions</span>
          </div>
          <input
            type="range"
            min={5} max={50} step={5}
            value={profile.dailyGoal}
            onChange={e => setProfile(p => ({ ...p, dailyGoal: Number(e.target.value) }))}
            className="w-full accent-saffron-500"
          />
          <div className="flex justify-between text-xs text-white/20 mt-1">
            <span>5</span><span>25</span><span>50</span>
          </div>
        </div>
      </div>

      {/* Save */}
      <button onClick={saveSettings} className="btn-primary w-full flex items-center justify-center gap-2">
        {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Settings</>}
      </button>

      {/* About */}
      <div className="text-center space-y-1 pb-4">
        <p className="text-xs text-white/20">PareekshaMitra v1.0 · Built with Claude AI</p>
        <p className="text-xs text-white/15">For UPSC, SSC, IBPS, NEET, JEE & more</p>
      </div>
    </div>
  );
}
