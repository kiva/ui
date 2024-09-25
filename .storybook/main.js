/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: ["./stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
		build: {
			rollupOptions: {
				output: {
					chunkFileNames: 'assets/entry-[name]-[hash:10].js',
				},
			},
		},
    });
  },
};
export default config;
