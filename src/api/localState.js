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

const setDefaultLocalState = cache => {
	// Call defaults function for each local resolver
	requireLocalResolver.keys().reduce((result, key) => {
		if (!key.includes('experiment') && result) {
			const module = requireLocalResolver(key).default;
			const data = _merge(result, module());
			data?.defaults(cache);
		}
		return null;
	});
};

export {
	initState,
	setDefaultLocalState
};
