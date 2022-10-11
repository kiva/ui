/* eslint-disable no-console, no-param-reassign, vue/multi-word-component-names */
import serialize from 'serialize-javascript';
import { v4 as uuidv4 } from 'uuid';
import CookieStore from '@/util/cookieStore';
import KvAuth0, { MockKvAuth0 } from '@/util/KvAuth0';
import { preFetchAll } from '@/util/apolloPreFetch';
import renderGlobals from '@/util/renderGlobals';
import createApp from '@/main';
import headScript from '@/head/script';
import oneTrustEvent from '@/head/oneTrustEvent';

import noscriptTemplate from '@/head/noscript.html';
import { authenticationGuard } from '@/util/authenticationGuard';
import { contentfulPreviewCookie } from '@/util/contentfulPreviewCookie';

import logFormatter from '@/util/logFormatter';
import { buildUserDataGlobal } from '@/util/optimizelyUserMetrics';

const fetch = require('make-fetch-happen');

const isDev = process.env.NODE_ENV !== 'production';

let renderedConfig = '';
let renderedNoscript = '';
let renderedExternals = '';
let renderedExternalsOptIn = '';

// This adds non-vue-rendered html strings to the request context.
// These strings are added to the final html response using server/index.template.html
function addRenderedHtml(context, config) {
	// render config if it hasn't been rendered yet
	if (!renderedConfig) {
		renderedConfig = renderGlobals({ __KV_CONFIG__: config });
	}
	// render noscript tag if it hasn't been rendered yet
	if (!renderedNoscript) {
		renderedNoscript = noscriptTemplate(config);
	}
	// render externals if they haven't been rendered yet
	if (!renderedExternals) {
		// add OneTrust loader
		if (config.oneTrust && config.oneTrust.enable) {
			const key = `${config.oneTrust.key}${config.oneTrust.domainSuffix}`;
			const src = `https://cdn.cookielaw.org/consent/${key}/otSDKStub.js`;
			// eslint-disable-next-line max-len
			renderedExternals += `<script type="text/javascript" data-domain-script="${key}" src="${src}"></script>`;
		}
		// add primary head script
		const renderedHeadScript = serialize(headScript);
		const renderedOneTrustEvent = serialize(oneTrustEvent);
		// eslint-disable-next-line max-len
		renderedExternals += `<script>(${renderedHeadScript})(window.__KV_CONFIG__, ${renderedOneTrustEvent});</script>`;
	}
	// render externals for users that are not opted out of 3rd party cookies
	if (!renderedExternalsOptIn) {
		// setup Optimizely loader
		if (config?.enableOptimizely && config?.optimizelyProjectId) {
			// eslint-disable-next-line max-len
			renderedExternalsOptIn += '<script type="text/javascript">window["optimizely"]=window["optimizely"]||[];window["optimizely"].push({"type":"holdEvents"});</script>';
			const optimizelySrc = `https://cdn.optimizely.com/js/${config?.optimizelyProjectId}.js`;
			renderedExternalsOptIn += `<script type="text/javascript" src="${optimizelySrc}"></script>`;
		}
		// append regular externals
		renderedExternalsOptIn += renderedExternals;
	}

	// check for 3rd party script opt-out
	const hasOptOut = context?.cookies?.kvgdpr?.indexOf('opted_out=true') > -1;

	// add rendered strings to request render context
	context.renderedConfig = renderedConfig;
	context.renderedNoscript = renderedNoscript;
	context.renderedExternals = hasOptOut ? renderedExternals : renderedExternalsOptIn;
}

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => {
	return new Promise((resolve, reject) => {
		const s = isDev && Date.now();
		const {
			url,
			config,
			cookies,
			user,
			locale,
			device,
		} = context;
		const { accessToken, ...profile } = user;

		// Create cookie store with cookies passed from express middleware
		const cookieStore = new CookieStore(cookies);

		// Create random visitor id if none is set
		if (!cookieStore.get('uiv')) {
			// Set visitor id cookie expiration for 2 years from now
			const expires = new Date();
			expires.setFullYear(expires.getFullYear() + 2);
			// Store visitor id as 'uiv' cookie
			cookieStore.set('uiv', uuidv4(), {
				expires,
				sameSite: true,
				secure: true,
				path: '/',
			});
		}

		let kvAuth0;
		if (config.auth0.enable) {
			kvAuth0 = new KvAuth0({
				accessToken,
				checkFakeAuth: config.auth0.checkFakeAuth,
				cookieStore,
				domain: config.auth0.domain,
				user: profile,
			});
		} else {
			kvAuth0 = MockKvAuth0;
		}

		__webpack_public_path__ = config.publicPath || '/'; // eslint-disable-line

		const {
			app,
			router,
			apolloClient,
		} = createApp({
			name: '',
			appConfig: config,
			apollo: {
				uri: config.graphqlUri,
				types: config.graphqlFragmentTypes
			},
			cookieStore,
			device,
			kvAuth0,
			locale,
			fetch
		});

		// redirect to the resolved url if it does not match the requested url
		const { fullPath } = router.resolve(url).route;
		if (fullPath !== url) {
			return reject({ url: fullPath });
		}

		// render content for template
		addRenderedHtml(context, config);

		// set router's location, ignoring any errors about redirection
		router.push(url).catch(() => {});

		// wait until router has resolved possible async hooks
		return router.onReady(() => {
			// get the components matched by the route
			const matchedComponents = router.getMatchedComponents();

			// no matched routes
			if (!matchedComponents.length) {
				// TODO: Check for + redirect to kiva php app external route
				return reject({ code: 404 });
			}
			contentfulPreviewCookie({ route: router.currentRoute, cookieStore });
			// Use route meta property to determine if route needs authentication
			// authenticationGuard will reject promise with a redirect to login if
			// required authentication query fails
			return authenticationGuard({ route: router.currentRoute, apolloClient, kvAuth0 }).then(() => {
				// Pre-fetch graphql queries from the components (and all of their child components)
				// matched by the route
				// preFetchAll dispatches the queries with Apollo and returns a Promise,
				// which is resolved when the action is complete and apollo cache has been updated.
				return preFetchAll(matchedComponents, apolloClient, {
					cookieStore,
					kvAuth0,
					route: router.currentRoute,
				});
			}).then(() => {
				let sp; // Vue serverPrefetch timing start
				if (isDev) {
					logFormatter(`data pre-fetch: ${Date.now() - s}ms`);
					sp = new Date();
				}

				// This `rendered` hook is called when the app has finished rendering
				context.rendered = () => {
					if (isDev) logFormatter(`vue serverPrefetch: ${Date.now() - sp}ms`);
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
						pageData: buildUserDataGlobal(router, cookieStore, apolloClient)
					});
					context.setCookies = cookieStore.getSetCookies();
				};
				resolve(app);
			}).catch(error => {
				if (error instanceof Error) {
					reject(error);
				} else {
					context.setCookies = cookieStore.getSetCookies();
					reject({
						url: router.resolve(error).href,
					});
				}
			});
		}, reject);
	});
};
