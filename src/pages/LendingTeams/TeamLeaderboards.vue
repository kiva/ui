<template>
	<div class="tw-col-span-12 md:tw-col-span-4">
		<div class="tw-text-h4 tw-mt-4">
			TEAM LEADERBOARDS
		</div>
		<team-leaderboard board-type="overallLoanedAmount" :board-teams="funded" />
		<team-leaderboard board-type="memberCount" :board-teams="members" />
	</div>
</template>

<script>

import TeamLeaderboard from './TeamLeaderboard';
import { fetchLeaderboard } from '../../util/teamsUtil';

export default {
	name: 'TeamLeaderboards',
	components: {
		TeamLeaderboard
	},
	inject: ['apollo'],
	data() {
		return {
			funded: {},
			members: {},
		};
	},
	mounted() {
		fetchLeaderboard(this.apollo).then(leaderboards => {
			console.log(leaderboards);
			this.funded = leaderboards.amountFunded ?? {};
			this.members = leaderboards.newUsers ?? {};
		});
	},
};
</script>
