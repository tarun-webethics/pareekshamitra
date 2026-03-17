<<<<<<< HEAD
# pareekshamitra
=======
# 🎯 PareekshaMitra — AI Exam Companion

An AI-powered exam preparation app for Indian competitive exam aspirants — UPSC, SSC CGL, IBPS PO, NEET, JEE, RRB and more. Built with React, Tailwind CSS, and Claude AI.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **Smart Quiz** | AI-generated adaptive MCQs for any exam, subject, topic & difficulty |
| 📰 **Current Affairs** | Daily AI-curated digest with exam relevance tags |
| ✍️ **Answer Writing Coach** | AI scores your answers on UPSC/exam criteria + model answer |
| 💬 **AI Tutor** | Real-time chat tutor that knows Indian exam patterns |
| 📚 **PYQ Solver** | Paste any past year question — AI explains it thoroughly |
| 🏆 **Leaderboard** | Weekly rankings with streak tracking |
| 📊 **Dashboard** | Progress tracking, streaks, daily goals |

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ and npm
- An Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

### 2. Install dependencies

```bash
cd pareekshamitra
npm install
```

### 3. Start development server

```bash
npm start
```

Opens at `http://localhost:3000`

### 4. Set your API key

On first launch, the onboarding wizard will ask for your Anthropic API key.
You can also set/change it in **Settings** at any time.

> ⚠️ **Note:** The API key is stored in browser localStorage. For production, proxy all Claude API calls through a backend server to keep the key secure.

---

## 📁 Project Structure

```
pareekshamitra/
├── public/
│   └── index.html              # HTML entry point (Google Fonts loaded here)
├── src/
│   ├── App.jsx                 # Root: routing, layout, state
│   ├── index.js                # React DOM mount
│   ├── index.css               # Tailwind + global styles + custom components
│   │
│   ├── components/
│   │   ├── Sidebar.jsx         # Desktop sidebar navigation
│   │   ├── MobileNav.jsx       # Mobile bottom navigation
│   │   └── OnboardingModal.jsx # First-launch onboarding wizard
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx       # Home with stats, quick actions
│   │   ├── Quiz.jsx            # AI-generated adaptive MCQ quiz
│   │   ├── CurrentAffairs.jsx  # Daily AI current affairs digest
│   │   ├── AnswerWriting.jsx   # Answer evaluation with streaming AI feedback
│   │   ├── Tutor.jsx           # Real-time AI chat tutor
│   │   ├── PYQSolver.jsx       # Past year question explainer
│   │   ├── Leaderboard.jsx     # Weekly rankings
│   │   └── Settings.jsx        # API key + profile settings
│   │
│   ├── hooks/
│   │   └── useLocalStorage.js  # Persistent state hook
│   │
│   ├── utils/
│   │   └── api.js              # All Claude API calls (quiz, tutor, evaluation, etc.)
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

## 🔑 API Key Security

In the current setup, the Claude API is called directly from the browser. This is fine for personal use and development. For production deployment:

1. Create a backend proxy (Node.js/Express or Next.js API route)
2. Store the API key in server environment variables
3. Route all Claude calls through your backend

---

## 📱 Responsive Design

- **Desktop (≥1024px):** Full sidebar + main content layout
- **Mobile (<1024px):** Top bar + bottom tab navigation

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

The exam will automatically appear in Quiz, Settings, Leaderboard, and all other pages.

---

## 🌐 Deployment

```bash
npm run build
```

Deploy the `build/` folder to Vercel, Netlify, or any static host.

---

Built with ❤️ for India's 20 million+ exam aspirants.
>>>>>>> recovery-branch
