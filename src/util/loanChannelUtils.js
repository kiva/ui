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
 */
export async function preFetchChannel(apollo, queryMap, channelUrl, loanQueryVars) {
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
			const filterObj = { ...queryMapFLSS };
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

/**
 * Gets loan channel meta description
 *
 * @param {string} channelUrl The URL of the loan channel
 * @returns {string} The meta description of the loan channel
 */
export function getMetaDescription(channelUrl) {
	switch (channelUrl) {
		case 'agriculture':
			return 'By supporting a loan in agriculture, you\'re helping a'
				+ 'farmer invest in their livelihood. Make a difference and lend today.';
		case 'arts':
			return 'Keep local traditions alive by lending to an artist on Kiva. '
				+ 'With your support, artisans across the globe can grow their businesses.'
				+ 'Browse loans to artists. ';
		case 'conflict-zones':
			return 'Help fund small business owners in regions affected by violence'
				+ 'or instability. With just $25, you can support entrepreneurs in areas'
				+ 'where credit is hard to access. ';
		case 'covid-19':
			return 'Support entrepreneurs around the globe who are impacted by COVID-19. '
				+ 'Your loan goes a long way in assisting borrowers on the road to recovery.';
		case 'eco-friendly':
			return 'Help provide access to economic growth while protecting the environment. '
				+ 'Make the world a more sustainable place by supporting an eco-friendly loan today.';
		case 'ecofriendly-loans':
			return 'Help provide access to economic growth while protecting the environment. '
				+ 'Make the world a more sustainable place by supporting an eco-friendly loan today.';
		case 'education':
			return 'Help students reach their potential by lending to educational loans'
				+ 'on Kiva. Your loan provides a student with the means to improve their economic opportunity. ';
		case 'ending-soon':
			return 'Be a last-minute hero and support loans that are ending soon. Get these'
				+ 'borrowers to the finish line and make a loan today. Check out who\'s fundraising now.';
		case 'food':
			return 'Provide loan support to borrowers who are feeding their communities at '
				+ 'stores, markets, and restaurants. You can make a big difference in a borrower\'s life.';
		case 'groups':
			return 'With group loans, borrowers learn from each other and grow together. '
				+ 'Help their communities develop economic opportunity by making a loan to a group.';
		case 'health':
			return 'Healthcare is a human right. Help people around the world access'
				+ ' the healthcare services they need by making a loan through Kiva. ';
		case 'kiva-u-s':
			return '0% interest loans for small businesses in the U.S. and Puerto Rico. '
				+ 'Help entrepreneurs grow their businesses and create more jobs.';
		case 'livestock':
			return 'Livestock like cows, pigs, and chickens provide huge economic '
				+ 'opportunity for farmers. Invest in farmers\' futures by making a livestock loan.';
		case 'loans-that-are-almost-funded':
			return 'These loans are approaching the finish line, with less than $100 left. '
				+ 'Be the difference and help a borrower reach their goal. Check out who\'s fundraising now.';
		case 'loans-to-single-parents':
			return 'Help single parents navigate the challenges they face raising families '
				+ 'without partners. Support single parents by making a loan today.';
		case 'men':
			return 'Hardworking men around the world are dedicated to improving the quality '
				+ 'of life for themselves and their families. Invest in their futures by lending today.';
		case 'mission-driven-orgs':
			return 'Kiva\'s partners are committed to creating lasting social impact. Your '
				+ 'support provides the capital necessary to help driven entrepreneurs around the world.';
		case 'refugees-and-i-d-ps':
			return 'Millions of people around the world have been forced to flee their homes '
				+ 'due to disasters or instability. Support refugees and IDPs today.';
		case 'retail-businesses':
			return 'Retail businesses provide essential products to communities. Show your '
				+ 'support by lending to these entrepreneurs. Check out who\'s fundraising now on Kiva.';
		case 'shelter':
			return 'Shelter is the most basic of human needs. Help people around the world in '
				+ 'build much needed shelter for themselves and their families by making a loan today.';
		case 'short-term-loans':
			return 'These loans have repayment times of 16 months or less. If faster repayment'
				+ ' is important for you, consider making a loan to these borrowers today. ';
		case 'underbanked-areas':
			return 'In these areas, it\'s difficult for people to access credit. Assist '
				+ 'borrowers by funding loans in underbanked areas today. Check out who\'s fundraising on Kiva.';
		case 'vulnerable-populations':
			return 'Vulnerable populations around the world work hard to build and rebuild'
				+ ' their lives, and your support makes all the difference. Make a loan today.';
		case 'water-and-sanitation':
			return 'One in three people in the world does not have clean drinking water. '
				+ 'Help provide this necessity to borrowers through Kiva by lending today.';
		case 'women':
			return 'Worldwide, women face economic and societal barriers to building capital. '
				+ 'Make an impact in women\'s lives today by funding a loan on Kiva.';
		default:
			return 'Choose a category, lend to borrowers, and make an impact. Each Kiva loan'
				+ ' helps people build a better future for themselves and their families.';
	}
}
