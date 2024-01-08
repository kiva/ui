<template>
	<div
		class="tw-bg-primary tw-rounded tw-p-2 tw-drop-shadow-lg"
	>
		<!-- Loading template -->
		<div v-if="isLoading">
			<div class="tw-flex tw-flex-row">
				<kv-loading-placeholder class="tw-mr-2" :style="{width: '64px', height: '64px'}" />
				<kv-loading-placeholder :style="{width: 60 + (Math.random() * 40) + '%', height: '64px'}" />
			</div>
			<p class="tw-mt-1">
				<kv-loading-placeholder :style="{width: 50 + (Math.random() * 50) + '%', height: '10px'}" />
			</p>
			<div class="tw-mt-1">
				<kv-loading-placeholder :style="{width: '100%', height: '24px'}" />
			</div>
			<div class="tw-mt-1">
				<kv-loading-placeholder :style="{width: '100%', height: '38px'}" />
			</div>
		</div>
		<!-- Content template -->
		<div v-else>
			<div class="tw-flex tw-flex-row tw-items-center">
				<img
					class="tw-w-8 tw-h-8 tw-flex-none tw-rounded-sm tw-mr-2"
					:src="teamImage"
				>
				<h3>{{ goal.name }}</h3>
			</div>
			<p class="tw-line-clamp-1 tw-mt-1">
				{{ loanBecause }}
			</p>
			<div class="tw-mt-1 tw-flex tw-justify-between">
				<strong>{{ daysRemaining }} days remaining</strong>
				<strong>{{ loansFunded }}/{{ totalLoans }} loans funded</strong>
			</div>
			<div class="tw-mt-1">
				<kv-progress-bar
					:value="percentageFunded"
					class="tw-w-full"
				/>
			</div>

			<div class="tw-flex tw-flex-row tw-justify-between tw-mt-1 tw-items-center tw-text-secondary">
				<span>{{ membersParticipating }} members participating</span>
				<kv-button :to="`/team/challenge/${teamPublicId}`" variant="caution">
					View
				</kv-button>
			</div>
		</div>
	</div>
</template>

<script>
import TeamInfoFromId from '@/graphql/query/teamInfoFromId.graphql';
import teamNoImage from '@/assets/images/team_s135.png';
import teamGoalInfo from '@/plugins/team-goal-mixin';
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

export default {
	name: 'TeamGoal',
	mixins: [teamGoalInfo],
	inject: ['apollo'],
	components: {
		KvButton,
		KvLoadingPlaceholder,
		KvProgressBar,
	},
	data() {
		return {
			isLoading: true,
			loanBecause: '',
			teamNoImage,
			teamImageUrl: '',
			teamPublicId: '',
		};
	},
	computed: {
		teamId() {
			return this.goal?.teamId ?? null;
		},
		teamImage() {
			return this.teamImageUrl || this.teamNoImage;
		},
		membersParticipating() {
			return this.goal?.participation?.totalCount ?? 0;
		},
	},
	methods: {
		fetchTeamData() {
			this.apollo.query({
				query: TeamInfoFromId,
				variables: {
					team_id: this.teamId,
				}
			}).then(({ data }) => {
				this.loanBecause = data.community?.team?.loanBecause ?? '';
				this.teamImageUrl = data.community?.team?.image?.url ?? null;
				this.teamPublicId = data.community?.team?.teamPublicId ?? '';
			}).finally(() => {
				this.isLoading = false;
			});
		},
	},
	mounted() {
		this.fetchTeamData();
	},
};
</script>
