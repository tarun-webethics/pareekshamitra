import React, { useState } from "react";
import {
  X,
  Download,
  Copy,
  Check,
  Flame,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  Twitter,
  Facebook,
  Instagram,
  QrCode,
  Smartphone,
  Square
} from "lucide-react";

export default function ShareRankModal({ isOpen, onClose, userProfile, stats, userRank = 142 }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const rank = userRank;
  const score = stats?.totalScore || 1240;
  const streak = stats?.streak || 7;
  const accuracy = stats?.accuracy || 88;
  const userName = userProfile?.name || "Aspirant";
  const userExam = userProfile?.exam || "Competitive Exams";
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const shareText = `🚀 I just reached Rank #${rank} on PareekshaMitra! 🎯 Score: ${score.toLocaleString()} Pts | ${streak}-Day Streak 🔥\n\nPreparing for ${userExam} with AI guidance on PareekshaMitra! #PareekshaMitra #ExamPrep #TopAspirant`;
  const shareUrl = "https://pareekshamitra.app";

  if (!isOpen) return null;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setStatusMessage("Caption & link copied to clipboard!");
    setTimeout(() => {
      setCopied(false);
      setStatusMessage("");
    }, 3000);
  };

  // High resolution PNG download (Supports "square" 1200x1200 and "story" 1080x1920)
  const generateCanvasAndDownload = (format = "square") => {
    setDownloading(true);
    setStatusMessage(`Generating ${format === "story" ? "Instagram Story (9:16)" : "Square Certificate"}...`);

    const canvas = document.createElement("canvas");
    const isStory = format === "story";

    canvas.width = isStory ? 1080 : 1200;
    canvas.height = isStory ? 1920 : 1200;
    const ctx = canvas.getContext("2d");

    const w = canvas.width;
    const h = canvas.height;

    // Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, w, h);
    bgGradient.addColorStop(0, "#0f172a");
    bgGradient.addColorStop(0.4, "#1e1b4b");
    bgGradient.addColorStop(1, "#020617");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, w, h);

    // Decorative Ambient Glows
    const glow1 = ctx.createRadialGradient(w * 0.3, h * 0.2, 10, w * 0.3, h * 0.2, w * 0.5);
    glow1.addColorStop(0, "rgba(249, 115, 22, 0.3)");
    glow1.addColorStop(1, "rgba(249, 115, 22, 0)");
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, w, h);

    const glow2 = ctx.createRadialGradient(w * 0.8, h * 0.8, 10, w * 0.8, h * 0.8, w * 0.5);
    glow2.addColorStop(0, "rgba(234, 179, 8, 0.25)");
    glow2.addColorStop(1, "rgba(234, 179, 8, 0)");
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, w, h);

    // Outer Frame Border
    ctx.strokeStyle = "rgba(249, 115, 22, 0.35)";
    ctx.lineWidth = isStory ? 16 : 12;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, w - 90, h - 90);

    ctx.textAlign = "center";

    if (isStory) {
      // INSTAGRAM STORY LAYOUT (1080 x 1920 VERTICAL)

      // Header Brand Pill
      ctx.fillStyle = "rgba(249, 115, 22, 0.15)";
      ctx.beginPath();
      ctx.roundRect(w / 2 - 220, 140, 440, 74, 37);
      ctx.fill();
      ctx.strokeStyle = "rgba(249, 115, 22, 0.4)";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#f97316";
      ctx.font = "bold 34px sans-serif";
      ctx.fillText("PAREEKSHA MITRA", w / 2, 188);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 24px sans-serif";
      ctx.fillText("AI-Powered Exam Preparation Platform", w / 2, 260);

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("✦ TOP ASPIRANT ACHIEVER ✦", w / 2, 320);

      // Main Card Container
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.beginPath();
      ctx.roundRect(80, 370, 920, 1120, 32);
      ctx.fill();
      ctx.strokeStyle = "rgba(249, 115, 22, 0.3)";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Avatar Circle
      ctx.fillStyle = "rgba(249, 115, 22, 0.25)";
      ctx.beginPath();
      ctx.arc(w / 2, 480, 65, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 56px sans-serif";
      ctx.fillText(userName.charAt(0).toUpperCase(), w / 2, 500);

      // Name & Exam
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px sans-serif";
      ctx.fillText(userName, w / 2, 600);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "600 28px sans-serif";
      ctx.fillText(`Targeting: ${userExam}`, w / 2, 650);

      // Huge Rank Badge Box
      const rankGrad = ctx.createLinearGradient(200, 710, 880, 910);
      rankGrad.addColorStop(0, "rgba(249, 115, 22, 0.25)");
      rankGrad.addColorStop(1, "rgba(234, 179, 8, 0.25)");
      ctx.fillStyle = rankGrad;
      ctx.beginPath();
      ctx.roundRect(160, 710, 760, 220, 28);
      ctx.fill();
      ctx.strokeStyle = "rgba(251, 191, 36, 0.6)";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("WEEKLY LEADERBOARD RANK", w / 2, 760);

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 100px sans-serif";
      ctx.fillText(`#${rank}`, w / 2, 875);

      // Stat Cards
      const statsY = 980;
      const boxW = 260;

      // Score
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.beginPath();
      ctx.roundRect(140, statsY, boxW, 140, 20);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 38px sans-serif";
      ctx.fillText(score.toLocaleString(), 270, statsY + 65);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 22px sans-serif";
      ctx.fillText("Total Points", 270, statsY + 105);

      // Streak
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.beginPath();
      ctx.roundRect(410, statsY, boxW, 140, 20);
      ctx.fill();
      ctx.strokeStyle = "rgba(249, 115, 22, 0.4)";
      ctx.stroke();

      ctx.fillStyle = "#f97316";
      ctx.font = "bold 38px sans-serif";
      ctx.fillText(`🔥 ${streak}d`, 540, statsY + 65);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 22px sans-serif";
      ctx.fillText("Day Streak", 540, statsY + 105);

      // Accuracy
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.beginPath();
      ctx.roundRect(680, statsY, boxW, 140, 20);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.stroke();

      ctx.fillStyle = "#34d399";
      ctx.font = "bold 38px sans-serif";
      ctx.fillText(`${accuracy}%`, 810, statsY + 65);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 22px sans-serif";
      ctx.fillText("Accuracy", 810, statsY + 105);

      // Call to action & Website link
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 34px sans-serif";
      ctx.fillText("Prepare Smarter with PareekshaMitra AI", w / 2, 1200);

      ctx.fillStyle = "#f97316";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText("Visit: pareekshamitra.app", w / 2, 1250);

      ctx.fillStyle = "#64748b";
      ctx.font = "500 22px sans-serif";
      ctx.fillText(`Issued: ${currentDate} • Verified Leaderboard`, w / 2, 1420);

      // Outer Footer Branding
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText("PareekshaMitra", w / 2, 1600);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 24px sans-serif";
      ctx.fillText("Your Ultimate AI Study Companion for Competitive Exams", w / 2, 1645);

      ctx.fillStyle = "#475569";
      ctx.font = "500 20px sans-serif";
      ctx.fillText("#PareekshaMitra #ExamPrep #TopAspirant #UPSC #SSC", w / 2, 1720);

    } else {
      // SQUARE POST LAYOUT (1200 x 1200)
      ctx.fillStyle = "rgba(249, 115, 22, 0.15)";
      ctx.beginPath();
      ctx.roundRect(400, 90, 400, 64, 32);
      ctx.fill();
      ctx.strokeStyle = "rgba(249, 115, 22, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#f97316";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText("PAREEKSHA MITRA", 600, 132);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 20px sans-serif";
      ctx.fillText("AI-Powered Exam Preparation Platform", 600, 190);

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("✦ OFFICIAL RANK CERTIFICATE ✦", 600, 240);

      ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
      ctx.beginPath();
      ctx.roundRect(100, 270, 1000, 680, 24);
      ctx.fill();
      ctx.strokeStyle = "rgba(249, 115, 22, 0.25)";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "rgba(249, 115, 22, 0.2)";
      ctx.beginPath();
      ctx.arc(600, 350, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 44px sans-serif";
      ctx.fillText(userName.charAt(0).toUpperCase(), 600, 365);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 42px sans-serif";
      ctx.fillText(userName, 600, 440);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "600 24px sans-serif";
      ctx.fillText(`Targeting: ${userExam}`, 600, 480);

      const rankGrad = ctx.createLinearGradient(350, 520, 850, 650);
      rankGrad.addColorStop(0, "rgba(249, 115, 22, 0.2)");
      rankGrad.addColorStop(1, "rgba(234, 179, 8, 0.2)");
      ctx.fillStyle = rankGrad;
      ctx.beginPath();
      ctx.roundRect(300, 520, 600, 150, 20);
      ctx.fill();
      ctx.strokeStyle = "rgba(251, 191, 36, 0.5)";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "600 20px sans-serif";
      ctx.fillText("WEEKLY LEADERBOARD RANK", 600, 555);

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 72px sans-serif";
      ctx.fillText(`#${rank}`, 600, 635);

      const statsY = 700;
      const boxW = 280;

      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.beginPath();
      ctx.roundRect(140, statsY, boxW, 110, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText(score.toLocaleString(), 280, statsY + 55);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 18px sans-serif";
      ctx.fillText("Total Points", 280, statsY + 90);

      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.beginPath();
      ctx.roundRect(460, statsY, boxW, 110, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(249, 115, 22, 0.3)";
      ctx.stroke();

      ctx.fillStyle = "#f97316";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText(`🔥 ${streak} Days`, 600, statsY + 55);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 18px sans-serif";
      ctx.fillText("Active Streak", 600, statsY + 90);

      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.beginPath();
      ctx.roundRect(780, statsY, boxW, 110, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.stroke();

      ctx.fillStyle = "#34d399";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText(`${accuracy}%`, 920, statsY + 55);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 18px sans-serif";
      ctx.fillText("Accuracy Rate", 920, statsY + 90);

      ctx.fillStyle = "#64748b";
      ctx.font = "500 18px sans-serif";
      ctx.fillText(`Verified by PareekshaMitra Engine • Issued ${currentDate}`, 600, 905);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("Ace Competitive Exams with PareekshaMitra AI", 600, 1000);

      ctx.fillStyle = "#f97316";
      ctx.font = "600 22px sans-serif";
      ctx.fillText("Join the Top Aspirants: pareekshamitra.app", 600, 1040);

      ctx.fillStyle = "#475569";
      ctx.font = "500 16px sans-serif";
      ctx.fillText("#PareekshaMitra #ExamPrep #UPSC #SSC #NEET #JEE", 600, 1080);
    }

    // Trigger image download
    setTimeout(() => {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `PareekshaMitra_Rank_${rank}_${format.toUpperCase()}.png`;
      link.href = dataUrl;
      link.click();

      setDownloading(false);
      const msg = isStory
        ? "Instagram Story (9:16) image downloaded & caption copied! Upload to IG Story 📲"
        : "Square Rank Certificate downloaded & caption copied! Ready to post 📸";
      setStatusMessage(msg);
      setTimeout(() => setStatusMessage(""), 5000);
    }, 500);
  };

  // Social Sharing Handlers
  const handleInstagramStoryShare = () => {
    handleCopyCaption();
    generateCanvasAndDownload("story");
  };

  const handleInstagramPostShare = () => {
    handleCopyCaption();
    generateCanvasAndDownload("square");
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbUrl, "_blank", "width=600,height=500");
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`;
    window.open(waUrl, "_blank");
  };

  const handleTwitterShare = () => {
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twUrl, "_blank", "width=600,height=450");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/0.1 backdrop-blur-md animate-in">
      <div className="relative w-full max-w-xl bg-dark-800 border border-saffron-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-saffron-500/10 overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-saffron-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={14} /> Brand Promotion Certificate
          </div>
          <h3 className="font-display text-2xl font-bold text-white">Share Your Achievement</h3>
          <p className="text-xs text-white/50">Promote PareekshaMitra on Instagram Stories, Feed, or Social Media</p>
        </div>

        {/* Certificate Card Visual Preview */}
        <div className="relative bg-gradient-to-br from-dark-900 via-indigo-950/40 to-dark-900 border border-saffron-500/30 rounded-2xl p-6 shadow-inner space-y-5 overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Certificate Header Branding */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-saffron-500 to-amber-400 flex items-center justify-center text-dark-900 font-bold shadow-md shadow-saffron-500/20">
                <Flame size={20} className="fill-dark-900 text-dark-900" />
              </div>
              <div>
                <h4 className="font-bold text-white tracking-wide text-sm flex items-center gap-1.5">
                  PAREEKSHA MITRA
                  <ShieldCheck size={14} className="text-saffron-400" />
                </h4>
                <p className="text-[10px] text-saffron-400/90 font-medium">AI Exam Companion</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                TOP ASPIRANT
              </span>
              <p className="text-[10px] text-white/40 mt-0.5">{currentDate}</p>
            </div>
          </div>

          {/* Main User Rank Banner */}
          <div className="text-center bg-dark-800/80 border border-saffron-500/20 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-full bg-saffron-500/20 text-saffron-400 font-bold flex items-center justify-center text-sm border border-saffron-500/30">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">{userName}</p>
                <p className="text-xs text-white/50">{userExam}</p>
              </div>
            </div>

            {/* Rank Badge */}
            <div className="my-3 py-2 bg-gradient-to-r from-saffron-500/10 via-amber-500/20 to-saffron-500/10 border-y border-saffron-500/30">
              <p className="text-[10px] uppercase tracking-widest text-saffron-300 font-bold">Weekly Leaderboard Rank</p>
              <p className="text-4xl font-extrabold font-mono text-gradient drop-shadow-sm mt-0.5">#{rank}</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-dark-700/50 p-2 rounded-lg border border-white/5">
                <p className="text-sm font-mono font-bold text-white">{score.toLocaleString()}</p>
                <p className="text-[10px] text-white/40">Points</p>
              </div>
              <div className="bg-dark-700/50 p-2 rounded-lg border border-saffron-500/20">
                <p className="text-sm font-mono font-bold text-saffron-400 flex items-center justify-center gap-0.5">
                  <Flame size={12} className="text-saffron-400" />
                  {streak}d
                </p>
                <p className="text-[10px] text-white/40">Streak</p>
              </div>
              <div className="bg-dark-700/50 p-2 rounded-lg border border-white/5">
                <p className="text-sm font-mono font-bold text-emerald-400">{accuracy}%</p>
                <p className="text-[10px] text-white/40">Accuracy</p>
              </div>
            </div>
          </div>

          {/* Promotional Card Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 text-white/70">
              <QrCode size={20} className="text-saffron-400 shrink-0" />
              <div>
                <p className="font-semibold text-white text-[11px]">Crack exams with AI</p>
                <p className="text-[10px] text-saffron-400 font-mono">pareekshamitra.app</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-white/30">#PareekshaMitra</span>
            </div>
          </div>
        </div>

        {/* Status Toast Alert */}
        {statusMessage && (
          <div className="mt-4 p-2.5 rounded-xl bg-saffron-500/15 border border-saffron-500/30 text-saffron-300 text-xs text-center font-medium animate-in">
            {statusMessage}
          </div>
        )}

        {/* Actions Section */}
        <div className="mt-5 space-y-4">
          {/* Instagram Specific Share Options */}
          <div>
            <p className="text-[11px] font-semibold text-pink-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Instagram size={14} /> Instagram Share Options
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleInstagramStoryShare}
                disabled={downloading}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-amber-500/20 hover:from-pink-600/30 hover:to-amber-500/30 border border-pink-500/30 text-white font-medium text-xs transition-all active:scale-95 shadow-md"
              >
                <Smartphone size={16} className="text-pink-400" />
                <div className="text-left">
                  <p className="font-bold leading-tight">Instagram Story</p>
                  <p className="text-[10px] text-white/50">9:16 Vertical Card</p>
                </div>
              </button>

              <button
                onClick={handleInstagramPostShare}
                disabled={downloading}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 border border-purple-500/30 text-white font-medium text-xs transition-all active:scale-95 shadow-md"
              >
                <Square size={16} className="text-purple-400" />
                <div className="text-left">
                  <p className="font-bold leading-tight">Instagram Post</p>
                  <p className="text-[10px] text-white/50">1:1 Square Card</p>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Download & Copy Actions */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => generateCanvasAndDownload("square")}
              disabled={downloading}
              className="btn-primary flex items-center justify-center gap-2 py-2.5 text-xs font-semibold w-full"
            >
              <Download size={15} />
              {downloading ? "Generating..." : "Download PNG Image"}
            </button>

            <button
              onClick={handleCopyCaption}
              className="btn-secondary flex items-center justify-center gap-2 py-2.5 text-xs font-semibold w-full"
            >
              {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
              {copied ? "Caption Copied!" : "Copy Caption & Link"}
            </button>
          </div>

          {/* Other Social Platforms */}
          <div>
            <p className="text-[11px] font-semibold text-white/40 mb-2 uppercase tracking-wider text-center">
              Other Social Platforms
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 text-white/90 text-xs font-medium transition-all"
              >
                <MessageCircle size={16} className="text-emerald-400" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleFacebookShare}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 text-white/90 text-xs font-medium transition-all"
              >
                <Facebook size={16} className="text-blue-400" />
                <span>Facebook</span>
              </button>

              <button
                onClick={handleTwitterShare}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 hover:border-sky-500/40 text-white/90 text-xs font-medium transition-all"
              >
                <Twitter size={16} className="text-sky-400" />
                <span>Twitter / X</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
