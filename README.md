# 🎯 PareekshaMitra — Local AI Exam Companion

An AI-powered exam preparation app for Indian competitive exam aspirants — UPSC, SSC CGL, IBPS PO, NEET, JEE, RRB and more. Built with React, Tailwind CSS, local **Ollama** AI models (`llama3.2`, `mistral`, `qwen2.5`, etc.), and optional Anthropic Claude API support.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🦙 **Local AI Powered** | Runs completely offline with local Ollama models or Claude API |
| 🧠 **Smart Quiz** | AI-generated adaptive MCQs for any exam, subject, topic & difficulty |
| 📰 **Current Affairs** | Daily AI-curated digest with exam relevance tags |
| ✍️ **Answer Writing Coach** | AI scores your answers on UPSC/exam criteria + model answer |
| 💬 **AI Tutor** | Real-time chat tutor that knows Indian exam patterns |
| 📚 **PYQ Solver** | Paste any past year question — AI explains it thoroughly |
| 🏆 **Leaderboard** | Weekly rankings with streak tracking |
| 📊 **Dashboard** | Progress tracking, streaks, daily goals |

---

## 🚀 Quick Start with Ollama (Local AI)

### 1. Prerequisites
- Node.js 18+ and npm
- [Ollama](https://ollama.com) installed on your system

### 2. Pull a local AI model & start Ollama with CORS
```bash
# Pull model (e.g. llama3.2, mistral, qwen2.5, or gemma2)
ollama pull llama3.2

# Start Ollama with CORS enabled (required for browser access)
OLLAMA_ORIGINS="*" ollama serve
```

### 3. Install dependencies & start PareekshaMitra

```bash
cd pareekshamitra
npm install
npm start
```

Opens at `http://localhost:3000`

### 4. Configure AI Engine

On first launch, select **Local Ollama** (default: `http://localhost:11434` with model `llama3.2`). Click **Test Connection** to verify. You can also switch to **Claude API** or change Ollama models anytime in **Settings**.

---

## 📁 Project Structure

```
pareekshamitra/
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── App.jsx                 # Root: routing, layout, state
│   ├── index.js                # React DOM mount
│   ├── index.css               # Tailwind + global styles + custom components
│   │
│   ├── components/
│   │   ├── Sidebar.jsx         # Desktop sidebar navigation
│   │   ├── MobileNav.jsx       # Mobile bottom navigation
│   │   └── OnboardingModal.jsx # First-launch onboarding wizard (Ollama/Claude selector)
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx       # Home with stats, quick actions
│   │   ├── Quiz.jsx            # AI-generated adaptive MCQ quiz
│   │   ├── CurrentAffairs.jsx  # Daily AI current affairs digest
│   │   ├── AnswerWriting.jsx   # Answer evaluation with streaming AI feedback
│   │   ├── Tutor.jsx           # Real-time AI chat tutor
│   │   ├── PYQSolver.jsx       # Past year question explainer
│   │   ├── Leaderboard.jsx     # Weekly rankings
│   │   └── Settings.jsx        # AI provider config (Ollama URL/Model, Claude Key)
│   │
│   ├── hooks/
│   │   └── useLocalStorage.js  # Persistent state hook
│   │
│   ├── utils/
│   │   └── api.js              # Ollama (/api/chat) & Claude API callers + JSON parser
│   │
│   └── data/
│       └── exams.js            # Exam list, subjects, color config
│
├── tailwind.config.js          # Custom colors (saffron, dark), fonts, animations
├── postcss.config.js
└── package.json
```

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `saffron-500` | `#f97316` | Primary accent, CTAs |
| `indigo-500` | `#6366f1` | Secondary, info |
| `dark-900` | `#0a0a0f` | Page background |
| `dark-700` | `#1a1a26` | Card backgrounds |
| Font Display | Playfair Display | Headings |
| Font Body | DM Sans | All body text |
| Font Mono | JetBrains Mono | Numbers, code, stats |

---

## 🧩 Adding New Exams

Edit `src/data/exams.js` and add a new entry to the `EXAMS` array:

```js
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

## 🌐 Deployment

```bash
npm run build
```

Deploy the `build/` folder to Vercel, Netlify, or any static host.

---

Built with ❤️ for India's 20 million+ exam aspirants.
