import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
        mg: "#004813",
        bl: "#333333",
        mp: "#E52F06",
        shopp: "#FFD5CC",
        shops: "#BBB5FF",
        shopt: "#D6D6D6",
      },
      fontFamily: {
        poetsen: ["var(--font-poetsen-one)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
