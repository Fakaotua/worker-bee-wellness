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
        'wbw-blue': '#1E40AF',
        'wbw-yellow': '#F59E0B',
        'wbw-charcoal': '#374151',
        'wbw-light-blue': '#60A5FA',
      },
    },
  },
  plugins: [],
}
