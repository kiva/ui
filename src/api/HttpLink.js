import { BatchHttpLink } from 'apollo-link-batch-http';
import fetch from 'isomorphic-fetch';
import { Agent as HttpAgent } from 'http';
import { Agent as SslAgent } from 'https';
import cookieStore from '@/util/cookieStore';

export default ({ csrfToken = '', uri = '' }) => {
	const cookie = cookieStore.getCookieString();
	const onVm = uri.indexOf('vm') > -1;
	const usingLocal = uri.indexOf('localhost') > -1;
	const secure = uri.indexOf('https') === 0;
	const viaAjax = uri.indexOf('ajax') > -1;
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
		fetchOptions: { agent }
	};

	// only add the csrf token if we have one
	if (csrfToken.length > 0 && viaAjax) {
		options.headers['x-crumb'] = csrfToken;
	}

	// setup authorization
	if (cookie && viaAjax) {
		options.headers.cookie = cookie;
	} else {
		options.credentials = 'same-origin';
	}

	return new BatchHttpLink(options);
};
