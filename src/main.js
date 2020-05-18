/* global UI_COMMIT */
import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import Meta from 'vue-meta';
import VueProgressBar from 'vue-progressbar';
import Vue2TouchEvents from 'vue2-touch-events';

import VueApollo from 'vue-apollo';
import App from '@/App';
import createRouter from '@/router';
import createApolloClient from '@/api/apollo';
import kivaPlugins from '@/plugins';


Vue.config.productionTip = false;

Vue.use(Meta);
Vue.use(kivaPlugins);
Vue.use(Vue2TouchEvents);
Vue.use(VueProgressBar, {
	color: '#26b6e8',
	failedColor: '#9c021a',
	thickness: '0.2rem',
	transition: {
		speed: '0.2s',
		opacity: '0s',
		termination: 300,
	},
	autoFinish: false,
});
// Install the vue plugin
Vue.use(VueApollo);

// App Instance Factory
// - Allows us to create new instance of app, store + router on each render
export default function createApp({
	apollo = {},
	appConfig = {},
	kvAuth0,
	ssr
} = {}) {
	const apolloClient = createApolloClient({
		...apollo, kvAuth0, appConfig, ssr, clientId: 'default',
	});

	const federationApolloURI = appConfig.federationService ? appConfig.federationService.uri : apollo.uri;

	const apolloFederationClient = createApolloClient({
		csrfToken: apollo.csrfToken,
		types: apollo.types,
		uri: federationApolloURI,
		kvAuth0,
		appConfig,
		ssr,
		clientId: 'federation',
	});

	const router = createRouter();
	// Checking that sentry is enabled & is not server side
	if (appConfig.enableSentry && typeof window !== 'undefined') {
		Sentry.init({
			dsn: appConfig.sentryURI,
			integrations: [new Integrations.Vue({ Vue, attachProps: true })],
			release: UI_COMMIT
		});
	}

	// Provide application config to all components
	Vue.prototype.$appConfig = appConfig;

	// Apollo
	const apolloProvider = new VueApollo({
		clients: {
			default: apolloClient,
			federation: apolloFederationClient
		},
		defaultClient: apolloClient,
	});

	const app = new Vue({
		router,
		provide: {
			apollo: apolloProvider.clients.default,
			federation: apolloProvider.clients.federation,
			kvAuth0,
		},
		apolloProvider,
		render: h => h(App),
	});

	return {
		app,
		router,
		apolloProvider,
	};
}
