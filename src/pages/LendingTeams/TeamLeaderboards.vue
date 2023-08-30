<template>
	<div class="tw-col-span-12 md:tw-col-span-4">
		<h2 class="tw-text-h3">
			Team Leaderboards
		</h2>
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
			this.funded = leaderboards.amountFunded ?? {};
			this.members = leaderboards.newUsers ?? {};
		});
	},
};
</script>
