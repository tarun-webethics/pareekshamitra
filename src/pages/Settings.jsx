import React, { useState, useEffect } from "react";
import {
  Settings,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  AlertCircle,
  Key,
  User,
  BookOpen,
  Server,
  RefreshCw,
  Cpu,
  Download,
} from "lucide-react";
import {
  getApiKey,
  setApiKey,
  getAiProvider,
  setAiProvider,
  getOllamaUrl,
  setOllamaUrl,
  getOllamaModel,
  setOllamaModel,
  testOllamaConnection,
} from "../utils/api";
import { EXAMS, LANGUAGES } from "../data/exams";

export default function SettingsPage({ userProfile, onUpdateProfile }) {
  const [provider, setProviderState] = useState(getAiProvider());
  const [ollamaUrl, setOllamaUrlState] = useState(getOllamaUrl());
  const [ollamaModel, setOllamaModelState] = useState(getOllamaModel());
  const [apiKey, setApiKeyState] = useState(getApiKey());
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const [testingOllama, setTestingOllama] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);

  const [profile, setProfile] = useState({
    name: userProfile?.name || "",
    exam: userProfile?.exam || "",
    language: userProfile?.language || "en",
    dailyGoal: userProfile?.dailyGoal || 20,
  });

  const handleTestOllama = async () => {
    setTestingOllama(true);
    setOllamaStatus(null);
    const res = await testOllamaConnection(ollamaUrl);
    setTestingOllama(false);
    if (res.ok && res.models?.length > 0) {
      setAvailableModels(res.models);
      setOllamaStatus({
        ok: true,
        message: `Connected successfully! Installed model(s): ${res.models.join(", ")}`,
      });
      // If current selected model is not set or not in list, auto-select first installed model
      if (!res.models.includes(ollamaModel)) {
        setOllamaModelState(res.models[0]);
      }
    } else {
      setAvailableModels([]);
      setOllamaStatus({
        ok: false,
        message: res.error,
      });
    }
  };

  useEffect(() => {
    if (provider === "ollama") {
      handleTestOllama();
    }
  }, [provider]);

  const saveSettings = () => {
    setAiProvider(provider);
    setOllamaUrl(ollamaUrl.trim());
    setOllamaModel(ollamaModel.trim());
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
          <p className="text-sm text-white/40">Configure your AI provider & user preferences</p>
        </div>
      </div>

      {/* AI Provider Section */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-saffron-400" />
            <h3 className="font-medium text-white">AI Engine Config</h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-saffron-500/10 text-saffron-400 border border-saffron-500/20 font-medium">
            Active: {provider === "ollama" ? "Ollama (Local)" : "Claude API"}
          </span>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-dark-800 p-1 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setProviderState("ollama")}
            className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
              provider === "ollama"
                ? "bg-saffron-500 text-white shadow"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <Server size={14} /> Ollama (Local AI)
          </button>
          <button
            type="button"
            onClick={() => setProviderState("claude")}
            className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
              provider === "claude"
                ? "bg-indigo-500 text-white shadow"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <Key size={14} /> Claude API (Cloud)
          </button>
        </div>

        {/* Ollama Settings */}
        {provider === "ollama" && (
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs text-white/50 mb-1">Ollama Host URL</label>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrlState(e.target.value)}
                placeholder="http://localhost:11434"
                className="input font-mono text-xs"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs text-white/50">Model Name</label>
                {availableModels.length > 0 && (
                  <span className="text-[11px] text-emerald-400 font-medium">
                    {availableModels.length} installed model(s) found
                  </span>
                )}
              </div>

              {availableModels.length > 0 ? (
                <div className="space-y-2">
                  <select
                    value={ollamaModel}
                    onChange={(e) => setOllamaModelState(e.target.value)}
                    className="input font-mono text-xs bg-dark-700 text-saffron-400 font-medium"
                  >
                    {availableModels.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={ollamaModel}
                    onChange={(e) => setOllamaModelState(e.target.value)}
                    placeholder="Custom model name"
                    className="input font-mono text-xs text-white/60"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={ollamaModel}
                  onChange={(e) => setOllamaModelState(e.target.value)}
                  placeholder="llama3.2"
                  className="input font-mono text-xs"
                />
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleTestOllama}
                disabled={testingOllama}
                className="text-xs bg-dark-600 hover:bg-dark-500 text-white/80 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={12} className={testingOllama ? "animate-spin" : ""} />
                Check Available Models
              </button>
            </div>

            {ollamaStatus && (
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
                  ollamaStatus.ok
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                }`}
              >
                {ollamaStatus.ok ? (
                  <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="font-medium">{ollamaStatus.message}</p>
                </div>
              </div>
            )}

            {/* Warning & Instructions if 0 models installed */}
            {availableModels.length === 0 && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-medium">
                  <Download size={15} />
                  <span>No AI Models Installed in Ollama</span>
                </div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  Run this command in your terminal to download a model:
                </p>
                <pre className="font-mono text-[11px] bg-black/40 text-saffron-300 p-2 rounded border border-white/10 select-all">
                  ollama pull llama3.2
                </pre>
                <p className="text-white/50 text-[10px]">
                  Or pull any other model: <code className="text-saffron-300">ollama pull mistral</code> or <code className="text-saffron-300">ollama pull qwen2.5</code>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Claude Settings */}
        {provider === "claude" && (
          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-dark-600/50 border border-white/5">
              <p className="text-xs text-white/40 leading-relaxed">
                Get a free Anthropic key from{" "}
                <a
                  href="https://console.anthropic.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-saffron-400 hover:text-saffron-300 underline"
                >
                  console.anthropic.com
                </a>
                . Stored locally in your browser.
              </p>
            </div>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
                placeholder="sk-ant-api03-..."
                className="input font-mono pr-11 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowKey((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {!apiKey ? (
              <div className="flex items-center gap-2 text-xs text-amber-400">
                <AlertCircle size={13} />
                No API key set — AI features will not work when Claude is selected.
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle size={13} />
                API key configured
              </div>
            )}
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
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Rahul Kumar"
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm text-white/50 mb-2">Target Exam</label>
          <div className="grid grid-cols-3 gap-2">
            {EXAMS.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => setProfile((p) => ({ ...p, exam: ex.name }))}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all
                  ${
                    profile.exam === ex.name
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
            onChange={(e) => setProfile((p) => ({ ...p, language: e.target.value }))}
            className="input"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
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
            min={5}
            max={50}
            step={5}
            value={profile.dailyGoal}
            onChange={(e) => setProfile((p) => ({ ...p, dailyGoal: Number(e.target.value) }))}
            className="w-full accent-saffron-500"
          />
          <div className="flex justify-between text-xs text-white/20 mt-1">
            <span>5</span>
            <span>25</span>
            <span>50</span>
          </div>
        </div>
      </div>

      {/* Save */}
      <button onClick={saveSettings} className="btn-primary w-full flex items-center justify-center gap-2">
        {saved ? (
          <>
            <CheckCircle size={16} /> Saved!
          </>
        ) : (
          <>
            <Save size={16} /> Save Settings
          </>
        )}
      </button>

      {/* About */}
      <div className="text-center space-y-1 pb-4">
        <p className="text-xs text-white/20">PareekshaMitra v1.1 · Powered by Ollama & Claude AI</p>
        <p className="text-xs text-white/15">For UPSC, SSC, IBPS, NEET, JEE & state exams</p>
      </div>
    </div>
  );
}
