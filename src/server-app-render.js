/* eslint-disable vue/multi-word-component-names, no-throw-literal */
import { renderSSRHead } from '@unhead/ssr';
import serialize from 'serialize-javascript';
import { renderToString } from 'vue/server-renderer';
import headScript from '#src/head/script';
import oneTrustEvent from '#src/head/oneTrustEvent';
import createApp from '#src/main';
import createRouter from '#src/router';
import { preFetchAll } from '#src/util/apolloPreFetch';
import { authenticationGuard } from '#src/util/authenticationGuard';
import setBasketCookie from '#src/util/basketCookie';
import logFormatter from '#src/util/logFormatter';
import { buildUserDataGlobal } from '#src/util/optimizelyUserMetrics';
import setVisitorIdCookie from '#src/util/visitorCookie';
import renderGlobals from '#src/util/renderGlobals';

const isDev = process.env.NODE_ENV !== 'production';

function fillTemplate(template, data) {
	let html = template;
	Object.keys(data).forEach(key => {
		html = html.replace(`\${${key}}`, data[key]);
	});
	// TODO: minify html
	return html;
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

let renderedConfig = '';
let renderedExternals = '';

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
}

export default async function renderPage({
	cookieStore,
	context,
	fetch,
	kvAuth0,
}) {
	const s = isDev && Date.now();

	const {
		url,
		cdnNotedLoggedIn,
		config,
		kivaUserAgent,
		locale,
		device,
		ssrManifest,
		template,
	} = context;

	// Create a new router instance. This will set the initial route and potentially redirect or 404.
	const router = await createRouter({ isServer: true, url });

	const {
		app,
		head,
		apolloClient,
	} = createApp({
		name: '',
		appConfig: config,
		apollo: {
			uri: config.graphqlUri,
			types: config.graphqlPossibleTypes
		},
		cdnNotedLoggedIn,
		cookieStore,
		device,
		kvAuth0,
		locale,
		fetch,
		kivaUserAgent,
		router,
	});

	// render content for template
	renderExtraHtml(config);

	try {
		if (!router.currentRoute.value.meta?.useCDNCaching) {
			// Set the visitor id cookie
			setVisitorIdCookie(cookieStore);

			// Set the basket cookie
			await setBasketCookie(cookieStore, apolloClient);
		}

		// Use route meta property to determine if route needs authentication
		// authenticationGuard will reject promise with a redirect to login if
		// required authentication query fails
		await authenticationGuard({ route: router.currentRoute.value, apolloClient, kvAuth0 });

		// Pre-fetch graphql queries from the components (and all of their child components)
		// matched by the route
		// preFetchAll dispatches the queries with Apollo and returns a Promise,
		// which is resolved when the action is complete and apollo cache has been updated.
		await preFetchAll(router.currentRoute.value.matched, apolloClient, {
			cookieStore,
			kvAuth0,
			route: router.currentRoute.value,
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
		const globals = {
			__APOLLO_STATE__: apolloClient.cache.extract(),
		};
		if (!router.currentRoute.value.meta?.useCDNCaching) {
			const pageData = buildUserDataGlobal(router.currentRoute.value, cookieStore, apolloClient);
			if (pageData) {
				globals.pageData = pageData;
			}
		}
		const appState = renderGlobals(globals);

		// render head tags
		const payload = await renderSSRHead(head);

		// render preload links
		const preloadLinks = renderPreloadLinks(context.modules, ssrManifest);

		const templateData = {
			...payload,
			// Turn off SSR for local development to prevent component FOUC (Flash of Unstyled Content)
			// https://github.com/vitejs/vite/issues/6887#issuecomment-1038664078
			appHtml: isDev ? '' : appHtml,
			appState,
			appConfig: renderedConfig,
			externals: renderedExternals,
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
}
