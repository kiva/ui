import _camelCase from 'lodash/camelCase';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// include all js files in the ./modules directory
const requireModule = require.context('./modules', false, /\.js$/);

export default function createStore({ apolloClient }) {
	const modules = {};

	// create each module from the ./modules directory
	requireModule.keys().forEach(filename => {
		// get the camel case version of the module filename
		const moduleName = _camelCase(filename.replace(/(\.\/|\.js)/g, ''));

		// fetch the module, being careful to use the default export if set
		const rawModule = requireModule(filename);
		const createModule = rawModule.default ? rawModule.default : rawModule;

		// create and store the fetched module
		modules[moduleName] = createModule(apolloClient);
	});

	// return new store using created modules
	return new Vuex.Store({
		modules
	});
}
