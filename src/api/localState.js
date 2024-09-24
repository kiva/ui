import _merge from 'lodash/merge';

// require each local state resolver
const requireLocalResolver = import.meta.glob('./localResolvers/*.js', { eager: true });

const initState = options => {
	// init each resolver with the given options and merge all the results together
	return Object.keys(requireLocalResolver).reduce((result, key) => {
		const module = requireLocalResolver[key].default;
		return _merge(result, module(options));
	}, {});
};

const setLocalState = (options, cache) => {
	// Call defaults function for each local resolver
	return Object.keys(requireLocalResolver).forEach(key => {
		const module = requireLocalResolver[key].default;
		const { defaults } = module(options);
		if (defaults) {
			defaults(cache);
		}
	});
};

export {
	initState,
	setLocalState
};
