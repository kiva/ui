import minipassFetch from 'make-fetch-happen';
import config from './config.js';

export default function fetch(url, options) {
	const onVm = url.indexOf('vm') > -1;

	const opts = {
		// fix request blocked b/c of self-signed certificate on dev-vm.
		strictSSL: !onVm,
		...options,
	};

	if (config.server.userAgent) {
		opts.headers = {
			'User-Agent': config.server.userAgent,
			...opts.headers,
		};
	}

	return minipassFetch(url, opts);
}
