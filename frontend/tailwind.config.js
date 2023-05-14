const { fontFamily } = require('tailwindcss/defaultTheme')


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        swiss: ['var(--font-swiss)', ...fontFamily.sans],
        swiss721md: ['var(--font-swiss721md)', ...fontFamily.sans],
        swiss721blk: ['var(--font-swiss721blk)', ...fontFamily.sans],
        // swis721rl: ['var(--font-swis721rl)', ...fontFamily.sans],
        jura: ['var(--font-jura)', ...fontFamily.sans],
        excluded: ['var(--font-excluded)', ...fontFamily.sans],
        nasalization: ['var(--font-nasalization)', ...fontFamily.sans]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}