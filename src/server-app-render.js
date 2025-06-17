/* eslint-disable vue/multi-word-component-names, no-throw-literal */
import { renderSSRHead } from '@unhead/ssr';
import { renderToString } from 'vue/server-renderer';
import createApp from '#src/main';
import createRouter from '#src/router';
import getCDNHeaders from '#src/rendering/cdnHeaders';
import fillTemplate from '#src/rendering/fillTemplate';
import { renderExternals } from '#src/rendering/externals';
import renderGlobals from '#src/rendering/globals';
import renderConfigGlobal from '#src/rendering/kvConfig';
import { renderPreloadLinks } from '#src/rendering/preloadLinks';
import { preFetchAll } from '#src/util/apolloPreFetch';
import { authenticationGuard } from '#src/util/authenticationGuard';
import setBasketCookie from '#src/util/basketCookie';
import logFormatter from '#src/util/logFormatter';
import { buildUserDataGlobal } from '#src/util/optimizelyUserMetrics';
import setVisitorIdCookie from '#src/util/visitorCookie';

const isDev = process.env.NODE_ENV !== 'production';

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
		renderConfig,
	} = await createApp({
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
		isServer: true,
	});

	try {
		if (!renderConfig.useCDNCaching) {
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
			device,
			renderConfig,
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
			appConfig: renderConfigGlobal(config),
			externals: renderExternals(config),
			googleTagmanagerId: config.googleTagmanagerId,
			preloadLinks,
		};

		return {
			cdnHeaders: getCDNHeaders(renderConfig),
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
