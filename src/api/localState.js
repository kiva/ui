import _merge from 'lodash/merge';

// require each local state resolver
const requireLocalResolver = require.context('./localResolvers', true, /\.js$/);

// require optional resolvers controlled by settings
const contentfulResolver = require('./optionalLocalResolvers/contentful.js');

export default options => {
	// init each resolver with the given options and merge all the results together
	const reqResolvers = requireLocalResolver.keys().reduce((result, key) => {
		const module = requireLocalResolver(key).default;
		return _merge(result, module(options));
	}, {});

	let mergedResolvers = reqResolvers;

	// not optional for now. Once we get federation working on the vm's maybe we can remove this resolver.
	mergedResolvers = _merge(mergedResolvers, contentfulResolver.default(options));

	return mergedResolvers;
};
