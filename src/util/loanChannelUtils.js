import {
	fetchLoanChannel,
	getCachedLoanChannel,
	getLoanChannelVariables,
	watchLoanChannel
} from '@/util/flssUtils';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import loanChannelQuery from '@/graphql/query/loanChannelDataExpanded.graphql';
import { getExperimentSettingAsync, getExperimentSettingCached, trackExperimentVersion } from '@/util/experimentUtils';
import logReadQueryError from '@/util/logReadQueryError';

export const loanChannelFLSSQueryEXP = 'loan_channel_flss_query_v1';

/**
 * Returns the FLSS loan search state object based on the map and category
 *
 * @param {Array} queryMap The map mixin from loan-channel-query-map.js
 * @param {string} category The category from $route.params.category
 * @returns {Object} The loan search state object
 */
export function getFLSSQueryMap(queryMap, category) {
	return queryMap.find(c => c.url === category)?.flssLoanSearch;
}

/**
 * Transforms the FLSS channel data to match the lend channel data format
 *
 * @param {Object} data The data from FLSS
 * @returns {Object} The transformed channel data
 */
export function transformFLSSData(data) {
	return {
		shop: data?.shop ?? {},
		lend: { loanChannelsById: [{ ...data?.lend?.loanChannelsById?.[0], loans: data?.fundraisingLoans ?? {} }] }
	};
}

/**
 * Used to pre-fetch the loan channel data in the control component
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Array} queryMap The map mixin from loan-channel-query-map.js
 * @param {string} channelUrl The URL of the loan channel
 * @param {Object} loanQueryVars The loan channel query variables
 * @param {Object} selectedQuickFilters Selected quick filters
 */
export async function preFetchChannel(apollo, queryMap, channelUrl, loanQueryVars, selectedQuickFilters) {
	const queryMapFLSS = getFLSSQueryMap(queryMap, channelUrl);

	if (queryMapFLSS) {
		await getExperimentSettingAsync(apollo, loanChannelFLSSQueryEXP);

		let experimentActive;

		try {
			experimentActive = (await apollo.query({
				query: experimentAssignmentQuery,
				variables: { id: loanChannelFLSSQueryEXP }
			})).data.experiment?.version === 'b';
		} catch (e) {
			logReadQueryError(e, 'loanChannelUtils preFetchChannel experimentAssignmentQuery');
		}

		if (experimentActive) {
			const filterObj = { ...queryMapFLSS, ...selectedQuickFilters };
			return fetchLoanChannel(apollo, filterObj, loanQueryVars);
		}
	}

	try {
		return apollo.query({
			query: loanChannelQuery,
			variables: loanQueryVars
		});
	} catch (e) {
		logReadQueryError(e, 'loanChannelUtils preFetchChannel loanChannelQuery');
	}
}

/**
 * Checks the cached experiment for a matching version
 *
 * @param {Object} apollo The Apollo client instance
 * @param {string} version The version of the experiment
 * @returns {boolean} Whether the cached experiment matches
 */
export function checkCachedChannelExperiment(apollo, version = 'b') {
	try {
		return apollo.readQuery({
			query: experimentAssignmentQuery,
			variables: { id: loanChannelFLSSQueryEXP }
		}).experiment?.version === version;
	} catch (e) {
		logReadQueryError(e, 'loanChannelUtils checkCachedChannelExperiment experimentAssignmentQuery');
	}
}

/**
 * Gets the loan channel data from the Apollo cache
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Array} queryMap The map mixin from loan-channel-query-map.js
 * @param {string} channelUrl The URL of the loan channel
 * @param {Object} loanQueryVars The loan channel query variables
 * @returns {Object} The loan channel data
 */
export function getCachedChannel(apollo, queryMap, channelUrl, loanQueryVars) {
	const queryMapFLSS = getFLSSQueryMap(queryMap, channelUrl);

	if (queryMapFLSS) {
		const experimentActive = checkCachedChannelExperiment(apollo);

		if (experimentActive) {
			return transformFLSSData(getCachedLoanChannel(apollo, queryMapFLSS, loanQueryVars));
		}
	}

	try {
		return apollo.readQuery({ query: loanChannelQuery, variables: loanQueryVars });
	} catch (e) {
		logReadQueryError(e, 'loanChannelUtils getCachedChannel loanChannelQuery');
	}
}

