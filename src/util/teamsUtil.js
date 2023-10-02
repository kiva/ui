import teamsQuery from '@/graphql/query/teamsQuery.graphql';
import leaderboardsQuery from '@/graphql/query/leaderboardsQuery.graphql';

export const teamCategories = [
	{
		value: '',
		label: '-- All Categories --',
	},
	{
		value: 'AlumniGroups',
		label: 'Alumni Groups',
	},
	{
		value: 'Businesses',
		label: 'Businesses',
	},
	{
		value: 'BusinessesInternalGroups',
		label: 'Business - Internal Groups',
	},
	{
		value: 'Clubs',
		label: 'Clubs',
	},
	{
		value: 'CollegesUniversities',
		label: 'Colleges/Universities',
	},
	{
		value: 'CommonInterest',
		label: 'Common Interest',
	},
	{
		value: 'Events',
		label: 'Events',
	},
	{
		value: 'Families',
		label: 'Families',
	},
	{
		value: 'FieldPartnerFans',
		label: 'Field Partner Fans',
	},
	{
		value: 'Friends',
		label: 'Friends',
	},
	{
		value: 'LocalArea',
		label: 'Local Area',
	},
	{
		value: 'Memorials',
		label: 'Memorials',
	},
	{
		value: 'ReligiousCongregations',
		label: 'Religious Congregations',
	},
	{
		value: 'Schools',
		label: 'Schools',
	},
	{
		value: 'SportsGroups',
		label: 'Sports Groups',
	},
	{
		value: 'YouthGroups',
		label: 'Youth Groups',
	},
	{
		value: 'Other',
		label: 'Other',
	}
];

export function teamCategoryFriendlyName(categoryValue) {
	return teamCategories.find(category => category.value === categoryValue)?.label;
}

/**
* @param {Object} apollo, sortOption, category, membershipType, queryString, offset, limit
*/
export async function fetchTeams(apollo, sortOption, category, membershipType, queryString, offset, limit) {
	try {
		const result = await apollo.query({
			query: teamsQuery,
			variables: {
				sortOption: sortOption || undefined,
				category: category || undefined,
				membershipType: membershipType || undefined,
				queryString: queryString || undefined,
				offset: offset || 0,
				limit: limit || undefined,
			},

		});
		return result.data?.community?.teams;
	} catch (e) {
		console.log('Fetching teams failed:', e.message);
	}
}

export async function fetchLeaderboard(apollo, category) {
	try {
		const result = await apollo.query({
			query: leaderboardsQuery,
			variables: {
				category: category || undefined,
			},
		});
		return result.data?.community?.leaderboards;
	} catch (e) {
		console.log('Loading leaderboards failed:', e.message);
	}
}
