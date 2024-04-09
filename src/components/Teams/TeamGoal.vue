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
				<div class="tw-flex tw-items-center">
					<div class="tw-hidden lg:tw-flex tw-shrink-0">
						<img
							v-for="(lender, i) in participationLendersDisplayed"
							:key="lender.id"
							:src="lender.image.url"
							alt="Lender photo"
							class="
								data-hj-suppress
								tw-inline-block
								tw-w-4
								tw-h-4
								tw-rounded-full
								tw-overflow-hidden
								tw-border
								tw-border-white
								tw-object-fill
								tw-relative
							"
							:class="{ 'tw--ml-2': i > 0, 'tw-border-gray-200': lender.isLegacyPlaceholder }"
							:style="{ 'z-index': participationLendersDisplayed.length - i }"
						>
					</div>
					<span class="tw-whitespace-nowrap tw-text-ellipsis tw-overflow-hidden lg:tw-px-1">
						{{ participationTotalCount }} members participating
					</span>
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
import TeamInfoFromId from '@/graphql/query/teamInfoFromId.graphql';
import intervalToDuration from 'date-fns/intervalToDuration';
import teamNoImage from '@/assets/images/team_s135.png';
import teamGoalInfo from '@/plugins/team-goal-mixin';
import { isLegacyPlaceholderAvatar } from '@/util/imageUtils';
import KvProgressCampaign from '@/components/Kv/KvProgressCampaign';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

export default {
	name: 'TeamGoal',
	mixins: [teamGoalInfo],
	inject: ['apollo'],
	components: {
		KvButton,
		KvLoadingPlaceholder,
		KvProgressCampaign,
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
		participationTotalCount() {
			return this.goal?.participation?.totalCount ?? 0;
		},
		participationLendersDisplayed() {
			return (this.goal?.participation?.values ?? []).map(p => ({
				...p.lender,
				isLegacyPlaceholder: isLegacyPlaceholderAvatar(p.lender.image?.url.split('/').pop()),
			})).filter(l => l.image).slice(0, 4); // Ensure image is defined and take first 4
		},
		fundedAmount() {
			return this.goal?.participation?.values?.reduce((sum, value) => {
				return sum + (value?.amountLent ?? 0);
			}, 0) ?? 0;
		},
		totalAmount() {
			return this.goal?.targets?.values?.[0]?.targetLendAmount ?? 0;
		},
		daysLeft() {
			const start = this.goal?.startDate ? new Date(this.goal?.startDate) : new Date();
			const end = this.goal?.endDate ? new Date(this.goal?.endDate) : new Date();
			return intervalToDuration({
				start,
				end,
			}).days;
		},
		challengeDescription() {
			return this.goal?.description ?? '';
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
