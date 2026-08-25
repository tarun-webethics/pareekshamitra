import React, { useState, useEffect, useCallback } from "react";
import {
  Newspaper, Search, RefreshCw, Bookmark, ExternalLink,
  Sparkles, Share2, Globe, Calendar, Tag, AlertCircle,
  Check, Loader2, Key, X, Radio, ChevronRight, BookOpen
} from "lucide-react";
import { fetchCurrentsNews, analyzeNewsForExam, getCurrentsApiKey, setCurrentsApiKey } from "../utils/currentsApi";

const CATEGORIES = [
  { id: "all", label: "All News" },
  { id: "regional", label: "National & Regional" },
  { id: "business", label: "Economy & Business" },
  { id: "technology", label: "Science & Tech" },
  { id: "world", label: "World & International" },
  { id: "sports", label: "Sports" },
];

const PRESET_TAGS = [
  "India", "Economy", "Defense", "Environment", "ISRO", "AI & Tech", "Government Schemes", "IR & Security"
];

export default function DailyCurrentAffairs({ userProfile }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("feed"); // 'feed' | 'saved'

  // Saved news state (persisted in localStorage)
  const [savedNews, setSavedNews] = useState(() => {
    try {
      const stored = localStorage.getItem("pm_saved_news");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // AI Exam Analysis state
  const [analyzingArticleId, setAnalyzingArticleId] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [analysisText, setAnalysisText] = useState("");

  // API Key modal/settings state
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getCurrentsApiKey());

  // Copy notification state
  const [copiedId, setCopiedId] = useState(null);

  // Sync savedNews to localStorage
  useEffect(() => {
    localStorage.setItem("pm_saved_news", JSON.stringify(savedNews));
  }, [savedNews]);

  // Load news on mount or filter change
  const loadNews = useCallback(async (query = searchQuery, category = activeCategory) => {
    setLoading(true);
    setError("");
    try {
      const items = await fetchCurrentsNews({
        keywords: query,
        category: category,
        language: "en"
      });
      setNews(items);
    } catch (err) {
      setError(err.message || "Failed to load current affairs.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    loadNews(searchQuery, activeCategory);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadNews(searchQuery, activeCategory);
  };

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    loadNews(searchQuery, catId);
  };

  const handlePresetClick = (tag) => {
    setSearchQuery(tag);
    loadNews(tag, activeCategory);
  };

  const toggleSaveArticle = (article) => {
    setSavedNews((prev) => {
      const exists = prev.some((item) => item.id === article.id || item.url === article.url);
      if (exists) {
        return prev.filter((item) => item.id !== article.id && item.url !== article.url);
      } else {
        return [article, ...prev];
      }
    });
  };

  const isSaved = (article) => {
    return savedNews.some((item) => item.id === article.id || item.url === article.url);
  };

  const handleAnalyzeArticle = async (article) => {
    setAnalyzingArticleId(article.id);
    setSelectedAnalysis(article);
    setAnalysisText("");
    try {
      const examName = userProfile?.exam || "UPSC & Competitive Exams";
      const result = await analyzeNewsForExam({
        title: article.title,
        description: article.description,
        url: article.url,
        exam: examName,
      });
      setAnalysisText(result);
    } catch (err) {
      setAnalysisText(`⚠️ Unable to generate AI analysis: ${err.message}`);
    } finally {
      setAnalyzingArticleId(null);
    }
  };

  const handleShare = (article) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${article.title} - ${article.url}`);
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setCurrentsApiKey(apiKeyInput.trim());
      setShowKeyModal(false);
      loadNews(searchQuery, activeCategory);
    }
  };

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  const displayedList = activeTab === "saved" ? savedNews : news;


  console.log('newsssss>>>>>>', news)

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 animate-in">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-dark-800 via-dark-700 to-indigo-950/40 border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-saffron-500 to-amber-500 flex items-center justify-center shadow-lg shadow-saffron-500/20 flex-shrink-0">
              <Radio size={24} className="text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Daily Current Affairs
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Feed
                </span>
              </div>
              <p className="text-sm text-white/60 mt-1">
                Real-time daily news updates powered by <span className="text-saffron-400 font-mono">Currents API</span> for {userProfile?.exam || "all competitive exams"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setShowKeyModal(true)}
              className="px-3 py-2 rounded-xl bg-dark-600/80 hover:bg-dark-600 border border-white/10 text-white/70 hover:text-white text-xs font-medium flex items-center gap-2 transition-all"
              title="Configure Currents API Key"
            >
              <Key size={14} className="text-saffron-400" />
              <span>API Key</span>
            </button>

            <button
              onClick={() => loadNews(searchQuery, activeCategory)}
              disabled={loading}
              className="btn-primary flex items-center gap-2 text-xs py-2 px-4 shadow-lg shadow-saffron-500/20"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Tab Toggle: Live Feed vs Saved Articles */}
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("feed")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === "feed"
                ? "bg-saffron-500 text-white shadow-md shadow-saffron-500/30"
                : "bg-dark-600/50 text-white/50 hover:text-white hover:bg-dark-600"
                }`}
            >
              <Newspaper size={15} />
              <span>Latest News</span>
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === "saved"
                ? "bg-saffron-500 text-white shadow-md shadow-saffron-500/30"
                : "bg-dark-600/50 text-white/50 hover:text-white hover:bg-dark-600"
                }`}
            >
              <Bookmark size={15} />
              <span>Saved Articles</span>
              {savedNews.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                  {savedNews.length}
                </span>
              )}
            </button>
          </div>

          <span className="text-xs text-white/40 hidden sm:block">
            {activeTab === "feed" ? `Showing latest updates` : `${savedNews.length} bookmark(s)`}
          </span>
        </div>
      </div>

      {/* Search Bar & Preset Topic Tags */}
      {activeTab === "feed" && (
        <div className="space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search news by topic (e.g. RBI Policy, Defense, G20, Space, Budget)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-800/80 border border-white/10 rounded-2xl pl-12 pr-28 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/50 backdrop-blur-xl transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(""); loadNews("", activeCategory); }}
                className="absolute right-24 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
            >
              Search
            </button>
          </form>

          {/* Quick preset filter tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-white/40 flex items-center gap-1 font-medium whitespace-nowrap">
              <Tag size={12} className="text-saffron-400" /> Topic Highlights:
            </span>
            {PRESET_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handlePresetClick(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${searchQuery.toLowerCase() === tag.toLowerCase()
                  ? "bg-saffron-500/20 text-saffron-400 border-saffron-500/40"
                  : "bg-dark-700/40 border-white/5 text-white/50 hover:text-white/80 hover:bg-dark-700/80"
                  }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border whitespace-nowrap transition-all ${activeCategory === cat.id
                  ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-sm shadow-indigo-500/20"
                  : "bg-dark-800/60 border-white/5 text-white/50 hover:text-white/80 hover:bg-dark-800"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => loadNews(searchQuery, activeCategory)}
            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-medium transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="card animate-pulse space-y-3 p-5">
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-20 bg-white/5 rounded-xl" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-3 bg-white/10 rounded w-1/3" />
                <div className="h-8 bg-white/10 rounded-xl w-24" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && displayedList.length === 0 && (
        <div className="text-center py-16 px-4 card border-dashed space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-saffron-500/10 border border-saffron-500/20 flex items-center justify-center mx-auto text-saffron-400">
            {activeTab === "saved" ? <Bookmark size={28} /> : <Newspaper size={28} />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {activeTab === "saved" ? "No Saved Articles Yet" : "No Articles Found"}
            </h3>
            <p className="text-sm text-white/40 mt-1 max-w-md mx-auto">
              {activeTab === "saved"
                ? "Click the bookmark icon on any news card in the Live Feed tab to save it here for offline revision."
                : "Try searching with a different keyword or select another news category above."}
            </p>
          </div>
          {activeTab === "feed" && (
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("all"); loadNews("", "all"); }}
              className="btn-primary text-xs py-2 px-4"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Article Cards Grid */}
      {!loading && displayedList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedList.map((article) => {
            const saved = isSaved(article);
            const isAnalyzing = analyzingArticleId === article.id;

            return (
              <div
                key={article.id}
                className="card flex flex-col justify-between hover:border-saffron-500/30 transition-all duration-300 group"
              >
                <div>
                  {/* Article Thumbnail Image / Fallback Header */}
                  {article.image ? (
                    <div className="relative h-44 -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-2xl bg-dark-700">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="hidden absolute inset-0 bg-gradient-to-br from-indigo-900/60 to-dark-800 items-center justify-center p-4 text-center">
                        <Newspaper size={32} className="text-white/20" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 -mx-5 -mt-5 mb-4 rounded-t-2xl bg-gradient-to-r from-dark-700 via-indigo-950/40 to-dark-700 border-b border-white/5 flex items-center justify-between px-6">
                      <div className="flex items-center gap-2">
                        <Globe size={20} className="text-saffron-400/80" />
                        <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                          Currents News
                        </span>
                      </div>
                      <Radio size={16} className="text-white/20" />
                    </div>
                  )}

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between text-xs text-white/40 mb-2 gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {article.category && article.category.length > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold uppercase text-[10px] truncate">
                          {article.category[0]}
                        </span>
                      )}
                      {article.author && (
                        <span className="truncate">By {article.author}</span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 flex-shrink-0 text-[11px]">
                      <Calendar size={12} />
                      {formatDate(article.published)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-white text-base leading-snug group-hover:text-saffron-400 transition-colors line-clamp-2 mb-2">
                    {article.title}
                  </h3>

                  {/* Summary / Description */}
                  <p className="text-sm text-white/60 leading-relaxed line-clamp-3 mb-4">
                    {article.description}
                  </p>
                </div>

                {/* Card Action Buttons Bar */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 mt-auto">
                  <div className="flex items-center gap-1">
                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleSaveArticle(article)}
                      className={`p-2 rounded-xl border transition-all ${saved
                        ? "bg-saffron-500/15 border-saffron-500/40 text-saffron-400"
                        : "bg-dark-600/40 border-white/5 text-white/40 hover:text-white hover:bg-dark-600"
                        }`}
                      title={saved ? "Remove Bookmark" : "Save Article"}
                    >
                      <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
                    </button>

                    {/* Share Link Button */}
                    <button
                      onClick={() => handleShare(article)}
                      className="p-2 rounded-xl bg-dark-600/40 border border-white/5 text-white/40 hover:text-white hover:bg-dark-600 transition-all relative"
                      title="Copy article link"
                    >
                      {copiedId === article.id ? <Check size={15} className="text-emerald-400" /> : <Share2 size={15} />}
                    </button>

                    {/* AI Exam Analysis Button */}
                    <button
                      onClick={() => handleAnalyzeArticle(article)}
                      disabled={isAnalyzing}
                      className="px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-medium flex items-center gap-1.5 transition-all"
                    >
                      {isAnalyzing ? (
                        <Loader2 size={13} className="animate-spin text-indigo-400" />
                      ) : (
                        <Sparkles size={13} className="text-indigo-400" />
                      )}
                      <span>AI Exam Notes</span>
                    </button>
                  </div>

                  {/* Read Full Article External Link */}
                  {article.url && article.url !== "#" && (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-dark-600 hover:bg-dark-500 border border-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <span>Read Source</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Exam Analysis Drawer/Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in">
          <div className="bg-dark-800 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-dark-700/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">AI Exam Analysis Notes</h3>
                  <p className="text-xs text-white/40 truncate max-w-xs sm:max-w-md">
                    {selectedAnalysis.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setSelectedAnalysis(null); setAnalysisText(""); }}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-white/80 leading-relaxed">
              {!analysisText ? (
                <div className="py-12 text-center space-y-3">
                  <Loader2 size={28} className="animate-spin text-saffron-400 mx-auto" />
                  <p className="text-white/60 font-medium">Generating exam takeaways with AI...</p>
                  <p className="text-xs text-white/30">Analyzing syllabus relevance, prelims facts & mains questions</p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none space-y-3 whitespace-pre-line text-sm">
                  {analysisText}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-dark-700/50 flex justify-end">
              <button
                onClick={() => { setSelectedAnalysis(null); setAnalysisText(""); }}
                className="btn-primary text-xs py-2 px-5"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Currents API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in">
          <div className="bg-dark-800 border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-saffron-500/20 border border-saffron-500/30 flex items-center justify-center text-saffron-400">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Currents API Configuration</h3>
                  <p className="text-xs text-white/40">Manage your news API access key</p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-white/40 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/60 font-medium">API Key</label>
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-saffron-500"
                placeholder="Enter Currents API Key"
              />
              <p className="text-[11px] text-white/40">
                Default API Key is configured. You can update it anytime from here.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                className="btn-primary text-xs py-2 px-5"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
