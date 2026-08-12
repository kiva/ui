/* eslint-disable no-underscore-dangle */
// recursive function to add child components to a set
async function deepAdd(components, set) {
	if (!components) return;

	// normalize list of components to an array
	const values = Array.isArray(components) ? components : Object.values(components);

	return Promise.all(values.map(async definition => {
		let def = definition;
		// import dynamic component
		if (typeof definition === 'function') {
			def = await definition();
		}
		// import vue 3 async component
		if (definition.__asyncLoader) {
			def = await definition.__asyncLoader();
		}
		// a loader for a module without a default export resolves to nothing
		if (!def) return;
		// normalize imported component
		if (def.default) {
			def = def.default;
		}
		// add the component definition and its children if the definition hasn't been added yet
		if (!set.has(def)) {
			set.add(def);
			// __childComponents holds loaders for the children the build step attached
			return Promise.all([
				deepAdd(def.components, set),
				deepAdd(def.__childComponents, set),
			]);
		}
	}));
}

// Return an array of passed-in components and all their children
export default async function getDeepComponents(components) {
	const result = new Set();
	await deepAdd(components, result);
	return Array.from(result);
}
