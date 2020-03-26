import _merge from 'lodash/merge';
import _get from 'lodash/get';

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

	if (_get(options, 'appConfig.contentful.useLocalResolver')) {
		mergedResolvers = _merge(mergedResolvers, contentfulResolver.default(options));
	}

	return mergedResolvers;
};
