import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-fetch';
import { Agent } from 'https';

export default ({ cookie, csrfToken = '', uri = '' }) => {
	const onVm = uri.indexOf('vm') > -1;

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
	if (csrfToken.length > 0) {
		options.headers['x-crumb'] = csrfToken;
	}

	// setup authorization
	if (cookie) {
		options.headers.cookie = cookie;
	} else {
		options.credentials = 'same-origin';
	}

	return new HttpLink(options);
};
