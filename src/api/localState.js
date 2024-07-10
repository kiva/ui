import _merge from 'lodash/merge';

// require each local state resolver
const requireLocalResolver = require.context('./localResolvers', true, /\.js$/);

const initState = options => {
	// init each resolver with the given options and merge all the results together
	return requireLocalResolver.keys().reduce((result, key) => {
		const module = requireLocalResolver(key).default;
		return _merge(result, module(options));
	}, {});
};

const setLocalState = (options, cache) => {
	// Call defaults function for each local resolver
	return requireLocalResolver.keys().forEach(value => {
		const module = requireLocalResolver(value).default;
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
