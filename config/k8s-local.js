import { merge } from 'webpack-merge';
import base from './index.js';
import devVm from './dev-vm.js';

const transport = process.env.TRANSPORT || 'https';
const monolithHostname = process.env.MONOLITH_HOSTNAME || 'monolith.kiva.local';
const apiHostname = process.env.API_HOSTNAME || 'api.kiva.local';
const apolloBatching = process.env.APOLLO_BATCH !== 'false';

export default merge(base, devVm, {
	app: {
		apolloBatching,
		host: `${monolithHostname}`,
		transport: `${transport}`,
		publicPath: `${transport}://${monolithHostname}/`,
		photoPath: `${transport}://${monolithHostname}/img/`,
		graphqlUri: `${transport}://${apiHostname}/graphql`,
		auth0: {
			loginRedirectUrls: {
				cNTV7eN5sBKgv9nQOxDpAz1pPfJGlBI5: `http://${monolithHostname}/login?force=1`,
				e6wSaTBDpKRkV5SV5cWw6zD6eJjd2DEk: `http://${monolithHostname}/pa2/login/login?authLevel=recent`,
				xOXldYg02WsLnlnn0D5xoPWI2i3aNsFD: `${transport}://${monolithHostname}/authenticate?authLevel=recent`,
				KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH: `${transport}://${monolithHostname}/ui-login?force=true`,
				ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF: `${transport}://${monolithHostname}/ui-login?force=true`,
			},
			apiAudience: `${transport}://${apiHostname}/graphql`,
			browserCallbackUri: `${transport}://${monolithHostname}/process-browser-auth`,
			serverCallbackUri: `${transport}://${monolithHostname}/process-ssr-auth`,
		},
	},
	server: {
		graphqlUri: `${transport}://${apiHostname}/graphql`,
		sessionUri: `${transport}://${monolithHostname}/start-ui-session`,
		// memcachedEnabled: false,
		memcachedEnabled: true,
		memcachedServers: 'localhost:11211',
		disableCluster: true,
	}
});
