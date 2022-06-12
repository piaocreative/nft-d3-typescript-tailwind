module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      width: {},
    },
  },
  plugins: [require('tw-elements/dist/plugin')],
}
