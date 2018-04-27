// install method for plugin
export default Vue => {
	// const inBrowser = typeof window !== 'undefined';

	const kvActions = {
		pageview: (to, from) => {
			console.log(`fired pageview for: ${to.path}`);
			const toUrl = window.location.origin + to.path;
			const asyncFromUrl = window.location.origin + from.path;
			// ensure the url is correct
			// Snowplow seems to know better than the path rewriting performed by vue-router
			window.snowplow('setCustomUrl', toUrl);
			// set referrer for async page transitions
			if (from.matched && from.path !== '') {
				window.snowplow('setReferrerUrl', asyncFromUrl);
			}
			window.snowplow('trackPageView');

			// Google Analytics Pageview
			window.ga('set', 'page', toUrl);
			window.ga('send', 'pageview');
		}
	};

	/* eslint-disable no-param-reassign */
	Vue.prototype.$setKvAnalyticsData = data => {
		const userId = data.my.userAccount.id || undefined;
		// Setup Global Snowplow
		window.snowplow('setUserId', userId);
		// Setup Global GA Data
		window.ga('set', { userId });
		window.ga('set', 'useBeacon', true);
		window.ga('require', 'ec');
		window.ga('set', 'dimension1', userId);
	};

	/* eslint-disable no-param-reassign */
	Vue.prototype.$fireAsyncPageView = (to, from) => {
		kvActions.pageview(to, from);
	};

	/* eslint-disable no-param-reassign */
	Vue.prototype.$fireServerPageView = () => {
		const to = { path: window.location.pathname };
		const from = { path: document.referrer };
		kvActions.pageview(to, from);
	};

	// if (config) {
	// 	console.log('Apply Config');
	// }

	// if (inBrowser) {
	// 	console.log('type of window is NOT undefined, we are in the browser');
	// 	console.log('Set Custom Data here:')
	// 	console.log(window.snowplow);
	// }
};
