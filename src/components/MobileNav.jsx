import React from "react";
import { LayoutDashboard, Brain, Newspaper, MessageCircle, Settings } from "lucide-react";

const NAV = [
  { id: "dashboard",       icon: LayoutDashboard, label: "Home" },
  { id: "quiz",            icon: Brain,           label: "Quiz" },
  { id: "current-affairs", icon: Newspaper,       label: "Affairs" },
  { id: "tutor",           icon: MessageCircle,   label: "Tutor" },
  { id: "settings",        icon: Settings,        label: "Settings" },
];

export default function MobileNav({ activePage, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-dark-800/90 backdrop-blur-xl pb-safe">
      <div className="flex">
        {NAV.map(({ id, icon: Icon, label }) => {
          const active = activePage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all
                ${active ? "text-saffron-400" : "text-white/30 hover:text-white/60"}`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
