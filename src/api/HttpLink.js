import { BatchHttpLink } from '@apollo/client/link/batch-http/index';
import { HttpLink } from '@apollo/client/link/http/index';
import { split } from '@apollo/client/core/index';

const cachableQueryOperationNames = [
	'configSetting',
	'experimentIds',
	'experimentSetting'
];

export default ({
	uri = '',
	fetch,
	apolloBatching,
	stellateGraphqlUri,
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

	const link = split(
		operation => {
			// check to see if we have a Stellate uri available
			if (!stellateGraphqlUri) {
				return false;
			}
			console.log('- - - - - - - - - -');
			console.log('operation name:', operation.operationName);
			// check if the operation is cachable
			if (cachableQueryOperationNames.includes(operation.operationName)) {
				console.log('cachable operation detected');
				// update our options if we are caching the query
				options.uri = stellateGraphqlUri;
				console.log('using stellate uri:', options.uri);
				return true;
			}
			// use default graphql uri
			return false;
		},
		(!apolloBatching ? new HttpLink(options) : new BatchHttpLink(options)), // function returns TRUE use this
		(!apolloBatching ? new HttpLink(options) : new BatchHttpLink(options)), // function returns FALSE use this
	);

	return link;
};
