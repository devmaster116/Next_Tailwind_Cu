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
      screens: {
        "min-sm": { min: "599px" },
        "max-sm": { max: "599px" },
        "min-md": { min: "600px" },
        "max-md": { max: "600px" },
        "min-lg": { min: "961px" },
        "max-lg": { max: "961px" },
      },
      width: {
        "2/9": "22.2222%", // 2 divided by 9 as a percentage
        "1/9": "11.1111%", // Custom width for 1/9
      },
      maxWidth: {
        "553px": "553px", // Define a custom max-width of 553px
      },
      colors: {
        "success-green-100": "#D1FADF",
        "success-green-700": "#027A48",
        "primary-purple-50": "#f9f5ff",
        "primary-purple-600": "#8600ff",
        "primary-purple-700": "#6c01cc",
        "gray-25": "#fcfcfd",
        "gray-50": "#f9fafb",
        "gray-100": "#f2f4f7",
        "gray-200": "#eaecf0",
        "gray-300": "#d0d5dd",
        "gray-500": "#667085",
        "gray-600": "#475467",
        "gray-700": "#344054",
        "gray-800": "#3f3f3f",
        "gray-900": "#353435",
        "error-50": "#fef3f2",
        "error-300": "#fda29b",
        "error-500": "#f04438",
        "error-700": "#b42318",
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
