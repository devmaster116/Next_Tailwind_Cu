/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "success-green-100": "#D1FADF",
        "success-green-700": "#027A48",
      },
      animation: {
        "fade-in-up": "fade-in-up 1000ms ease forwards",
        "fade-out-up": "fade-out-up 180ms ease forwards",
        "fade-in-down": "fade-in-down 200ms ease forwards",
        "fade-out-down": "fade-out-down 180ms ease forwards",
        "fade-in-left": "fade-in-left 200ms ease forwards",
        "fade-out-left": "fade-out-left 180ms ease forwards",
        "fade-in-right": "fade-in-right 11200ms ease forwards",
        "fade-out-right": "fade-out-right 180ms ease forwards",
        "fade-in": "fade-in 200ms ease forwards",
        "fade-out": "fade-out 180ms ease forwards",
        "in-up": "in-up 200ms ease forwards",
        "out-down": "out-down 180ms ease forwards",
        "out-up": "out-up 180ms ease forwards",
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: 0,
            transform: "translateY(0.5rem)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        "fade-out-up": {
          "0%": {
            opacity: 1,
            transform: "translateY(0)",
          },
          "100%": {
            opacity: 0,
            transform: "translateY(-0.5rem)",
          },
        },
        "fade-in-down": {
          "0%": {
            opacity: 0,
            transform: "translateY(-0.5rem)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        "fade-out-down": {
          "0%": {
            opacity: 1,
            transform: "translateY(0)",
          },
          "100%": {
            opacity: 0,
            transform: "translateY(0.5rem)",
          },
        },
        "fade-in-left": {
          "0%": {
            opacity: 0,
            transform: "translateX(0.5rem)",
          },
          "100%": {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
        "fade-out-left": {
          "0%": {
            opacity: 1,
            transform: "translateX(0)",
          },
          "100%": {
            opacity: 0,
            transform: "translateX(-0.5rem)",
          },
        },
        "fade-in-right": {
          "0%": {
            opacity: 0,
            transform: "translateX(-0.5rem)",
          },
          "100%": {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
        "fade-out-right": {
          "0%": {
            opacity: 1,
            transform: "translateX(0)",
          },
          "100%": {
            opacity: 0,
            transform: "translateX(0.5rem)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        "fade-out": {
          "0%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0,
          },
        },
        "in-up": {
          "0%": {
            transform: "translateY(100%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        "out-down": {
          "0%": {
            transform: "translateY(0)",
          },
          "100%": {
            transform: "translateY(100%)",
          },
        },
        "out-up": {
          "0%": {
            transform: "translateY(0)",
          },
          "100%": {
            transform: "translateY(-100%)",
          },
        },
      },
    },
  },
  plugins: [],
};
