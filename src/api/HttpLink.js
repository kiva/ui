import { BatchHttpLink } from 'apollo-link-batch-http';
import fetch from 'isomorphic-fetch';
import { Agent } from 'https';
import cookieStore from '@/util/cookieStore';

export default ({ csrfToken = '', uri = '' }) => {
	const cookie = cookieStore.getCookieString();
	const onVm = uri.indexOf('vm') > -1;
	const viaAjax = uri.indexOf('ajax') > -1;

	const options = {
		uri,
		fetch,
		headers: {},
		fetchOptions: {
			agent: new Agent({
				// fix request blocked b/c of self-signed certificate on dev-vm.
				rejectUnauthorized: !onVm
			})
		}
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
