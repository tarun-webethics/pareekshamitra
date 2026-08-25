import React, { useState } from "react";
import { Zap, ChevronRight, Eye, EyeOff, CheckCircle, Server, Key, RefreshCw, AlertCircle } from "lucide-react";
import {
  setApiKey,
  getApiKey,
  setAiProvider,
  getAiProvider,
  setOllamaUrl,
  getOllamaUrl,
  setOllamaModel,
  getOllamaModel,
  testOllamaConnection,
} from "../utils/api";
import { EXAMS } from "../data/exams";

const STEPS = ["welcome", "exam", "ai_setup", "done"];

export default function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [exam, setExam] = useState("");
  const [provider, setProviderState] = useState(getAiProvider());
  const [ollamaUrl, setOllamaUrlState] = useState(getOllamaUrl());
  const [ollamaModel, setOllamaModelState] = useState(getOllamaModel());
  const [apiKey, setApiKeyState] = useState(getApiKey());
  const [showKey, setShowKey] = useState(false);

  const [testingOllama, setTestingOllama] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState(null); // { ok, message }

  const handleTestOllama = async () => {
    setTestingOllama(true);
    setOllamaStatus(null);
    const res = await testOllamaConnection(ollamaUrl);
    setTestingOllama(false);
    if (res.ok) {
      setOllamaStatus({
        ok: true,
        message: `Connected! Available models: ${res.models.join(", ") || "None found"}`,
      });
    } else {
      setOllamaStatus({
        ok: false,
        message: res.error,
      });
    }
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const finish = () => {
    setAiProvider(provider);
    setOllamaUrl(ollamaUrl.trim() || "http://localhost:11434");
    setOllamaModel(ollamaModel.trim() || "llama3.2:3b");
    if (apiKey.trim()) setApiKey(apiKey.trim());

    onComplete({
      name: name.trim() || "Aspirant",
      exam: exam || EXAMS[0].name,
      language: "en",
      dailyGoal: 20,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-md glass-strong rounded-2xl p-7 border border-white/10 shadow-2xl">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300
              ${i <= step ? "bg-saffron-500 w-6" : "bg-dark-400 w-3"}`}
            />
          ))}
        </div>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="text-center space-y-4 animate-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron-500 to-amber-400 flex items-center justify-center mx-auto shadow-xl shadow-saffron-500/30">
              <Zap size={28} className="text-white" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-2">
                Namaste! 🙏
              </h2>
              <p className="text-white/50 leading-relaxed">
                Welcome to <span className="text-saffron-400 font-medium">PareekshaMitra</span> — your AI-powered companion for cracking India's toughest exams.
              </p>
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-2 text-left">What should we call you?</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input"
                onKeyDown={(e) => e.key === "Enter" && name.trim() && next()}
              />
            </div>
            <button
              onClick={next}
              disabled={!name.trim()}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all
                ${name.trim() ? "btn-primary" : "bg-dark-600 text-white/20 cursor-not-allowed"}`}
            >
              Get Started <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 1: Exam */}
        {step === 1 && (
          <div className="space-y-4 animate-in">
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-1">Which exam? 🎯</h2>
              <p className="text-white/40 text-sm">We'll personalise everything for your target.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {EXAMS.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setExam(ex.name)}
                  className={`p-3 rounded-xl border text-sm font-medium text-left transition-all
                    ${exam === ex.name
                      ? "border-saffron-500/50 bg-saffron-500/10 text-saffron-400"
                      : "border-white/5 bg-dark-700/40 text-white/50 hover:border-white/10 hover:text-white/70"
                    }`}
                >
                  <span className="text-xl block mb-1">{ex.icon}</span>
                  <span className="block font-medium">{ex.name}</span>
                  <span className="text-xs text-white/30">{ex.level}</span>
                </button>
              ))}
            </div>
            <button
              onClick={next}
              disabled={!exam}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all
                ${exam ? "btn-primary" : "bg-dark-600 text-white/20 cursor-not-allowed"}`}
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: AI Provider Setup */}
        {step === 2 && (
          <div className="space-y-4 animate-in">
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-1">Choose AI Engine 🤖</h2>
              <p className="text-white/40 text-sm">Select local Ollama AI or Claude API.</p>
            </div>

            {/* Provider Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-dark-800 p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setProviderState("ollama")}
                className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${provider === "ollama"
                    ? "bg-saffron-500 text-white shadow"
                    : "text-white/50 hover:text-white/80"
                  }`}
              >
                <Server size={14} /> Local Ollama
              </button>
              <button
                type="button"
                onClick={() => setProviderState("claude")}
                className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${provider === "claude"
                    ? "bg-indigo-500 text-white shadow"
                    : "text-white/50 hover:text-white/80"
                  }`}
              >
                <Key size={14} /> Claude API
              </button>
            </div>

            {/* Ollama Options */}
            {provider === "ollama" ? (
              <div className="space-y-3">
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
                  <label className="block text-xs text-white/50 mb-1">Model Name</label>
                  <input
                    type="text"
                    value={ollamaModel}
                    onChange={(e) => setOllamaModelState(e.target.value)}
                    placeholder="llama3.2:3b"
                    className="input font-mono text-xs"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestOllama}
                    disabled={testingOllama}
                    className="text-xs bg-dark-600 hover:bg-dark-500 text-white/80 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw size={12} className={testingOllama ? "animate-spin" : ""} />
                    Test Connection
                  </button>
                </div>

                {ollamaStatus && (
                  <div
                    className={`p-2.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${ollamaStatus.ok
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      }`}
                  >
                    {ollamaStatus.ok ? <CheckCircle size={14} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />}
                    <span>{ollamaStatus.message}</span>
                  </div>
                )}

                <p className="text-[11px] text-white/30 leading-relaxed">
                  Make sure Ollama is running with CORS enabled: <code className="text-saffron-400 font-mono">OLLAMA_ORIGINS="*" ollama serve</code>
                </p>
              </div>
            ) : (
              /* Claude API Key Options */
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-dark-600/50 border border-white/5 text-xs text-white/40 leading-relaxed">
                  Get a key from{" "}
                  <a
                    href="https://console.anthropic.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-saffron-400 hover:underline"
                  >
                    console.anthropic.com
                  </a>
                  . Stored locally in your browser.
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            <button onClick={next} className="btn-primary w-full flex items-center justify-center gap-2">
              <CheckCircle size={16} /> Save & Continue
            </button>
          </div>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <div className="text-center space-y-5 animate-in">
            <div className="text-5xl">🎉</div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                You're all set, {name || "Aspirant"}!
              </h2>
              <p className="text-white/50 text-sm">
                Your journey to crack <span className="text-saffron-400">{exam}</span> starts now.
                Consistency beats intensity — study a little every day.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-left">
              {["Smart Quiz", "Current Affairs", "Answer Writing", "AI Tutor"].map((f) => (
                <div key={f} className="flex items-center gap-2 p-2.5 rounded-lg bg-dark-600/50 border border-white/5">
                  <CheckCircle size={13} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-white/60">{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={finish}
              disabled={!exam}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all
                ${exam ? "btn-primary" : "bg-dark-600 text-white/20 cursor-not-allowed"}`}
            >
              Start Preparing 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
