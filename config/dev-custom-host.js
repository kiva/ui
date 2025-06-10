import merge from 'deepmerge';
import base from './k8s-local.js';

const host = 'kiva-ui.local';
const kivaHost = 'development.kiva.org';

export default merge(base, {
	app: {
		apolloBatching: false,
		apolloNetworkErrorRetryActive: true,
		apolloNetworkErrorRetryAttempts: 2,
		auth0: {
			apiAudience: `https://gateway.${kivaHost}/graphql`,
			browserCallbackUri: `https://${host}/process-browser-auth`,
			enable: true,
			loginRedirectUrls: {
				KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH: `https://${host}/ui-login?force=true`,
				ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF: `https://${host}/ui-login?force=true`,
			},
			serverCallbackUri: `https://${host}/process-ssr-auth`,
		},
		graphqlUri: `https://gateway.${kivaHost}/graphql`,
		host,
		photoPath: `https://www.${kivaHost}/img/`,
		publicPath: '/',
	},
	server: {
		graphqlUri: `https://gateway.${kivaHost}/graphql`,
		sessionUri: `https://www.${kivaHost}/start-ui-session`,
		memcachedEnabled: false,
		memcachedServers: '',
		viteConfig: {
			server: {
				allowedHosts: [host],
				hmr: {
					// Use a different client port to allow Caddy to reverse proxy with SSL cert
					clientPort: 24679,
					port: 24678,
				},
			},
		}
	},
});
