import TeamInfoFromId from '@/graphql/query/teamInfoFromId.graphql';
import joinTeam from '@/graphql/mutation/joinTeam.graphql';
import myTeamsQuery from '@/graphql/query/myTeams.graphql';
import updateLoanReservationTeam from '@/graphql/mutation/updateLoanReservationTeam.graphql';

/**
 * Fetch team information + membership status by team id
 * @param {Object} apollo - apollo client
 * @param {Number} teamId - team id
 * @returns {Promise}
 */
export function fetchTeamInfoById(apollo, teamId) {
	return apollo.query({
		query: TeamInfoFromId,
		variables: {
			team_id: teamId,
			team_ids: [teamId],
		}
	});
}

/** Fetch my teams
 * @param {Object} apollo - apollo client
 * @returns {Promise}
 */
export async function fetchMyTeams(apollo) {
	return apollo.query({
		fetchPolicy: 'network-only',
		query: myTeamsQuery
	});
}

/**
 * Add Team to loan reservations
 * @param {Object} apollo - apollo client
 * @param {Array} loanIds - loan ids
 * @param {Number} teamId - team id
 * @returns {Promise}
 */
export function addTeamToLoans(apollo, loanIds, teamId) {
	if (!loanIds || !loanIds.length || !teamId) {
		return Promise.reject('No loan ids or team id provided');
	}

	const loans = [];
	loanIds.forEach((loanId, index) => {
		loans[index] = this.apollo.mutate({
			mutation: updateLoanReservationTeam,
			variables: {
				teamId,
				loanid: loanId
			}
		});
	});

	return Promise.all(loans);
}

/**
 * Join a specific team, with optional promo state bypass
 * - User must be logged in (UserId provided by apollo)
 * @param {Object} apollo - apollo client
 * @param {Number} teamId - team id
 * @param {Number} promoId - promo id
 * @returns {Promise}
 */
export function joinTeamMutation(apollo, teamId, promoId = null) {
	if (!teamId) {
		return Promise.reject('No team id provided');
	}

	return apollo.mutate({
		mutation: joinTeam,
		variables: {
			team_id: teamId,
			promo_id: promoId
		}
	});
}

/**
 * Handle team join and loan reservation updates for a promo campaign
 * @param {Object} apollo - apollo client
 * @param {Number} teamId - team id
 * @param {Number} promoId - promo id
 * @param {Array} loanIds - ids for loans to update
 */
export async function joinTeamAndReserveLoans(apollo, teamId, promoId, loanIds) {
	// attempt to join team
	await joinTeamMutation(apollo, teamId, promoId).then(joinTeamResult => {
		console.log(joinTeamResult);
	}).catch(error => {
		return Promise.reject(error);
	});

	// Verify team membership
	await fetchMyTeams(apollo).then(myTeamsResult => {
		console.log(myTeamsResult);
	}).catch(error => {
		return Promise.reject(error);
	});

	// if successful, update loan reservations
	await addTeamToLoans(apollo, loanIds, teamId).then(addTeamResult => {
		console.log(addTeamResult);
	}).catch(error => {
		return Promise.reject(error);
	});

	return Promise.resolve({ success: true, message: 'Team joined and loans reserved' });
}
