import minipassFetch from 'make-fetch-happen';
import config from './config.js';

export default function fetch(url, options) {
	const onVm = url.indexOf('vm') > -1;
	return minipassFetch(url, {
		// fix request blocked b/c of self-signed certificate on dev-vm.
		strictSSL: !onVm,
		...options,
		headers: {
			'User-Agent': config.server.userAgent,
			...options?.headers,
		}
	});
}
