const path = require('path');

module.exports = (opts = {}) => {
  return {
    postcssPlugin: 'postcss-variables-prefixer',
    Once (root) {
      // console.log(root)
      const fileName = path.basename(root.source.input.file);
      console.log(fileName)
      // Calls once per file, since every file has single Root
    }
  }
}
