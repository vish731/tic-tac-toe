/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        baseblue: '#0052FF',
        amber: '#FFB020',
        mint: '#00E6A8',
        cabinet: {
          bg: '#060A14',
          grid: '#0B1120',
          card: '#0F1626',
          border: '#1E293F',
          cell: '#131C30',
          text: '#EAF0FF',
          soft: '#8CA0C7',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
