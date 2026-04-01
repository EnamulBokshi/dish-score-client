import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Windows 2000 Classic theme
        neon: {
          pink: "#cc0000",
          orange: "#0a246a",
          gold: "#316ac5",
          lime: "#2a6b2a",
          cyan: "#008080",
        },
        // Win2K system chrome
        dark: {
          bg: "#d4d0c8",
          card: "#ece9d8",
          border: "#808080",
        },
        win: {
          silver: "#d4d0c8",
          titlebar: "#0a246a",
          highlight: "#316ac5",
          white: "#ffffff",
        },
      },
      fontSize: {
        display: ["3.5rem", { lineHeight: "1.2", fontWeight: "bold" }],
        h1: ["2.5rem", { lineHeight: "1.2", fontWeight: "bold" }],
        h2: ["2rem", { lineHeight: "1.3", fontWeight: "bold" }],
        h3: ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
        "slide-up": "slideUp 0.5s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { textShadow: "0 0 10px rgba(255, 87, 34, 0.5)" },
          "50%": { textShadow: "0 0 20px rgba(255, 87, 34, 1)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      backgroundImage: {
        "gradient-neon": "linear-gradient(135deg, #FF5722, #FFD700)",
        "gradient-success": "linear-gradient(135deg, #10FF00, #00FFFF)",
        "gradient-dark":
          "linear-gradient(135deg, rgba(26, 26, 31, 0.9), rgba(42, 42, 58, 0.9))",
      },
      boxShadow: {
        "neon-glow": "0 0 20px rgba(255, 87, 34, 0.6)",
        "neon-glow-pink": "0 0 20px rgba(255, 0, 64, 0.6)",
        "neon-glow-gold": "0 0 20px rgba(255, 215, 0, 0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
