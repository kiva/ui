import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import Meta from 'vue-meta';
import VueProgressBar from 'vue-progressbar';

import App from '@/App';
import createRouter from '@/router';
import createApolloClient from '@/api/apollo';
import kivaPlugins from '@/plugins';

Vue.config.productionTip = false;

Vue.use(Meta);
Vue.use(kivaPlugins);
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
	const router = createRouter();

	// Checking that sentry is enabled & is not server side
	if (appConfig.enableSentry && typeof window !== 'undefined') {
		Raven.config(appConfig.sentryURI);
		Raven.addPlugin(RavenVue, Vue);
		Raven.install();
	}

	const app = new Vue({
		router,
		render: h => h(App, { props: { appConfig } }),
		provide: {
			apollo: apolloClient
		}
	});

	return {
		app,
		router,
		apolloClient,
	};
}
