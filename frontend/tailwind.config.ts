import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xxl: "1436px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bg: "#ffffff",
        bgs: "#D9D9D9",
        bgt: "#F5F5F5",
        bgq: "#B8B8B8",
        card: "#D9D9D9",
        fade: "#9F9F9F",
        fades: "#B8B8B8",
        mo: "#E52F06",
        mb: "#13265C",
        mg: "#015724",
        bl: "#1f2939",
        mp: "#E52F06",
        shopp: "#FFD5CC",
        shops: "#BBB5FF",
        shopt: "#D6D6D6",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite", // Existing animation
        "fade-in-up": "fade-in-up 0.6s ease-out forwards", // New animation
        float: "float 3s ease-in-out infinite", // New animation
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      fontFamily: {
        poetsen: ["var(--font-poetsen-one)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
