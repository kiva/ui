const vueJest = require('@vue/vue3-jest/lib/template-compiler');

module.exports = {
	process(content) {
		const { render } = vueJest({
			content,
			attrs: {
				functional: false,
			},
		});

		return `module.exports = { render: ${render} }`;
	},
};
