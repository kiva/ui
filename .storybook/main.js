module.exports = {
	stories: [
		'./stories/Styleguide.stories.(js|mdx)', // load the styleguide first
		'./stories/**/*.stories.js'
	],
	addons: [
		'@storybook/addon-actions',
		'@storybook/addon-knobs',
		'@storybook/addon-links',
		'@storybook/addon-docs',
		'@storybook/addon-a11y',
		'@storybook/addon-viewport',
		'@storybook/addon-storysource'
	]
}
