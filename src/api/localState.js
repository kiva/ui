import _merge from 'lodash/merge';

// require each local state resolver
const requireLocalResolver = require.context('./localResolvers', true, /\.js$/);

export default options => {
	// init each resolver with the given options and merge all the results together
	return requireLocalResolver.keys().reduce((result, key) => {
		const module = requireLocalResolver(key).default;
		return _merge(result, module(options));
	}, {});
};
