/* eslint-disable prefer-promise-reject-errors, no-console, no-param-reassign */
import _map from 'lodash/map';
import cookie from 'cookie';
import createAsyncCaller from '@/util/callAsyncData';
import renderGlobals from '@/util/renderGlobals';
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
		const { url, config, cookies } = context;

		const {
			app,
			router,
			store,
			apolloClient,
		} = createApp({
			apollo: {
				cookie: _map(cookies, (val, name) => cookie.serialize(name, val)).join('; '),
				csrfToken: cookies.kvis && cookies.kvis.substr(6),
				uri: config.graphqlUri,
				types: config.graphqlFragmentTypes
			}
		});

		// redirect to the resolved url if it does not match the requested url
		const { fullPath } = router.resolve(url).route;
		if (fullPath !== url) {
			return reject({ url: fullPath });
		}

		// render content for template
		context.renderedConfig = renderGlobals({
			__KV_CONFIG__: config,
		});

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
			const callAsyncData = createAsyncCaller({ store, route: router.currentRoute });
			return Promise.all(matchedComponents.map(callAsyncData)).then(() => {
				if (isDev) console.log(`data pre-fetch: ${Date.now() - s}ms`);
				// After all preFetch hooks are resolved, our store is now
				// filled with the state needed to render the app.
				// Expose the state on the render context, and let the request handler
				// inline the state in the HTML response. This allows the client-side
				// store to pick-up the server-side state without having to duplicate
				// the initial data fetching on the client.
				context.meta = app.$meta();
				context.renderedState = renderGlobals({
					__APOLLO_STATE__: apolloClient.cache.extract(),
					__INITIAL_STATE__: store.state,
				});
				resolve(app);
			}).catch(reject);
		}, reject);
	});
};
