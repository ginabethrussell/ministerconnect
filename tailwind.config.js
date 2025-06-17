/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        efcaBlue: '#1a365d',
        efcaAccent: '#2b6cb0',
        efcaGray: '#f7fafc',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
