/* eslint-disable vue/multi-word-component-names, no-throw-literal */
import { renderToString } from 'vue/server-renderer';
import serialize from 'serialize-javascript';
import { v4 as uuidv4 } from 'uuid';
import { renderSSRHead } from '@unhead/ssr';
import CookieStore from '#src/util/cookieStore';
import KvAuth0, { MockKvAuth0 } from '#src/util/KvAuth0';
import { preFetchAll } from '#src/util/apolloPreFetch';
import renderGlobals from '#src/util/renderGlobals';
import createApp from '#src/main';
import headScript from '#src/head/script';
import oneTrustEvent from '#src/head/oneTrustEvent';

// import noscriptTemplate from '#src/head/noscript.html';
import { authenticationGuard } from '#src/util/authenticationGuard';
import { contentfulPreviewCookie } from '#src/util/contentfulPreviewCookie';

import logFormatter from '#src/util/logFormatter';
import { buildUserDataGlobal } from '#src/util/optimizelyUserMetrics';

import fetch from 'make-fetch-happen';

const isDev = process.env.NODE_ENV !== 'production';

function fillTemplate(template, data) {
	let html = template;
	Object.keys(data).forEach(key => {
		html = html.replace(`\${${key}}`, data[key]);
	});
	// TODO: minify html
	return html;
}

let renderedConfig = '';
let renderedExternals = '';
let renderedExternalsOptIn = '';

// This adds non-vue-rendered html strings to the request context.
// These strings are added to the final html response using server/index.template.html
function renderExtraHtml(config) {
	// render config if it hasn't been rendered yet
	if (!renderedConfig) {
		renderedConfig = renderGlobals({ __KV_CONFIG__: config });
	}
	// render externals if they haven't been rendered yet
	if (!renderedExternals) {
		// add OneTrust loader
		if (config.oneTrust && config.oneTrust.enable) {
			const key = `${config.oneTrust.key}${config.oneTrust.domainSuffix}`;
			const src = `https://cdn.cookielaw.org/consent/${key}/otSDKStub.js`;
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
}

// This function renders a <link> tag for a given file
function renderPreloadLink(file) {
	if (file.endsWith('.js')) {
		return `<link rel="modulepreload" crossorigin href="${file}">`;
	}
	if (file.endsWith('.css')) {
		return `<link rel="stylesheet" href="${file}">`;
	}
	// TODO: handle other file types if needed
	return '';
}

// This function renders <link> tags for all files in the manifest for the given modules
function renderPreloadLinks(modules, manifest = {}) {
	let links = '';
	const seen = new Set();
	modules.forEach(id => {
		const files = manifest[id];
		if (files) {
			files.forEach(file => {
				if (!seen.has(file)) {
					seen.add(file);
					links += renderPreloadLink(file);
				}
			});
		}
	});
	return links;
}

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default async context => {
	const s = isDev && Date.now();
	const {
		url,
		config,
		cookies,
		user,
		locale,
		device,
		ssrManifest,
		template,
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

	// __webpack_public_path__ = config.publicPath || '/'; // eslint-disable-line

	const {
		app,
		head,
		router,
		apolloClient,
	} = createApp({
		name: '',
		appConfig: config,
		apollo: {
			uri: config.graphqlUri,
			types: config.graphqlPossibleTypes
		},
		cookieStore,
		device,
		kvAuth0,
		locale,
		fetch,
		url,
		isServer: true,
	});

	// redirect to the resolved url if it does not match the requested url
	const { fullPath } = router.resolve(url);
	if (fullPath !== url) {
		// redirects defined in routes.js use a permanent (301) redirect
		throw { url: fullPath, code: 301 };
	}

	// render content for template
	renderExtraHtml(config);

	// set router's location, ignoring any errors about redirection
	router.push(url).catch(() => { });

	// wait until router has resolved possible async hooks
	await router.isReady();

	// get the components matched by the route
	const matchedComponents = router.currentRoute.value.matched;

	// no matched routes
	if (!matchedComponents.length) {
		// TODO: Check for + redirect to kiva php app external route
		throw { code: 404 };
	}
	contentfulPreviewCookie({ route: router.currentRoute, cookieStore });

	try {
		// Use route meta property to determine if route needs authentication
		// authenticationGuard will reject promise with a redirect to login if
		// required authentication query fails
		await authenticationGuard({ route: router.currentRoute, apolloClient, kvAuth0 });

		// Pre-fetch graphql queries from the components (and all of their child components)
		// matched by the route
		// preFetchAll dispatches the queries with Apollo and returns a Promise,
		// which is resolved when the action is complete and apollo cache has been updated.
		await preFetchAll(matchedComponents, apolloClient, {
			cookieStore,
			kvAuth0,
			route: router.currentRoute,
			device
		});

		let sp; // Vue serverPrefetch timing start
		if (isDev) {
			logFormatter(`data pre-fetch: ${Date.now() - s}ms`);
			sp = new Date();
		}

		// render the app
		const appHtml = await renderToString(app, context);

		if (isDev) logFormatter(`vue serverPrefetch: ${Date.now() - sp}ms`);

		// After all preFetch hooks are resolved, our store is now
		// filled with the state needed to render the app.
		// Expose the state on the render context, and let the request handler
		// inline the state in the HTML response. This allows the client-side
		// store to pick-up the server-side state without having to duplicate
		// the initial data fetching on the client.
		const appState = renderGlobals({
			__APOLLO_STATE__: apolloClient.cache.extract(),
			pageData: buildUserDataGlobal(router, cookieStore, apolloClient)
		});

		// render head tags
		const payload = await renderSSRHead(head);

		// render preload links
		const preloadLinks = renderPreloadLinks(context.modules, ssrManifest);

		// check for 3rd party script opt-out
		const hasOptOut = cookies?.kvgdpr?.indexOf('opted_out=true') > -1;

		const templateData = {
			...payload,
			// Turn off SSR for local development to prevent component FOUC (Flash of Unstyled Content)
			// https://github.com/vitejs/vite/issues/6887#issuecomment-1038664078
			appHtml: isDev ? '' : appHtml,
			appState,
			appConfig: renderedConfig,
			externals: hasOptOut ? renderedExternals : renderedExternalsOptIn,
			googleTagmanagerId: config.googleTagmanagerId,
			preloadLinks,
		};

		return {
			html: fillTemplate(template, templateData),
			setCookies: cookieStore.getSetCookies(),
		};
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		} else {
			context.setCookies = cookieStore.getSetCookies();
			throw {
				url: router.resolve(error).href,
			};
		}
	}
};
