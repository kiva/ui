import { merge } from 'webpack-merge';
import base from './index.js';
import devVm from './dev-vm.js';

export default merge(base, devVm, {
	app: {
		apolloBatching: false,
		host: 'localhost',
		publicPath: '/',
		photoPath: 'https://www.development.kiva.org/img/',
		graphqlUri: 'https://gateway.development.kiva.org/graphql',
		enableAnalytics: false,
		enableSnowplow: false,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableGA: false,
		gaId: 'UA-11686022-7', // dev-vm property
		enableSentry: false,
		sentryURI: 'https://7ce141b23c4a4e6091c206d08442f0e9@o7540.ingest.sentry.io/1201287',
		auth0: {
			loginRedirectUrls: {
				xOXldYg02WsLnlnn0D5xoPWI2i3aNsFD: 'https://www.development.kiva.org/authenticate?authLevel=recent',
				KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH: 'http://localhost:8888/ui-login?force=true',
				ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF: 'http://localhost:8888/ui-login?force=true',
			},
			enable: true,
			browserCallbackUri: 'http://localhost:8888/process-browser-auth',
			serverCallbackUri: 'http://localhost:8888/process-ssr-auth',
			apiAudience: 'https://gateway.development.kiva.org/graphql',
		},
	},
	server: {
		graphqlUri: 'https://gateway.development.kiva.org/graphql',
		sessionUri: 'https://www.development.kiva.org/start-ui-session',
		memcachedEnabled: false,
		disableCluster: true,
	}
});
