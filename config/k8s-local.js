import { merge } from 'webpack-merge';
import base from './dynamic.js';

const transport = process.env.TRANSPORT || 'https';
const monolithHostname = process.env.MONOLITH_HOSTNAME || 'monolith.kiva.local';
const apiHostname = process.env.API_HOSTNAME || 'api.kiva.local';
const apolloBatching = process.env.APOLLO_BATCH !== 'false';

export default merge(base, {
	app: {
		apolloBatching,
		auth0: {
			checkFakeAuth: true,
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
		graphqlUri: `${transport}://${apiHostname}/graphql`,
		host: `${monolithHostname}`,
		enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
		enableFB: process.env.ENABLE_FB === 'true',
		enableGA: process.env.ENABLE_GA === 'true',
		enableGTM: process.env.ENABLE_GTM === 'true',
		enableHotjar: process.env.ENABLE_HOTJAR === 'true',
		enableOptimizely: process.env.ENABLE_OPTIMIZELY === 'true',
		enableSentry: process.env.ENABLE_SENTRY === 'true',
		enableSnowplow: process.env.ENABLE_SNOWPLOW === 'true',
		fbApplicationId: '263964058630',
		fbOgNameSpace: 'vm-kiva',
		gaId: 'UA-11686022-7',
		hotjarId: '3112979',
		oneTrust: {
			enable: process.env.ENABLE_ONE_TRUST === 'true',
		},
		photoPath: `${transport}://${monolithHostname}/img/`,
		publicPath: `${transport}://${monolithHostname}/`,
		transport: `${transport}`,
		sentryURI: '',
	},
	server: {
		disableCluster: true,
		graphqlUri: `${transport}://${apiHostname}/graphql`,
		memcachedEnabled: true,
		memcachedServers: 'localhost:11211',
		sessionUri: `${transport}://${monolithHostname}/start-ui-session`,
	}
});
