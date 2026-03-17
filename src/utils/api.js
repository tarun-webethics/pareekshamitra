


// ─── Claude API Utility ───────────────────────────────────────────────────────
// All calls to Anthropic's API live here. The user's API key is stored in
// localStorage under "pm_api_key". In production, move this to a backend proxy.

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

export function getApiKey() {
  return localStorage.getItem("pm_api_key") || "";
}

export function setApiKey(key) {
  localStorage.setItem("pm_api_key", key);
}

/**
 * Core fetch wrapper — streams or returns full message.
 * @param {string} systemPrompt
 * @param {Array}  messages  [{role, content}]
 * @param {object} opts       { maxTokens, onChunk }
 */
export async function callClaude(systemPrompt, messages, opts = {}) {
  const { maxTokens = 1500, onChunk } = opts;
  const apiKey = getApiKey();

  if (!apiKey) throw new Error("NO_API_KEY");

  const body = {
    model: MODEL,
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
      buffer = lines.pop();

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

// ─── Specialised helpers ──────────────────────────────────────────────────────

export async function generateQuiz({ exam, subject, topic, difficulty, count = 5 }) {
  const system = `You are an expert Indian competitive exam question setter. 
Generate exactly ${count} MCQ questions in strict JSON format.
Always respond with ONLY a JSON array — no markdown, no explanation.
Each item: { "id": number, "question": string, "options": [A,B,C,D], "correct": "A"|"B"|"C"|"D", "explanation": string, "difficulty": "Easy"|"Medium"|"Hard" }`;

  const userMsg = `Generate ${count} ${difficulty || "Mixed"} difficulty MCQ questions for ${exam} exam.
Subject: ${subject}. Topic: ${topic || "General"}.
Focus on conceptual accuracy. Explanations must be detailed (3-4 lines).`;

  const raw = await callClaude(system, [{ role: "user", content: userMsg }], { maxTokens: 2500 });
  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    throw new Error("Failed to parse quiz response. Please try again.");
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

  return callClaude(system, [{ role: "user", content: msg }], { maxTokens: 400 });
}

export async function generateCurrentAffairs({ date, topics }) {
  const system = `You are a current affairs analyst focused on Indian competitive exams (UPSC/SSC/Banking).
Format: Return JSON array of news items. No markdown fences.
Each item: { "title": string, "summary": string (2-3 sentences), "examRelevance": string, "tags": string[], "importanceScore": 1-5 }`;

  const msg = `Generate 8 important current affairs items relevant for ${topics?.join(", ") || "UPSC, SSC, Banking"} exam preparation.
Focus on: Government schemes, economy, international relations, science & tech, environment, awards.
Make them specific, factual, and exam-focused.`;

  const raw = await callClaude(system, [{ role: "user", content: msg }], { maxTokens: 2000 });
  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    throw new Error("Failed to parse current affairs. Please try again.");
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

  return callClaude(system, [{ role: "user", content: msg }], { maxTokens: 600, onChunk });
}

export async function chatWithTutor({ messages, exam, subject }) {
  const system = `You are PareekshaMitra, a friendly AI tutor for Indian competitive exams.
You specialise in ${exam || "all Indian exams"} — UPSC, SSC CGL, IBPS PO, NEET, JEE, State PSC.
- Answer in simple, clear language (mix Hindi terms naturally when helpful)
- Give examples from Indian context
- Keep answers focused and exam-relevant
- Be encouraging and motivating
- If asked for resources, suggest free ones (NCERT, PRS India, PIB, etc.)`;

  return callClaude(system, messages, { maxTokens: 800 });
}
