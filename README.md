# 🎯 PareekshaMitra — AI Exam Companion

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-success?style=flat&logo=vercel)](https://pareekshamitra.vercel.app/)
[![React](https://img.shields.io/badge/React-18.2-blue?style=flat&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Ollama Powered](https://img.shields.io/badge/Ollama-Local_AI-orange?style=flat&logo=ollama)](https://ollama.com)
[![Claude API](https://img.shields.io/badge/Anthropic-Claude_API-7c3aed?style=flat&logo=anthropic)](https://console.anthropic.com)

**Marketing & Social Website:** [https://pathfinder-pareeksha.lovable.app/](https://pathfinder-pareeksha.lovable.app/)  
**Live Web Application:** [https://pareekshamitra.vercel.app/](https://pareekshamitra.vercel.app/)

---

## 📌 Overview

**PareekshaMitra** is a state-of-the-art AI-powered exam preparation platform tailored specifically for Indian competitive exam aspirants — **UPSC CSE, SSC CGL, IBPS PO, NEET UG, JEE Mains, RRB NTPC**, and State PSCs.

Built with React, Tailwind CSS, and a flexible dual AI backend engine, PareekshaMitra allows students to run **100% offline, free, and private local AI models** via **Ollama** (`llama3.2`, `mistral`, `qwen2.5`, `gemma4`, etc.) or connect directly to cloud-based **Anthropic Claude API**.

---

## ✨ Features & Capabilities

| Feature | Description |
|---|---|
| 🦙 **Dual AI Backend Support** | Seamlessly toggle between offline **Local Ollama AI** or cloud-based **Claude API**. Includes automated local model detection & live endpoint testing. |
| 🧠 **Smart Adaptive Quiz** | Generates tailored MCQs by exam, subject, topic, and difficulty (`Easy`, `Medium`, `Hard`). Features response normalization (`A/B/C/D`) and step-by-step AI explanations. |
| 📰 **Current Affairs Digest** | Daily AI-curated news digest categorized by exam relevance tags, importance ratings (1-5), and subject filters. |
| ✍️ **Mains Answer Writing Coach** | Evaluates long descriptive answers against official grading benchmarks. Streams real-time AI feedback with scores out of 10, strengths, gaps, model answers, and tips. |
| 💬 **Interactive AI Tutor** | Dual-language (English / Hinglish) exam tutor that understands specific exam patterns, providing concept clarity and pointing to free resources (NCERT, PIB, PRS India). |
| 📚 **PYQ Solver & Explainer** | Paste any Past Year Question to receive comprehensive concept breakdowns, key formulas, and step-by-step explanations. |
| 🏆 **Leaderboard & Rank Sharing** | Tracks weekly points, accuracy, and daily study streaks. Features an **HTML5 Canvas Rank Card Generator** for Instagram Stories (9:16) & Posts (1:1). |
| 📊 **Personalized Dashboard** | Monitors daily question goals, study streak calculations, active target exam parameters, and quick practice triggers. |
| ⚙️ **Guided Onboarding & Config** | 4-step first-launch wizard for candidate profile setup, target exam selection, AI provider testing, and daily goal target setting. |

---

## 🚀 Quick Start & Installation

### Prerequisites

- **Node.js 18.0+** and **npm** installed.
- *(Optional for Local AI)* [Ollama](https://ollama.com) installed on your system.

---

### Option A: Local AI Setup with Ollama (Offline & Free)

#### 1. Install & Pull an AI Model
Install Ollama from [ollama.com](https://ollama.com), then open your terminal and pull a lightweight, high-performance model:

```bash
# Pull default recommended model
ollama pull llama3.2:3b

# Alternatively, pull any other model
ollama pull llama3.2
ollama pull mistral
ollama pull qwen2.5
```

#### 2. Start Ollama with CORS Enabled
Because PareekshaMitra runs in the browser, Ollama must allow cross-origin requests. Start the server with `OLLAMA_ORIGINS="*"`:

- **Linux / macOS:**
  ```bash
  OLLAMA_ORIGINS="*" ollama serve
  ```
- **Windows (Command Prompt):**
  ```cmd
  set OLLAMA_ORIGINS=*
  ollama serve
  ```
- **Windows (PowerShell):**
  ```powershell
  $env:OLLAMA_ORIGINS="*"
  ollama serve
  ```

#### 3. Clone, Install & Launch PareekshaMitra

```bash
# Navigate to project directory
cd pareekshamitra

# Install dependencies
npm install

# Start development server
npm start
```

The application will automatically open at `http://localhost:3000`.

---

### Option B: Cloud AI Setup with Anthropic Claude API

1. Obtain an API key from the [Anthropic Console](https://console.anthropic.com).
2. Launch PareekshaMitra (`npm start`).
3. In the **Onboarding Wizard** or under **Settings**, select **Claude API (Cloud)**.
4. Paste your API key (`sk-ant-api03-...`). Your key is stored securely in your browser's local storage and is never sent to external third-party servers.

---

## ⚙️ AI Engine Working Flow

```
                     ┌─────────────────────────────────────────┐
                     │         PareekshaMitra Frontend         │
                     └────────────────────┬────────────────────┘
                                          │
                                ┌─────────┴─────────┐
                                │   callAI Utility  │
                                └─────────┬─────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     ┌─────────────────────────┐                     ┌─────────────────────────┐
     │  Local Ollama Engine    │                     │   Anthropic Claude API  │
     │  http://localhost:11434 │                     │  https://api.anthropic  │
     └────────────┬────────────┘                     └────────────┬────────────┘
                  │                                               │
                  └───────────────────────┬───────────────────────┘
                                          │
                                          ▼
                     ┌─────────────────────────────────────────┐
                     │    Robust JSON Extractor & Parser       │
                     ├─────────────────────────────────────────┤
                     │ - Extracts JSON arrays/objects from LLMs│
                     │ - Normalizes MCQ options & answers      │
                     │ - Handles streaming NDJSON response     │
                     └─────────────────────────────────────────┘
```

1. **Master Dispatcher (`callAI`)**: Automatically routes user requests to either the local Ollama endpoint (`/api/chat`) or Anthropic's Claude API endpoint (`/v1/messages`) based on user preferences in `localStorage`.
2. **Model Auto-Detection & Health Check**: The app queries `/api/tags` to list installed Ollama models automatically, allowing seamless model selection and auto-selecting available local models if the default is missing.
3. **Response Normalization**: Raw LLM output from smaller local models can vary. PareekshaMitra utilizes `normalizeQuestion()` and `extractJSON()` utilities to clean option prefixes, format correct answer keys (`A`, `B`, `C`, `D`), and recover structured JSON output safely.
4. **Streaming Response Handler**: Long-form responses like Mains Answer Evaluations are streamed live to the UI using NDJSON reader buffers for zero-latency user feedback.

---

## 📁 Project Structure

```
pareekshamitra/
├── public/
│   └── index.html              # HTML5 entry point & font loading
├── src/
│   ├── App.jsx                 # Root application component, state & routing
│   ├── index.js                # React DOM renderer
│   ├── index.css               # Design system, custom utility classes & animations
│   │
│   ├── components/
│   │   ├── Sidebar.jsx         # Desktop navigation sidebar with exam badge
│   │   ├── MobileNav.jsx       # Mobile bottom navigation bar
│   │   ├── OnboardingModal.jsx # First-launch wizard (Name, Target Exam, AI Setup)
│   │   └── ShareRankModal.jsx  # Canvas rank card generator (Instagram 9:16 & 1:1)
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx       # Overview, streak counter, quick practice triggers
│   │   ├── Quiz.jsx            # Dynamic MCQ generator, interactive quiz & review
│   │   ├── CurrentAffairs.jsx  # Daily AI current affairs digest with tags & search
│   │   ├── AnswerWriting.jsx   # Mains answer evaluator with streaming feedback
│   │   ├── Tutor.jsx           # Real-time AI chat tutor tailored to exam pattern
│   │   ├── PYQSolver.jsx       # Past Year Question explainer & breakdown
│   │   ├── Leaderboard.jsx     # Weekly ranking leaderboard & streak showcase
│   │   └── Settings.jsx        # AI provider switcher, Ollama connection tester & profile
│   │
│   ├── hooks/
│   │   └── useLocalStorage.js  # Persistent browser local state hook
│   │
│   ├── utils/
│   │   └── api.js              # AI dispatcher, Ollama/Claude callers & JSON normalizer
│   │
│   └── data/
│       └── exams.js            # Supported exam definitions, subjects & color schemes
│
├── tailwind.config.js          # Tailored color palette (Saffron, Dark), typography & animations
├── postcss.config.js           # PostCSS configuration
└── package.json                # Project dependencies & scripts
```

---

## 🧩 Supported Exams & Adding Custom Exams

PareekshaMitra comes pre-configured with top Indian competitive exams:
- 🏛️ **UPSC CSE** (Union Public Service Commission)
- 📋 **SSC CGL** (Staff Selection Commission)
- 🏦 **IBPS PO** (Institute of Banking Personnel Selection)
- ⚕️ **NEET UG** (National Eligibility cum Entrance Test)
- ⚙️ **JEE Mains** (Joint Entrance Examination)
- 🚂 **RRB NTPC** (Railway Recruitment Board)

### Adding a New Exam
To add a new exam, open `src/data/exams.js` and insert a new object into the `EXAMS` array:

```javascript
{
  id: "cat",
  name: "CAT",
  fullName: "Common Admission Test",
  icon: "📈",
  color: "pink",
  subjects: ["Verbal Ability", "Data Interpretation", "Logical Reasoning"],
  level: "National",
}
```

---

## 🎨 Design System & Styling Tokens

| Token | Hex / Value | Usage |
|---|---|---|
| `saffron-500` | `#f97316` | Primary brand accent, action buttons, highlight badges |
| `indigo-500` | `#6366f1` | Secondary accent, informative elements |
| `dark-900` | `#0a0a0f` | Main application dark background |
| `dark-800` / `dark-700` | `#12121a` / `#1a1a26` | Card backgrounds & modal surfaces |
| **Display Font** | `Playfair Display` | Elegant headings & banner titles |
| **Body Font** | `DM Sans` | Clean UI body copy & navigation text |
| **Monospace Font** | `JetBrains Mono` | Code blocks, rank numbers, stats, and scores |

---

## 🌐 Production Build & Deployment

To generate an optimized production bundle:

```bash
npm run build
```

The compiled assets will be placed in the `build/` directory. You can deploy this folder directly to any static web hosting platform:

- **Vercel**: Import repository and deploy automatically with default React settings.
- **Netlify**: Set build command to `npm run build` and publish directory to `build`.
- **GitHub Pages / Cloudflare Pages**: Deploy static `build` output.

---

<p center align="center">
  Built with ❤️ for India's 20 Million+ Competitive Exam Aspirants.
</p>

