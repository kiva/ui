module.exports = () => {
	const vueModuleId = require.resolve('vue');
	const vueModule = require.cache[vueModuleId];
	const vueRuntimeModuleId = vueModule
		&& vueModule.children
		&& vueModule.children[0]
		&& vueModule.children[0].id;

	delete require.cache[vueRuntimeModuleId];
	delete require.cache[vueModuleId];
};
