// ─── Currents API Utility for Daily Current Affairs ─────────────────────────────
import { callAI } from "./api";

const DEFAULT_API_KEY = "tg0OXeZ4WkKshBlQ-98M9kyqHsF_JNPxGOl7CwmpJh4LS6JN";
const BASE_URL = "https://api.currentsapi.services/v1";

export function getCurrentsApiKey() {
  return localStorage.getItem("pm_currents_api_key") || DEFAULT_API_KEY;
}

export function setCurrentsApiKey(key) {
  localStorage.setItem("pm_currents_api_key", key);
}

/**
 * Fetch news from currentsapi.services
 * Uses search endpoint if search query present, else latest-news endpoint
 */
export async function fetchCurrentsNews({ keywords = "", category = "", page = 1, language = "en" } = {}) {
  const apiKey = getCurrentsApiKey();
  
  let endpoint = `${BASE_URL}/latest-news`;
  const params = new URLSearchParams();
  params.append("language", language);
  params.append("page", String(page));
  
  if (keywords.trim()) {
    endpoint = `${BASE_URL}/search`;
    params.append("keywords", keywords.trim());
  }
  
  if (category && category !== "all") {
    params.append("category", category);
  }

  // Also include apiKey as query param for robust fallback
  params.append("apiKey", apiKey);

  const url = `${endpoint}?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    if (res.status === 401 || res.status === 403) {
      throw new Error("Invalid API key or unauthorized access to Currents API.");
    } else if (res.status === 429) {
      throw new Error("Currents API rate limit reached. Please wait a moment and try again.");
    }
    throw new Error(`Currents API error (${res.status}): ${errorText || "Failed to fetch news."}`);
  }

  const data = await res.json();
  
  if (data.status === "error" || data.status === "fail") {
    throw new Error(data.message || "Failed to fetch news from Currents API.");
  }

  const newsList = data.news || [];
  
  // Format items cleanly
  return newsList.map((item) => ({
    id: item.id || Math.random().toString(36).substring(2),
    title: item.title ? item.title.trim() : "Untitled News",
    description: item.description ? item.description.trim() : "No summary available.",
    url: item.url || "#",
    author: item.author && item.author !== "None" ? item.author : null,
    image: item.image && item.image !== "None" && item.image.startsWith("http") ? item.image : null,
    category: Array.isArray(item.category) ? item.category : [item.category].filter(Boolean),
    published: item.published || new Date().toISOString(),
  }));
}

/**
 * Generate AI Exam Analysis for a specific news article
 */
export async function analyzeNewsForExam({ title, description, url, exam = "UPSC / Civil Services" }) {
  const system = `You are a top Indian competitive exam current affairs mentor (UPSC, SSC, Banking).
Your job is to analyze news articles and present key takeaways formatted as exam study notes.
Format your output in clean Markdown with:
### 📌 Key Takeaways for ${exam}
- Point 1
- Point 2
- Point 3

### 🎯 Syllabus Relevance
- Subject/Paper: (e.g. GS Paper 2 - Polity & Governance / GS Paper 3 - Economy)
- Core Topic: ...

### ❓ Sample Prelims Practice Question
**Question:** ...
A) ...
B) ...
C) ...
D) ...
**Correct Answer:** ...
**Explanation:** ...`;

  const msg = `Please analyze this news article for exam preparation:
Title: ${title}
Summary/Content: ${description}
Link: ${url}`;

  return callAI(system, [{ role: "user", content: msg }], { maxTokens: 900 });
}
