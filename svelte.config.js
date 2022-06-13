import * as path from 'path';
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import genericNames from 'generic-names';
var generate = genericNames('[local]-[hash:base64:5]', {

  context: process.cwd()
});
const alias = {
  $components: path.resolve('./src/components'),
  $system: path.resolve('./src/system'),
  $directives: path.resolve('./src/directives'),
  $models: path.resolve('./src/models'),
  $stores: path.resolve('./src/stores'),
  $helpers: path.resolve('./src/helpers'),
  $theme: path.resolve('./src/theme'),
}
function unique(value, index, self) {
  return self.indexOf(value) === index;
}

function trim(value) {
  return value.trim();
}
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
    preprocess({
      typescript: true,
      postcss: true,
    }),
    {
      markup: ({content, filename})=>{
        let code = content;
        const valueRegex = /var\(\s*--([^,\s]+?)(?:\s*,\s*(.+))?\s*\)/g;
        const keysRegexp = /\s*--([^,\s]+?)(?:\s*,\s*(.+))?\s*:/g;
        const propsRegexp = /\s*style:--([^,\s]+?)(?:\s*,\s*(.+))?\s*=/g;

        const valueMatches = [...content.matchAll(valueRegex)].map(([,val])=>val).filter(unique).map(trim);
        const propsMatches = [...content.matchAll(propsRegexp)].map(([,val])=>val).filter(unique).map(trim);
        const keysMatches = [...content.matchAll(keysRegexp)].map(([,val])=>val).filter(unique).map(trim);
        const allDefinition = [...propsMatches, ...keysMatches].filter(unique);
        const scoped = valueMatches.filter((val)=>allDefinition.includes(val));

        code = code.replace(
          new RegExp(scoped.map(s=>`--${s}`).join('|'), 'gm'),
          (match) => !!match && `--${generate(match.slice(2), filename)}` || ''
        )

        return {
          code
        }
      }
    }
  ],

	kit: {
		adapter: adapter(),
		vite: {
      server: {
        host: '0.0.0.0'
      },
      resolve: {
        alias: {
          $components: path.resolve('./src/components'),
          $system: path.resolve('./src/system'),
          $directives: path.resolve('./src/directives'),
          $models: path.resolve('./src/models'),
          $stores: path.resolve('./src/stores'),
          $helpers: path.resolve('./src/helpers'),
          $theme: path.resolve('./src/theme'),
        }
      }
    }
	}
};

export default config;
