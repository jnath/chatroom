const { mergeConfig } = require('vite');
const sveltePreprocess = require('svelte-preprocess');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx|svelte)"
  ],
  logLevel: 'debug',
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-svelte-csf"
  ],
  "framework": "@storybook/svelte",
  "core": {
    "builder": "@storybook/builder-vite"
  },
  "svelteOptions": {
    "preprocess": sveltePreprocess({
      typescript: true,
		  postcss: true
    })
  },
  viteFinal: async (config, { configType }) => {
    // return the customized config
    return mergeConfig(config, {
      // customize the Vite config here
      resolve: {
        alias: {
          $system: '/src/system',
          $components: '/src/components',
          $directives: '/src/directives',
          $models: '/src/models',
          $stores: '/src/stores',
          $helpers: '/src/helpers',
          $theme: '/src/theme',
        },
      },
    });
  },
}
