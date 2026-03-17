export const EXAMS = [
  {
    id: "upsc",
    name: "UPSC CSE",
    fullName: "Union Public Service Commission",
    icon: "🏛️",
    color: "indigo",
    subjects: ["History", "Geography", "Polity", "Economy", "Environment", "Science & Tech", "Current Affairs", "Ethics"],
    level: "National",
  },
  {
    id: "ssc",
    name: "SSC CGL",
    fullName: "Staff Selection Commission",
    icon: "📋",
    color: "saffron",
    subjects: ["Reasoning", "Quantitative Aptitude", "English", "General Awareness"],
    level: "National",
  },
  {
    id: "ibps",
    name: "IBPS PO",
    fullName: "Institute of Banking Personnel Selection",
    icon: "🏦",
    color: "emerald",
    subjects: ["Reasoning", "Quantitative Aptitude", "English", "Banking Awareness", "Computer"],
    level: "National",
  },
  {
    id: "neet",
    name: "NEET UG",
    fullName: "National Eligibility cum Entrance Test",
    icon: "⚕️",
    color: "pink",
    subjects: ["Physics", "Chemistry", "Biology (Botany)", "Biology (Zoology)"],
    level: "National",
  },
  {
    id: "jee",
    name: "JEE Mains",
    fullName: "Joint Entrance Examination",
    icon: "⚙️",
    color: "purple",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    level: "National",
  },
  {
    id: "rrb",
    name: "RRB NTPC",
    fullName: "Railway Recruitment Board",
    icon: "🚂",
    color: "amber",
    subjects: ["Mathematics", "General Intelligence", "General Awareness", "English"],
    level: "National",
  },
];

export const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard", "Mixed"];

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "ta", name: "தமிழ்" },
  { code: "te", name: "తెలుగు" },
  { code: "bn", name: "বাংলা" },
  { code: "mr", name: "मराठी" },
];

export const EXAM_COLORS = {
  indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400", dot: "bg-indigo-400" },
  saffron: { bg: "bg-saffron-500/10", border: "border-saffron-500/20", text: "text-saffron-400", dot: "bg-saffron-400" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-400" },
  pink: { bg: "bg-pink-500/10", border: "border-pink-500/20", text: "text-pink-400", dot: "bg-pink-400" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", dot: "bg-purple-400" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", dot: "bg-amber-400" },
};
