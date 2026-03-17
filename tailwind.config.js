/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        saffron: {
          50:  "#fff8f0",
          100: "#ffecd6",
          200: "#ffd4a8",
          300: "#ffb470",
          400: "#ff8c3a",
          500: "#f97316",
          600: "#ea6a0a",
          700: "#c2540a",
          800: "#9a4410",
          900: "#7c3a10",
        },
        indigo: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        emerald: {
          50:  "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        dark: {
          900: "#0a0a0f",
          800: "#12121a",
          700: "#1a1a26",
          600: "#22222f",
          500: "#2e2e3d",
          400: "#3d3d52",
        }
      },
      backgroundImage: {
        "hero-pattern": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249,115,22,0.15), transparent)",
        "card-glow": "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(99,102,241,0.08), transparent)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-up": "slideUp 0.5s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: { "0%": { opacity: 0, transform: "translateY(20px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};
