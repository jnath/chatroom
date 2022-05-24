import * as path from 'path';
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
    typescript: true,
		postcss: true
	}),

	kit: {
		adapter: adapter(),
		vite: {
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
