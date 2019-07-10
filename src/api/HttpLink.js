import { BatchHttpLink } from 'apollo-link-batch-http';
import fetch from 'isomorphic-fetch';
import _map from 'lodash/map';
import _pick from 'lodash/pick';
import { Agent } from 'https';
import cookieStore from '@/util/cookieStore';

function serializeSelectClientCookies(cookies) {
	const targetCookies = ['__utma', '__utmc', '__utmz', '_sp_id.6d5c', '_sp_ses.6d5c'];
	const selectedCookies = _pick(cookies, targetCookies);
	return _map(selectedCookies, (val, name) => {
		return `${encodeURIComponent(name)}=${encodeURIComponent(val)}`;
	}).join('; ');
}

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
			}),
		},
		// setup authorization
		// TODO: convert to omit for localhost
		credentials: 'include',
		'headers.cookie': cookie !== '' ? cookie : serializeSelectClientCookies(cookieStore.get()),
	};

	// only add the csrf token if we have one
	if (csrfToken.length > 0 && viaAjax) {
		options.headers['x-crumb'] = csrfToken;
	}

	return new BatchHttpLink(options);
};
