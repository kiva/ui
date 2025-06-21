import fetch from 'make-fetch-happen';
import CookieStore from '#src/util/cookieStore';
import KvAuth0, { MockKvAuth0 } from '#src/util/KvAuth0';
import logFormatter from '#src/util/logFormatter';
import renderESI from '#src/server-esi-render';
import renderPage from '#src/server-app-render';

// custom fetch wrapper to log fetch requests
const customFetch = async (uri, options) => {
	const response = await fetch(uri, options);
	// Log the outgoing options
	logFormatter(`Fetch Options: ${uri}, Options: ${JSON.stringify(options)}`);

	// Log the full response
	// eslint-disable-next-line max-len
	logFormatter(`Server fetch: ${uri}, Status: ${response.status}, Headers: ${JSON.stringify(response.headers.raw())}`);

	return response;
};

// This exported function will be called by vue-render.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the rendered html and set cookies.
export default async context => {
	const {
		esi,
		config,
		cookies,
		user,
	} = context;
	const { accessToken, ...profile } = user;

	// Create cookie store with cookies passed from express middleware
	const cookieStore = new CookieStore(cookies);

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

	const renderingOptions = {
		cookieStore,
		context,
		fetch: config?.apolloQueryFetchLogging ? customFetch : fetch,
		kvAuth0,
	};

	if (esi) {
		return renderESI(renderingOptions);
	}
	return renderPage(renderingOptions);
};
