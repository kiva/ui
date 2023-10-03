<template>
	<div class="tw-col-span-12 md:tw-col-span-4">
		<h3 class="tw-mb-0">
			Team Leaderboards
		</h3>
		<p class="tw-text-small  tw-mb-2">
			For {{ teamCategory ? teamCategoryFriendlyName(teamCategory) : 'all' }} teams
		</p>
		<team-leaderboard
			board-type="overallLoanedAmount"
			:board-teams="funded"
			:team-category="teamCategory"
			:is-loading="isLoading"
		/>
		<team-leaderboard
			board-type="memberCount"
			:board-teams="members"
			:team-category="teamCategory"
			:is-loading="isLoading"
		/>
	</div>
</template>

<script>

import TeamLeaderboard from './TeamLeaderboard';
import { fetchLeaderboard, teamCategoryFriendlyName } from '../../util/teamsUtil';

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
			teamCategory: '',
			isLoading: true,
		};
	},
	watch: {
		'$route.query.teamCategory': {
			handler(teamCategory) {
				if (teamCategory !== '') {
					this.teamCategory = teamCategory;
					this.getLeaderboards();
				}
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		getLeaderboards() {
			this.isLoading = true;
			fetchLeaderboard(this.apollo, this.teamCategory)
				.then(leaderboards => {
					this.funded = leaderboards?.amountFunded ?? {};
					this.members = leaderboards?.newUsers ?? {};
				})
				.finally(() => {
					this.isLoading = false;
				});
		},
		teamCategoryFriendlyName
	},
	mounted() {
		this.getLeaderboards();
	},
};
</script>
