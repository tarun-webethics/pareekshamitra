// ─── AI API Utility (Ollama Local & Claude API) ───────────────────────────────

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const CLAUDE_MODEL = "claude-sonnet-4-20250514";

// ─── Local Storage Configuration Getters & Setters ───────────────────────────

export function getAiProvider() {
  return localStorage.getItem("pm_ai_provider") || "ollama";
}

export function setAiProvider(provider) {
  localStorage.setItem("pm_ai_provider", provider);
}

export function getOllamaUrl() {
  return localStorage.getItem("pm_ollama_url") || "http://localhost:11434";
}

export function setOllamaUrl(url) {
  localStorage.setItem("pm_ollama_url", url);
}

export function getOllamaModel() {
  return localStorage.getItem("pm_ollama_model") || "llama3.2";
}

export function setOllamaModel(model) {
  localStorage.setItem("pm_ollama_model", model);
}

export function getApiKey() {
  return localStorage.getItem("pm_api_key") || "";
}

export function setApiKey(key) {
  localStorage.setItem("pm_api_key", key);
}

/**
 * Pings Ollama server to check connection and fetch available models.
 */
export async function testOllamaConnection(customUrl) {
  const baseUrl = (customUrl || getOllamaUrl()).replace(/\/+$/, "");
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(`${baseUrl}/api/tags`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return { ok: false, models: [], error: `Ollama returned HTTP status ${res.status}` };
    }
    const data = await res.json();
    const models = data.models?.map((m) => m.name) || [];

    if (models.length === 0) {
      return {
        ok: false,
        isNoModels: true,
        models: [],
        error: "Ollama is running, but NO models are installed yet. Run 'ollama pull llama3.2' in terminal.",
      };
    }

    return { ok: true, models };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      return { ok: false, models: [], error: "Connection timed out. Ensure Ollama is running." };
    }
    return {
      ok: false,
      models: [],
      error: "Could not connect to Ollama. Check URL & ensure CORS (OLLAMA_ORIGINS=\"*\") is enabled.",
    };
  }
}

/**
 * Call Ollama API (/api/chat)
 */
export async function callOllama(systemPrompt, messages, opts = {}) {
  const { onChunk } = opts;
  const baseUrl = getOllamaUrl().replace(/\/+$/, "");
  const model = getOllamaModel();

  const formattedMessages = [];
  if (systemPrompt) {
    formattedMessages.push({ role: "system", content: systemPrompt });
  }
  formattedMessages.push(...messages);

  const body = {
    model,
    messages: formattedMessages,
    stream: !!onChunk,
  };

  let res;
  try {
    res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (fetchErr) {
    throw new Error(
      `Failed to connect to Ollama at ${baseUrl}. Ensure Ollama is running and OLLAMA_ORIGINS="*" is configured.`
    );
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    let msg = err?.error || `Ollama API error ${res.status}`;

    if (msg.includes("not found")) {
      try {
        const tagsRes = await fetch(`${baseUrl}/api/tags`);
        const tagsData = await tagsRes.json();
        const available = tagsData.models?.map((m) => m.name) || [];
        if (available.length === 0) {
          msg = `NO models installed in Ollama! Open terminal and run: 'ollama pull llama3.2'`;
        } else {
          msg = `Model '${model}' is not installed in Ollama. Installed model(s): [${available.join(", ")}]. Select one of these in Settings!`;
        }
      } catch {
        msg = `Model '${model}' not found in Ollama. Run 'ollama pull ${model}' in your terminal.`;
      }
    }
    throw new Error(msg);
  }

  // ── Streaming path (NDJSON) ──
  if (onChunk) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          if (parsed.message?.content) {
            fullText += parsed.message.content;
            onChunk(parsed.message.content, fullText);
          }
        } catch {}
      }
    }
    if (buffer.trim()) {
      try {
        const parsed = JSON.parse(buffer);
        if (parsed.message?.content) {
          fullText += parsed.message.content;
          onChunk(parsed.message.content, fullText);
        }
      } catch {}
    }
    return fullText;
  }

  // ── Non-streaming path ──
  const data = await res.json();
  return data.message?.content || "";
}

