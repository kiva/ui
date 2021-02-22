import { BatchHttpLink } from 'apollo-link-batch-http';
import fetch from 'isomorphic-fetch';
// http is a nodejs dep only used during development mode (there is no http npm package as of July 2020)
import { Agent as HttpAgent } from 'http'; // eslint-disable-line import/no-extraneous-dependencies
import { Agent as SslAgent } from 'https';

export default ({ uri = '' }) => {
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

	return new BatchHttpLink(options);
};
