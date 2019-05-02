import _map from 'lodash/map';
// import { handleApolloErrors } from '@/util/apolloPreFetch';
import experimentSettingQuery from '@/graphql/query/experimentSetting.graphql';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';

// Pre-fetch pre-determined list of experiment settings
// TODO: Centralize this in Settings Manager or elsewhere, then Fetch it First
const activeExperiments = [
	'lend_filter',
	'pinned_filter',
];

// TODO: Enhance Error handling
// export function settingErrorHandler(errors, ...args) {
// 	console.log(errors);
// 	console.log(args);
// 	return new Promise(resolve => {
// 		resolve();
// 	});
// }

export function assignExperiments(settingId, client) {
	// Fetch the query from the component's apollo options
	return new Promise((resolve, reject) => {
		client.query({
			query: experimentAssignmentQuery,
			variables: {
				id: settingId || '',
			}
		}).then(result => {
			if (result.errors) {
				resolve(result.errors);
				// TODO: Handle Apollo errors with custom code
				// handleApolloErrors(settingErrorHandler, result.errors).then(resolve).catch(reject);
			} else {
				resolve(result);
			}
		}).catch(reject);
	});
}

export function fetchExperimentSettings(settingId, client) {
	// Fetch the query from the component's apollo options
	return new Promise((resolve, reject) => {
		client.query({
			query: experimentSettingQuery,
			variables: {
				key: `uiexp.${settingId}` || '',
			},
			fetchPolicy: 'network-only', // This is used to force re-fetch of queries after new auth
		}).then(result => {
			if (result.errors) {
				console.error(result.errors);
				resolve(result.errors);
			}
			// TODO: Make Active Exp list a map including a flag for pre-fetch assignment
			return assignExperiments(settingId, client);
		}).then(result => {
			if (result.errors) {
				console.error(result.errors);
				resolve(result.errors);
				// TODO: Handle Apollo errors with custom code
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
