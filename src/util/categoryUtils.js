import gql from 'graphql-tag';
import featuredLoansQuery from '@/graphql/query/featuredLoansData.graphql';
import recommendedLoansQuery from '@/graphql/query/lendByCategory/recommendedLoans.graphql';
import logReadQueryError from '@/util/logReadQueryError';

// Fallback featured_loan_channel id
export const fallbackCategoryIds = [98];

/**
 * Add custom name and descriptions to loan channels before they are displayed. This is mainly for cases where
 * different names/descriptions should be used when a user is logged-in vs. not logged-in.
 *
 * @param {LoanChannel} currentChannel       the loan channel to potentially modify
 * @param {UserAccount} userAccount          optional UserAccount object of the current user
 * @return {LoanChannel}                     the same object as currentChannel, with updated name and/or description
 */
export function addCustomChannelInfo(currentChannel, userAccount = {}) {
	const channel = { ...currentChannel } || {};
	const { id, firstName } = userAccount;
	//	check channel.id, if it's 95 update the name and descripton with user info
	if (channel.id === 95) {
		if (id) {
			channel.name = `Recommended for ${firstName || 'you'}`;
			channel.description = 'Loans we think you\'ll love based on your lending history.';
		} else {
			channel.name = 'Recommended by others';
			channel.description = 'Log in for personalized recommendations.';
		}
	}
	return channel;
}

// Query for getting the current featured loan channel id setting
export const featuredLoanHeroQuery = gql`query featuredLoanHero {
	general {
		uiConfigSetting(key: "featured_loan_channel") {
			key
			value
		}
	}
}`;

// Extract loan channel ids and loans query from featuredLoanHeroQuery result data
function parseFeaturedLoanData(data) {
	// use setting based id if available
	const featuredChannelIdSetting = data?.general?.uiConfigSetting?.value ?? '';
	const loanChannelIds = featuredChannelIdSetting
		? [parseInt(featuredChannelIdSetting, 10)] : fallbackCategoryIds;
	return { loanChannelIds, loansQuery: featuredLoansQuery };
}

/**
 * Get the current Featured Loan Channel setting asynchronously.
 *
 * @param  {ApolloClient} client     the client to make the request to
 * @return {Object}                  { loanChannelIds, loansQuery }
 */
export function getFeaturedLoanChannelAsync(client) {
	// get featured loan channel from ui setting
	return client.query({
		query: featuredLoanHeroQuery
	}).then(({ data }) => {
		return parseFeaturedLoanData(data);
	});
}

/**
 * Get the current Featured Loan Channel setting synchronously.
 *
 * @param  {ApolloClient} client     the client to read the data from
 * @return {Object}                  { loanChannelIds, loansQuery }
 */
export function getFeaturedLoanChannelCached(client) {
	try {
		// get setting driven featured loan channel
		const data = client.readQuery({
			query: featuredLoanHeroQuery,
		});
		return parseFeaturedLoanData(data);
	} catch (e) {
		logReadQueryError(e, 'FeatureHeroLoanWrapper featureLoanChannelSetting');
		return {};
	}
}

// Query for getting the current hero channel id from ML
export const heroChannelIdQuery = gql`query heroChannelId {
	ml {
		heroChannel(platform: marketplace) {
			id
		}
	}
}`;

// Extract loan channel ids and loans query from heroChannelIdQuery result data
function parseHeroChannelData(data) {
	// use ml heroChannel id if available
	const { id, __typename } = data?.ml?.heroChannel ?? {};
	const heroChannelId = parseInt(id, 10) || 0;
	const loanChannelIds = heroChannelId ? [heroChannelId] : fallbackCategoryIds;
	const loansQuery = __typename === 'RecLoanChannel' ? recommendedLoansQuery : featuredLoansQuery;
	return { loanChannelIds, loansQuery };
}

/**
 * Get the current Hero Channel id asynchronously.
 *
 * @param  {ApolloClient} client     the client to make the request to
 * @return {Object}                  { loanChannelIds, loansQuery }
 */
export function getHeroChannelAsync(client) {
	// get hero channel id query
	return client.query({
		query: heroChannelIdQuery
	}).then(({ data }) => {
		return parseHeroChannelData(data);
	});
}

/**
 * Get the current Hero Channel id synchronously.
 *
 * @param  {ApolloClient} client     the client to read the data from
 * @return {Object}                  { loanChannelIds, loansQuery }
 */
export function getHeroChannelCached(client) {
	try {
		// get hero channel id from chache if available
		const data = client.readQuery({
			query: heroChannelIdQuery
		});
		return parseHeroChannelData(data);
	} catch (e) {
		logReadQueryError(e, 'FeatureHeroLoanWrapper heroChannelId');
		return {};
	}
}

/**
 * Get the current selected category name
 * @param {Number} categoryId
 * @param {String} name
 * @return {String} category name
*/
export function getCategoryName(categoryId, name) {
	switch (categoryId) {
		case 5:
		case 52:
			return 'loans to women';
		case 96:
			return 'COVID-19 loans';
		case 93:
			return 'shelter loans';
		case 89:
			return 'arts loans';
		case 87:
			return 'agriculture loans';
		case 102:
			return 'technology loans';
		case 4:
			return 'education loans';
		case 25:
			return 'health loans';
		case 32:
			return 'loans to refugees and IDPs';
		default:
			// remove any text contained within square brackets, including the brackets
			return String(name).replace(/\s\[.*\]/g, '');
	}
}
