/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F0F13',
        surface: '#1A1A24',
        surface2: '#22223A',
        'border-custom': '#2E2E45',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0B8',
        'text-muted': '#6B6B85',
        accent: '#7C6FF7',
        accent2: '#4F8EF7',
        'accent-hover': '#6B5EE6',
        success: '#34D399',
        warning: '#FBBF24',
        danger: '#F87171',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7C6FF7, #4F8EF7)',
        'gradient-button': 'linear-gradient(135deg, #7C6FF7, #4F8EF7)',
      },
      boxShadow: {
        'card-glow': '0 0 20px rgba(124, 111, 247, 0.15)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
