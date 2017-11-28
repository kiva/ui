/* eslint-disable prefer-promise-reject-errors, no-console, no-param-reassign */
import _values from 'lodash/values';
import createApp from '@/main';

const isDev = process.env.NODE_ENV !== 'production';

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => {
	return new Promise((resolve, reject) => {
		const s = isDev && Date.now();
		const { url, graphqlUri } = context;
		const {
			app,
			router,
			store,
			apolloClient,
		} = createApp({
			apollo: {
				uri: graphqlUri
			}
		});

		const { fullPath } = router.resolve(url).route;

		if (fullPath !== url) {
			return reject({ url: fullPath });
		}

		// set router's location
		router.push(url);

		// wait until router has resolved possible async hooks
		return router.onReady(() => {
			const matchedComponents = router.getMatchedComponents();
			// no matched routes
			if (!matchedComponents.length) {
				// TODO: Check for + redirect to kiva php app external route
				return reject({ code: 404 });
			}

			// Call asyncData hooks on components matched by the route, and recursively
			// call asyncData hooks on their child components.
			// An asyncData hook dispatches a store action and returns a Promise,
			// which is resolved when the action is complete and store state has been
			// updated.
			function callAsyncData({ asyncData, components }) {
				return Promise.all([
					asyncData && asyncData({ store, route: router.currentRoute }),
					components && Promise.all(_values(components).map(callAsyncData))
				]);
			}
			return Promise.all(matchedComponents.map(callAsyncData)).then(() => {
				if (isDev) console.log(`data pre-fetch: ${Date.now() - s}ms`);
				// After all preFetch hooks are resolved, our store is now
				// filled with the state needed to render the app.
				// Expose the state on the render context, and let the request handler
				// inline the state in the HTML response. This allows the client-side
				// store to pick-up the server-side state without having to duplicate
				// the initial data fetching on the client.
				context.state = store.state;
				context.apolloState = JSON.stringify(apolloClient.cache.extract());
				resolve(app);
			}).catch(reject);
		}, reject);
	});
};
