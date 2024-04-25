import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { HttpLink } from '@apollo/client/link/http';

export default ({
	uri = '',
	fetch,
	apolloBatching,
}) => {
	const onVm = uri.indexOf('vm') > -1 || uri.indexOf('local') > -1;

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

	// Use the regular HttpLink if batching is disabled.
	if (!apolloBatching) {
		return new HttpLink(options);
	}

	return new BatchHttpLink(options);
};
