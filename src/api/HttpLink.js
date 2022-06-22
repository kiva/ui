import * as Sentry from '@sentry/vue';
import { BatchHttpLink } from 'apollo-link-batch-http';
// http is a nodejs dep only used during development mode (there is no http npm package as of July 2020)
import { Agent as HttpAgent } from 'http'; // eslint-disable-line import/no-extraneous-dependencies
import { Agent as SslAgent } from 'https';

export default ({ kvAuth0, uri = '', fetch }) => {
	const onVm = uri.indexOf('vm') > -1;
	const usingLocal = uri.indexOf('localhost') > -1;
	const secure = uri.indexOf('https') === 0;
	let agent;

	if (usingLocal && !secure) {
		agent = new HttpAgent();
	} else {
		agent = new SslAgent({
			// fix request blocked b/c of self-signed certificate on dev-vm.
			rejectUnauthorized: !onVm
		});
	}

	const options = {
		uri,
		fetch,
		headers: {},
		credentials: 'same-origin',
		fetchOptions: { agent }
	};

	// Add Fake Authentication info to the server URI if it is provided and allowed.
	try {
		const fakeAuthInfo = kvAuth0.getFakeAuthCookieValue();
		if (kvAuth0.fakeAuthAllowed() && fakeAuthInfo) {
			// add params to uri
			const fakeUri = new URL(uri);
			fakeUri.searchParams.set('user_id', fakeAuthInfo.userId);
			fakeUri.searchParams.set('scopes', fakeAuthInfo.scopes.join(' '));
			fakeUri.searchParams.set('app_id', kvAuth0.clientID || 'org.kiva.www');

			options.uri = fakeUri.href;
		}
	} catch (e) {
		console.error(e);
		Sentry.captureException(e);
	}

	return new BatchHttpLink(options);
};