/**
 * Gets the loan channel data from the API
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Array} queryMap The map mixin from loan-channel-query-map.js
 * @param {string} channelUrl The URL of the loan channel
 * @param {Object} loanQueryVars The loan channel query variables
 * @returns {Object} The loan channel data, transformed if FLSS
 */
export async function getLoanChannel(apollo, queryMap, channelUrl, loanQueryVars) {
	const queryMapFLSS = getFLSSQueryMap(queryMap, channelUrl);

	if (queryMapFLSS) {
		const experimentActive = checkCachedChannelExperiment(apollo);

		if (experimentActive) {
			return transformFLSSData(await fetchLoanChannel(apollo, queryMapFLSS, loanQueryVars));
		}
	}

	try {
		return apollo.query({ query: loanChannelQuery, variables: loanQueryVars });
	} catch (e) {
		logReadQueryError(e, 'loanChannelUtils getLoanChannel loanChannelQuery');
	}
}

/**
 * Watches the loan channel query and returns the observer
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Array} queryMap The map mixin from loan-channel-query-map.js
 * @param {Object} selectedQuickFilters Selected quick filters
 * @param {string} channelUrl The URL of the loan channel
 * @param {Object} loanQueryVars The loan channel query variables
 * @param {function} next The function to call in the observer subscription next callback
 * @param {function} watch The function to call to setup the component watch
 * @returns {Object} The Apollo watch observer
 */
export function watchChannelQuery(apollo, queryMap, selectedQuickFilters, channelUrl, loanQueryVars, next, watch) {
	let observer;

	const queryMapFLSS = getFLSSQueryMap(queryMap, channelUrl);

	let experimentActive = false;

	const filterObj = { ...queryMapFLSS, ...selectedQuickFilters };

	// Check if current user should see the FLSS experiment
	if (queryMapFLSS) {
		experimentActive = checkCachedChannelExperiment(apollo);

		if (experimentActive) {
			observer = watchLoanChannel(apollo, filterObj, loanQueryVars);
		}
	}

	// Fallback to lend API
	if (!experimentActive) {
		observer = apollo.watchQuery({ query: loanChannelQuery, variables: loanQueryVars });
	}

	if (observer) {
		observer.subscribe({
			next: ({ data, loading }) => {
				next(experimentActive ? transformFLSSData(data) : data, loading);
			}
		});

		watch(vars => {
			// eslint-disable-next-line max-len
			observer.setVariables(experimentActive ? getLoanChannelVariables(filterObj, vars) : vars);
		});

		return observer;
	}
}

/**
 * Tracks the loan channel FLSS experiment for the current user if the experiment is enabled
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Array} queryMap The map mixin from loan-channel-query-map.js
 * @param {string} channelUrl The URL of the loan channel
 * @param {function} trackEvent The method for tracking analytics events
 */
export function trackChannelExperiment(apollo, queryMap, channelUrl, trackEvent) {
	if (getFLSSQueryMap(queryMap, channelUrl)) {
		const { enabled } = getExperimentSettingCached(apollo, loanChannelFLSSQueryEXP);

		if (enabled) {
			trackExperimentVersion(apollo, trackEvent, 'Lending', loanChannelFLSSQueryEXP, 'EXP-VUE-1114-July2022');
		}
	}
}

/**
 * Gets the filtered loan channel data from the API
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Array} queryMap The map mixin from loan-channel-query-map.js
 * @param {string} channelUrl The URL of the loan channel
 * @param {Object} loanQueryVars The loan channel query variables
 * @param {Object} selectedQuickFilters The selected filters to apply
 * @returns {Object} The loan channel data, transformed if FLSS
 */
export async function getFilteredLoanChannel(apollo, queryMap, channelUrl, loanQueryVars, selectedQuickFilters) {
	const queryMapFLSS = { ...getFLSSQueryMap(queryMap, channelUrl), ...selectedQuickFilters };
	return transformFLSSData(await fetchLoanChannel(apollo, queryMapFLSS, loanQueryVars));
}
