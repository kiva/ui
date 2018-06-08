import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import { sync } from 'vuex-router-sync';
import Meta from 'vue-meta';
import VueApollo from 'vue-apollo';
import VueProgressBar from 'vue-progressbar';

import App from '@/App';
import createRouter from '@/router';
import createApolloClient from '@/api/apollo';
import createStore from '@/store';
import kivaPlugins from '@/plugins';

Vue.config.productionTip = false;

Vue.use(Meta);
Vue.use(kivaPlugins);
Vue.use(VueApollo);
Vue.use(VueProgressBar, {
	color: '#26b6e8',
	failedColor: '#9c021a',
	thickness: '0.2rem',
	transition: {
		speed: '0.2s',
		opacity: '0s',
		termination: 300,
	},
});

// App Instance Factory
// - Allows us to create new instance of app, store + router on each render
export default function createApp({ apollo = {}, appConfig = {} } = {}) {
	const apolloClient = createApolloClient(apollo);
	const store = createStore({ apolloClient });
	const apolloProvider = new VueApollo({
		defaultClient: apolloClient,
		// Errors are handled in @/api/ErrorLink, so return true here to skip vue-apollo default error handling
		errorHandler: () => true,
	});
	const router = createRouter();

	sync(store, router);

	// Checking that sentry is enabled & is not server side
	if (appConfig.enableSentry && typeof window !== 'undefined') {
		Raven.config(appConfig.sentryURI);
		Raven.addPlugin(RavenVue, Vue);
		Raven.install();
	}

	const app = new Vue({
		router,
		store,
		provide: apolloProvider.provide(),
		render: h => h(App, { props: { appConfig } }),
	});

	return {
		app,
		router,
		store,
		apolloProvider,
	};
}
