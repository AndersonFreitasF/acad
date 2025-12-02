/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        neo: {
          yellow: "#FFDE59",
          blue: "#5471FF",
          purple: "#8C52FF",
          pink: "#FF66C4",
          green: "#7ED957",
          orange: "#FF914D",
          red: "#FF5757",
          cyan: "#38BDF8",
          dark: "#0D0D0D",
          light: "#FFFEF0",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        base: "8px",
      },
      boxShadow: {
        neo: "5px 5px 0px 0px rgba(0,0,0,1)",
        "neo-sm": "3px 3px 0px 0px rgba(0,0,0,1)",
        "neo-lg": "8px 8px 0px 0px rgba(0,0,0,1)",
        "neo-xl": "12px 12px 0px 0px rgba(0,0,0,1)",
        "neo-hover": "3px 3px 0px 0px rgba(0,0,0,1)",
        "neo-yellow": "5px 5px 0px 0px #FFDE59",
        "neo-blue": "5px 5px 0px 0px #5471FF",
        "neo-purple": "5px 5px 0px 0px #8C52FF",
        "neo-pink": "5px 5px 0px 0px #FF66C4",
        "neo-green": "5px 5px 0px 0px #7ED957",
        "neo-orange": "5px 5px 0px 0px #FF914D",
      },
      fontFamily: {
        heading: ["'Archivo Black'", "sans-serif"],
        base: ["'Space Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      fontWeight: {
        base: "500",
        heading: "900",
      },
      borderWidth: {
        3: "3px",
        4: "4px",
        5: "5px",
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-fast": "pulse 1s infinite",
        "wiggle": "wiggle 0.5s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      backgroundImage: {
        "grid-pattern": "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        "dots-pattern": "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.08' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='2'/%3E%3C/g%3E%3C/svg%3E\")",
        "diagonal-lines": "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
