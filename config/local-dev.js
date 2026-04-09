import merge from 'deepmerge';
import base from './k8s-local.js';

export default merge(base, {
	app: {
		apolloBatching: false, // Remove this once batching is enabled in prod
		auth0: {
			enable: false,
		},
		graphqlUri: 'https://gateway.development.kiva.org/graphql',
		host: 'localhost',
		photoPath: 'https://www.development.kiva.org/img/',
		publicPath: '/',
	},
	server: {
		graphqlUri: 'https://gateway.development.kiva.org/graphql',
		gzipEnabled: true,
		memcachedEnabled: false,
		memcachedServers: '',
	},
});