/**
 * Call Anthropic Claude API
 */
export async function callClaude(systemPrompt, messages, opts = {}) {
  const { maxTokens = 1500, onChunk } = opts;
  const apiKey = getApiKey();

  if (!apiKey) throw new Error("No Claude API key configured. Please enter your API key in Settings, or switch AI Provider to Ollama.");

  const body = {
    model: CLAUDE_MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
    stream: !!onChunk,
  };

  const res = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }

  // ── Streaming path ──
  if (onChunk) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "content_block_delta" && parsed.delta?.text) {
            fullText += parsed.delta.text;
            onChunk(parsed.delta.text, fullText);
          }
        } catch {}
      }
    }
    return fullText;
  }

  // ── Non-streaming path ──
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

/**
 * Master Dispatcher
 */
export async function callAI(systemPrompt, messages, opts = {}) {
  const provider = getAiProvider();
  if (provider === "ollama") {
    return callOllama(systemPrompt, messages, opts);
  }
  return callClaude(systemPrompt, messages, opts);
}

/**
 * Helper to extract JSON objects/arrays from LLM response safely
 */
function extractJSON(text) {
  if (!text) throw new Error("Empty response from AI");
  const cleaned = text.replace(/```json|```/gi, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {}

  const arrayMatch = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]);
    } catch {}
  }

  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try {
      return JSON.parse(objMatch[0]);
    } catch {}
  }

  throw new Error("Failed to parse JSON structure from AI output.");
}

/**
 * Normalizes question JSON returned from LLMs into a standardized format.
 * Ensures options are clean strings and `correct` is strictly "A", "B", "C", or "D".
 */
export function normalizeQuestion(q, index = 0) {
  const labels = ["A", "B", "C", "D"];

  let rawOptions = Array.isArray(q?.options) ? q.options : [];
  let options = rawOptions.map(opt => {
    let s = String(opt || "").trim();
    return s.replace(/^[A-Da-d][.):\s]\s*/, "").trim();
  });

  while (options.length < 4) {
    options.push(`Option ${labels[options.length]}`);
  }
  options = options.slice(0, 4);

  let correctLabel = "A";
  const rawCorrect = String(q?.correct ?? "").trim();

  if (rawCorrect) {
    const uppercaseCorrect = rawCorrect.toUpperCase();

    if (labels.includes(uppercaseCorrect)) {
      correctLabel = uppercaseCorrect;
    } else if (/^[0-3]$/.test(rawCorrect)) {
      correctLabel = labels[parseInt(rawCorrect, 10)];
    } else if (/^[1-4]$/.test(rawCorrect)) {
      correctLabel = labels[parseInt(rawCorrect, 10) - 1];
    } else {
      const prefixMatch = rawCorrect.match(/^(?:OPTION\s*|ANS:\s*|ANSWER:\s*)?([A-D])[.):\s]/i);
      if (prefixMatch && prefixMatch[1]) {
        correctLabel = prefixMatch[1].toUpperCase();
      } else {
        const norm = (str) => String(str).toLowerCase().replace(/[^a-z0-9]/g, "");
        const targetNorm = norm(rawCorrect);

        let foundIdx = options.findIndex(opt => norm(opt) === targetNorm);

        if (foundIdx === -1 && targetNorm.length > 0) {
          foundIdx = options.findIndex(opt => {
            const optNorm = norm(opt);
            return (optNorm.length > 0 && targetNorm.includes(optNorm)) || (targetNorm.length > 0 && optNorm.includes(targetNorm));
          });
        }

        if (foundIdx !== -1) {
          correctLabel = labels[foundIdx];
        } else {
          const firstChar = uppercaseCorrect.charAt(0);
          if (labels.includes(firstChar)) {
            correctLabel = firstChar;
          }
        }
      }
    }
  }

  return {
    id: q?.id || index + 1,
    question: q?.question || "Question",
    options,
    correct: correctLabel,
    explanation: q?.explanation || "",
    difficulty: q?.difficulty || "Medium",
  };
}

