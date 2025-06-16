// postcss.config.cjs
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // This tells PostCSS to use the @tailwindcss/postcss plugin
    autoprefixer: {}, // Keep autoprefixer as well
  },
};
