/* eslint-disable import/prefer-default-export */
import teamsQuery from '@/graphql/query/teamsQuery.graphql';
import leaderboardsQuery from '@/graphql/query/leaderboardsQuery.graphql';
/**
* @param {Object} apollo
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
		console.log(result);
		return result.data?.community?.teams;
	} catch (e) {
		console.log('Fetching teams failed:', e.mesasge);
	}
}

export async function fetchLeaderboard(apollo, sortOption) {
	try {
		const result = await apollo.query({
			query: leaderboardsQuery,
			variables: {
				sortOption,
			},
			options: {
				limit: 10
			}
		});
		console.log(result);
		return result.data?.community?.teams;
	} catch (e) {
		console.log('Loading leaderboards failed:', e.message);
	}
}
