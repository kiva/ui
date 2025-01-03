import minipassFetch from 'make-fetch-happen';

export default function fetch(url, options) {
	const onVm = url.indexOf('vm') > -1;
	return minipassFetch(url, {
		// fix request blocked b/c of self-signed certificate on dev-vm.
		strictSSL: !onVm,
		...options,
	});
}
