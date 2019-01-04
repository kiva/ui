/* eslint-disable no-console, no-param-reassign */
import serialize from 'serialize-javascript';
import CookieStore from '@/util/CookieStore';
import { preFetchAll } from '@/util/apolloPreFetch';
import renderGlobals from '@/util/renderGlobals';
import createApp from '@/main';
import headScript from '@/head/script';
import noscriptTemplate from '@/head/noscript.html';

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
		const cookieStore = new CookieStore(cookies);

		__webpack_public_path__ = config.publicPath || '/'; // eslint-disable-line

		const {
			app,
			router,
			apolloClient,
		} = createApp({
			appConfig: config,
			apollo: {
				auth0: {
					clientID: config.auth0ClientID,
					domain: config.auth0Domain,
					user: { id: 1 },
					token: 'fake-token',
				},
				cookieStore,
				csrfToken: cookieStore.has('kvis') && cookieStore.get('kvis').substr(6),
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
		context.renderedConfig = renderGlobals({ __KV_CONFIG__: config });
		context.renderedNoscript = noscriptTemplate(config);
		context.renderedExternals = `<script>(${serialize(headScript)})(window.__KV_CONFIG__);</script>`;

		// set router's location
		router.push(url);

		// wait until router has resolved possible async hooks
		return router.onReady(() => {
			// get the components matched by the route
			const matchedComponents = router.getMatchedComponents();

			// no matched routes
			if (!matchedComponents.length) {
				// TODO: Check for + redirect to kiva php app external route
				return reject({ code: 404 });
			}

			// Pre-fetch graphql queries from the components (and all of their child components) matched by the route
			// preFetchAll dispatches the queries with Apollo and returns a Promise,
			// which is resolved when the action is complete and apollo cache has been updated.
			return preFetchAll(matchedComponents, apolloClient, {
				route: router.currentRoute,
			}).then(() => {
				if (isDev) console.log(`data pre-fetch: ${Date.now() - s}ms`);
				// After all preFetch hooks are resolved, our store is now
				// filled with the state needed to render the app.
				// Expose the state on the render context, and let the request handler
				// inline the state in the HTML response. This allows the client-side
				// store to pick-up the server-side state without having to duplicate
				// the initial data fetching on the client.
				context.templateConfig = config;
				context.meta = app.$meta();
				context.renderedState = renderGlobals({
					__APOLLO_STATE__: apolloClient.cache.extract(),
				});
				context.setCookies = cookieStore.getSetCookies();
				resolve(app);
			}).catch(error => {
				if (error instanceof Error) {
					reject(error);
				} else {
					reject({
						url: router.resolve(error).href
					});
				}
			});
		}, reject);
	});
};
