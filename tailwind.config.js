/* eslint-disable @typescript-eslint/no-var-requires */

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./dist/**/*.html', './src/**/*.{js,jsx,ts,tsx}', './*.html'],
  theme: {
    extend: {
      fontFamily: {
        DMSans: 'DM Sans',
        FreizetTrial: 'Freizet Trial',
        primary: 'Space Grotesk',
        GeneralSans: 'General Sans',
      },
      colors: {
        'cover-color': '#414997',
        'portfolio-color': '#8F8A4D',
        'resume-color': '#8E3468',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
}
