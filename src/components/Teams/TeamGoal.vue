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
				{{ challengeDescription }}
			</p>
			<div class="tw-mt-1 tw-mb-2">
				<kv-progress-campaign
					:funded-amount="fundedAmount"
					:total-amount="totalAmount"
					:days-left="daysLeft"
				/>
			</div>

			<div class="tw-flex tw-flex-row tw-justify-between tw-mt-1 tw-items-center tw-text-secondary">
				<div>
					<div class="tw-hidden lg:tw-flex tw-shrink-0">
						<supported-by-lenders
							class="tw-mt-1.5"
							:participants="participants"
							is-challenge
						/>
					</div>
				</div>
				<kv-button
					v-kv-track-event="[
						'teams',
						'click',
						'View',
						teamName
					]"
					:to="`/lend/filter?team=${teamPublicId}`" variant="caution"
				>
					View
				</kv-button>
			</div>
		</div>
	</div>
</template>

<script>
import TeamInfoFromId from '#src/graphql/query/teamInfoFromId.graphql';
import teamNoImage from '#src/assets/images/team_s135.png';
import teamGoalInfo from '#src/plugins/team-goal-mixin';
import KvProgressCampaign from '#src/components/Kv/KvProgressCampaign';
import SupportedByLenders from '#src/components/BorrowerProfile/SupportedByLenders';
import KvButton from '@kiva/kv-components/vue/KvButton';
import KvLoadingPlaceholder from '@kiva/kv-components/vue/KvLoadingPlaceholder';

export default {
	name: 'TeamGoal',
	mixins: [teamGoalInfo],
	inject: ['apollo'],
	components: {
		KvButton,
		KvLoadingPlaceholder,
		KvProgressCampaign,
		SupportedByLenders,
	},
	data() {
		return {
			isLoading: true,
			loanBecause: '',
			teamNoImage,
			teamImageUrl: '',
			teamPublicId: '',
			teamName: ''
		};
	},
	computed: {
		teamId() {
			return this.goal?.teamId ?? null;
		},
		teamImage() {
			return this.teamImageUrl || this.teamNoImage;
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
				this.teamName = data.community?.team?.name ?? '';
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
