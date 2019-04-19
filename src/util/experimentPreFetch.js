import _map from 'lodash/map';
// import { handleApolloErrors } from '@/util/apolloPreFetch';
import experimentSettingQuery from '@/graphql/query/experimentSetting.graphql';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';

// Pre-fetch pre-determined list of experiment settings
// TODO: Centralize this in Settings Manager or elsewhere...
const activeExperiments = [
	'lend_filter',
	'some_thing_is_missing'
];

export function settingErrorHandler(errors, ...args) {
	console.log(errors);
	console.log(args);
	return new Promise(resolve => {
		resolve();
	});
}

export function assignExperiments(settingId, client) {
	console.log(typeof client);
	console.log(settingId);
	// Fetch the query from the component's apollo options
	return new Promise((resolve, reject) => {
		client.query({
			query: experimentAssignmentQuery,
			variables: {
				id: settingId || '',
			}
		}).then(result => {
			console.log(JSON.stringify(result));
			if (result.errors) {
				resolve(result.errors);
				// Handle Apollo errors with custom code
				// handleApolloErrors(settingErrorHandler, result.errors).then(resolve).catch(reject);
			} else {
				resolve(result);
			}
		}).catch(reject);
	});
}

export function fetchExperimentSettings(settingId, client) {
	console.log(typeof client);
	console.log(settingId);
	// Fetch the query from the component's apollo options
	return new Promise((resolve, reject) => {
		client.query({
			query: experimentSettingQuery,
			variables: {
				key: `uiexp.${settingId}` || '',
			},
			fetchPolicy: 'network-only', // This is used to force re-fetch of queries after new auth
		}).then(result => {
			console.log(JSON.stringify(result));
			if (result.errors) {
				console.error(result.errors);
				resolve(result.errors);
			}
			return assignExperiments(settingId, client);
		}).then(result => {
			if (result.errors) {
				resolve(result.errors);
				// Handle Apollo errors with custom code
				// handleApolloErrors(settingErrorHandler, result.errors).then(resolve).catch(reject);
			} else {
				resolve(result);
			}
		}).catch(reject);
	});
}

export function fetchAllExpSettings(apolloClient) {
	return Promise.all(_map(activeExperiments, settingId => fetchExperimentSettings(settingId, apolloClient)));
}
