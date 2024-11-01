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
	const onVm = uri.indexOf('vm') > -1 || uri.indexOf('local') > -1 || uri.indexOf('stellate') > -1;

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

	const stellateOptions = {
		...options,
		uri: stellateGraphqlUri ?? uri,
	};

	const link = split(
		operation => {
			// check to see if we have a Stellate uri available
			if (!stellateGraphqlUri) {
				return false;
			}
			// check if the operation is cachable
			if (cachableQueryOperationNames.includes(operation.operationName)
				// only use stellate uri if the response is ok, retry failed queries to origin instead
				&& operation.getContext().response.ok !== false) {
				// update our options if we are caching the query
				options.uri = stellateGraphqlUri;
				return true;
			}
			// use default graphql uri
			return false;
		},
		// eslint-disable-next-line max-len
		(!apolloBatching ? new HttpLink(stellateOptions) : new BatchHttpLink(stellateOptions)), // function returns TRUE use this
		(!apolloBatching ? new HttpLink(options) : new BatchHttpLink(options)), // function returns FALSE use this
	);

	return link;
};
