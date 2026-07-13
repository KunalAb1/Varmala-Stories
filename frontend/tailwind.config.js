/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1A1816",      // near-black, primary dark surface
        paper: "#F7F3EC",    // warm ivory, primary light surface
        amber: "#B8804F",    // golden-hour accent
        sage: "#6B7860",     // muted natural green, secondary
        blush: "#D9B8A8",    // soft highlight
        line: "#DDD6C9",     // hairline dividers on paper
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
    },
  },
  plugins: [],
};
