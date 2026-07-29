/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12141C',
        soft: '#6B7280',
        faint: '#9CA3AF',
        indigo: '#4F46E5',
        violet: '#7C3AED',
        emerald: '#16A34A',
        surface: '#FFFFFF',
        canvas: '#F7F8FC',
        line: '#E7E9F3',
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 45px -20px rgba(79,70,229,0.25)',
        card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)',
      },
    },
  },
  plugins: [],
};
