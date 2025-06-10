import merge from 'deepmerge';
import base from './k8s-local.js';

export default merge(base, {
	app: {
		apolloBatching: false, // Remove this once batching is enabled in prod
		auth0: {
			enable: false,
		},
		graphqlUri: 'https://marketplace-api.k1.kiva.org/graphql',
		host: 'localhost',
		photoPath: 'https://www-kiva-org.freetls.fastly.net/img/',
		publicPath: '/',
	},
	server: {
		graphqlUri: 'https://marketplace-api.k1.kiva.org/graphql',
		gzipEnabled: true,
		memcachedEnabled: false,
		memcachedServers: '',
		sessionUri: '',
	},
});
