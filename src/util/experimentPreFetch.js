import _map from 'lodash/map';
import _get from 'lodash/get';
// import { handleApolloErrors } from '@/util/apolloPreFetch';
import experimentIdsQuery from '@/graphql/query/experimentIds.graphql';
import experimentSettingQuery from '@/graphql/query/experimentSetting.graphql';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
// import experimentCookieCleaner from '@/graphql/mutation/experimentCookieCleaner.graphql';
import updateExperimentVersion from '@/graphql/mutation/updateExperimentVersion.graphql';

// Pre-fetch pre-determined list of experiment settings
// TODO: Centralize this in Settings Manager or elsewhere, then Fetch it First
let activeExperiments = [
	'lend_filter_v2',
	'pinned_filter',
	'algolia_search',
	'expandable_loan_cards',
	// Uncomment when the Billion To Women Campaign ends on Oct. 13th 2019
	// 'mg_promo',
	'double_arrow_button',
	'billion_to_women',
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
				key: settingId || '',
			},
			fetchPolicy: 'network-only', // This is used to force re-fetch of queries after new auth
		}).then(result => {
			if (result.errors) {
				console.error(result.errors);
				resolve(result.errors);
			}
			// TODO: Make Active Exp list a map including a flag for pre-fetch assignment
			// > this should take the form of a route string, set to global or empty for multi-page experiments
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

export function fetchActiveExperiments(apolloClient) {
	return new Promise((resolve, reject) => {
		apolloClient.query({
			query: experimentIdsQuery,
			fetchPolicy: 'network-only',
		}).then(results => {
			if (results.errors) {
				console.error(results.errors);
				resolve(results.errors);
			}
			resolve(results);
		}).catch(reject);
	});
}

/*
	Handle Experiment settings globally
	1. Determine Active Experiments
	2. COMING SOON: Remove inactive experiments from cookie
	3. Force assign any experiment set using the 'setuiab' query param
	4. Fetch All active Experiment Settings
		a. All "active" experiment settings are now in the cache
		b. All "active" experiments with no route or the current route are give assignments
*/
export function fetchAllExpSettings(config, apolloClient, route) {
	return fetchActiveExperiments(apolloClient).then(results => {
		// Check for active experiments listing
		const activeExperimentsSettings = _get(results, 'data.general.activeExperiments');
		if (typeof activeExperimentsSettings !== 'undefined' && activeExperimentsSettings !== null) {
			try {
				activeExperiments = JSON.parse(activeExperimentsSettings.value).split(',');
			} catch (e) {
				// leave as defaults
			}
		}
		return activeExperiments;
	})

	// COMING SOON!!!
	// Remove any cookies that don't exisit in the active experiments listing
	// }).then(() => {
	// 	return apolloClient.mutate({
	// 		mutation: experimentCookieCleaner
	// 	});

		// Assign specific experiment version if present in query params
		// > query param must be 'setuiab'
		// > value should be and ACTIVE experiment id and the verison you want to assign separated by a period '.'
		.then(() => {
			const routeQuery = _get(route, 'query.setuiab');
			if (routeQuery !== undefined) {
				// TODO: Check for experiment setting + enable = true from server before running mutation
				const forcedExp = routeQuery.split('.');
				return apolloClient.mutate({
					mutation: updateExperimentVersion,
					variables: {
						id: encodeURIComponent(forcedExp[0]),
						version: encodeURIComponent(forcedExp[1])
					}
				});
			}
			return true;
		})
		// prefetch all active experiment settings and assignments
		.then(() => {
			return Promise.all(_map(activeExperiments, settingId => fetchExperimentSettings(settingId, apolloClient)));
		});
}
