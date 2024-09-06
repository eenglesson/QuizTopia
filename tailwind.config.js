/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'white-purple': '#F0EDFF',
        'blue-super': '#0085FF',
        'black-text': '#1C1C1C',
        'grey-text': '#525252',
      },
      backgroundImage: {
        'purple-gradient': 'linear-gradient(to bottom right, #9181F4, #5038ED)',
        'purple-gradient-light':
          'linear-gradient(to bottom right, rgba(145, 129, 244, 0.9), rgba(80, 56, 237, 0.8))',
      },
      fontFamily: {
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        mini: '0px 4px 33px 0px rgba(7, 10, 33, 0.13)',
      },
    },
  },
  plugins: [],
};
