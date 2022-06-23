const path = require('path');

module.exports = (opts = {}) => {
  return {
    postcssPlugin: 'postcss-variables-prefixer',
    Once (root) {
      const fileName = path.basename(root.source.input.file);
      // Calls once per file, since every file has single Root
    }
  }
}