// ─── Specialised Application Helpers ─────────────────────────────────────────

export async function generateQuiz({ exam, subject, topic, difficulty, count = 5 }) {
  const system = `You are an expert Indian competitive exam question setter. 
Generate exactly ${count} MCQ questions in strict JSON format.
Always respond with ONLY a JSON array — no preamble, no markdown, no explanation outside JSON.
Each item: { "id": number, "question": string, "options": [string, string, string, string], "correct": "A"|"B"|"C"|"D", "explanation": string, "difficulty": "Easy"|"Medium"|"Hard" }`;

  const userMsg = `Generate ${count} ${difficulty || "Mixed"} difficulty MCQ questions for ${exam} exam.
Subject: ${subject}. Topic: ${topic || "General"}.
Focus on conceptual accuracy. Explanations must be detailed (3-4 lines). Make sure "correct" is strictly one of "A", "B", "C", or "D".`;

  const raw = await callAI(system, [{ role: "user", content: userMsg }], { maxTokens: 2500 });
  try {
    const parsed = extractJSON(raw);
    const questions = Array.isArray(parsed) ? parsed : (parsed.questions || parsed.data || []);
    return questions.map((q, idx) => normalizeQuestion(q, idx));
  } catch (e) {
    throw new Error(e.message || "Failed to parse quiz response. Please try again.");
  }
}

export async function explainAnswer({ question, correct, userAnswer, explanation }) {
  const system = `You are a patient, encouraging Indian exam tutor. Explain in clear, simple language.
Use analogies. Keep responses under 200 words. Be warm and motivating.`;
  const msg = `Question: ${question}
Correct answer: ${correct}
Student chose: ${userAnswer}
Standard explanation: ${explanation}

Explain WHY the correct answer is right in simple terms. If student was wrong, gently explain their mistake.`;

  return callAI(system, [{ role: "user", content: msg }], { maxTokens: 400 });
}

export async function generateCurrentAffairs({ date, topics }) {
  const system = `You are a current affairs analyst focused on Indian competitive exams (UPSC/SSC/Banking).
Format: Return JSON array of news items. No markdown fences or intro text.
Each item: { "title": string, "summary": string (2-3 sentences), "examRelevance": string, "tags": string[], "importanceScore": 1-5 }`;

  const msg = `Generate 8 important current affairs items relevant for ${topics?.join(", ") || "UPSC, SSC, Banking"} exam preparation.
Focus on: Government schemes, economy, international relations, science & tech, environment, awards.
Make them specific, factual, and exam-focused.`;

  const raw = await callAI(system, [{ role: "user", content: msg }], { maxTokens: 2000 });
  try {
    return extractJSON(raw);
  } catch (e) {
    throw new Error(e.message || "Failed to parse current affairs. Please try again.");
  }
}

export async function evaluateAnswer({ question, userAnswer, exam, onChunk }) {
  const system = `You are a strict but fair UPSC/competitive exam evaluator. 
Evaluate answers concisely. Give actionable feedback. Use this structure:
**Score: X/10**
**Strengths:** ...
**Gaps:** ...
**Model Answer Points:** ...
**Tip:** ...`;

  const msg = `Exam: ${exam}
Question: ${question}
Student's Answer: ${userAnswer}

Evaluate this answer strictly. Score out of 10. Be specific about what's missing.`;

  return callAI(system, [{ role: "user", content: msg }], { maxTokens: 600, onChunk });
}

export async function chatWithTutor({ messages, exam, subject }) {
  const system = `You are PareekshaMitra, a friendly AI tutor for Indian competitive exams.
You specialise in ${exam || "all Indian exams"} — UPSC, SSC CGL, IBPS PO, NEET, JEE, State PSC.
- Answer in simple, clear language (mix Hindi terms naturally when helpful)
- Give examples from Indian context
- Keep answers focused and exam-relevant
- Be encouraging and motivating
- If asked for resources, suggest free ones (NCERT, PRS India, PIB, etc.)`;

  return callAI(system, messages, { maxTokens: 800 });
}
