/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b", // zinc-950
        foreground: "#fafafa", // zinc-50
        card: "#18181b", // zinc-900
        "card-hover": "#27272a", // zinc-800
        border: "#27272a", // zinc-800
        primary: {
          DEFAULT: "#6366f1", // indigo-500
          hover: "#4f46e5",
          glow: "rgba(99, 102, 241, 0.15)",
        },
        secondary: {
          DEFAULT: "#3b82f6", // blue-500
          hover: "#2563eb",
        },
        success: {
          DEFAULT: "#10b981", // emerald-500
          hover: "#059669",
          glow: "rgba(16, 185, 129, 0.15)",
        },
        danger: {
          DEFAULT: "#f43f5e", // rose-500
          hover: "#e11d48",
          glow: "rgba(244, 63, 94, 0.15)",
        },
        warning: {
          DEFAULT: "#f59e0b", // amber-500
          hover: "#d97706",
          glow: "rgba(245, 158, 11, 0.15)",
        },
        accent: {
          purple: "#a855f7", // purple-500
          cyan: "#06b6d4", // cyan-500
          teal: "#14b8a6", // teal-500
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Courier New", "monospace"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "slide-up": "slide-up 0.4s ease-out forwards",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: 1, filter: "drop-shadow(0 0 15px rgba(99, 102, 241, 0.6))" },
          "50%": { opacity: 0.7, filter: "drop-shadow(0 0 5px rgba(99, 102, 241, 0.2))" }
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        "slide-up": {
          "0%": { transform: "translateY(12px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 }
        }
      }
    },
  },
  plugins: [],
}
