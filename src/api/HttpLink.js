import * as Sentry from '@sentry/vue';
import { BatchHttpLink } from '@apollo/client/link/batch-http';

export default ({ kvAuth0, uri = '', fetch }) => {
	const onVm = uri.indexOf('vm') > -1;

	const options = {
		uri,
		fetch,
		headers: {},
		credentials: 'same-origin',
		fetchOptions: {
			// fix request blocked b/c of self-signed certificate on dev-vm.
			strictSSL: !onVm,
		}
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
