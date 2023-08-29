import teamsQuery from '@/graphql/query/teamsQuery.graphql';
import leaderboardsQuery from '@/graphql/query/leaderboardsQuery.graphql';

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

export async function fetchLeaderboard(apollo) {
	try {
		const result = await apollo.query({
			query: leaderboardsQuery,
		});
		console.log(result.data?.community?.leaderboards);
		return result.data?.community?.leaderboards;
	} catch (e) {
		console.log('Loading leaderboards failed:', e.message);
	}
}
