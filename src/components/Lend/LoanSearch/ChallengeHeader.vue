<template>
	<div class="tw-flex tw-flex-col lg:tw-flex-row tw-w-full tw-gap-1 lg:tw-gap-5 tw-mb-4 lg:tw-mb-4">
		<div class="lg:tw-basis-3/5 tw-flex tw-flex-col tw-gap-y-2">
			<div class="tw-flex tw-items-center tw-gap-2">
				<img
					v-if="teamImageUrl"
					class="tw-w-4 tw-h-4 lg:tw-w-8 lg:tw-h-8 tw-flex-none tw-rounded-xs"
					:src="teamImageUrl"
				>
				<div>
					<h4
						v-if="teamName"
						class="tw-text-h4"
					>
						{{ teamName }} CHALLENGE:
					</h4>
					<h2
						v-if="challengeName"
						class="tw-text-h2"
					>
						{{ challengeName }}
					</h2>
				</div>
			</div>
			<p
				v-if="challengeDescription"
				class="tw-italic"
			>
				{{ challengeDescription }}
			</p>
			<div class="tw-flex tw-items-center tw-gap-1">
				<kv-user-avatar
					class="tw-w-4 tw-h-4"
					v-if="authorImageUrl"
					:lender-name="authorName"
					:lender-image-url="authorImageUrl"
					:is-small="true"
				/>
				<p
					v-if="authorName"
					class="tw-text-h4"
				>
					{{ authorName }}, TEAM CAPTAIN
				</p>
			</div>
		</div>
		<div class="lg:tw-basis-2/5 tw-mt-1 md:tw-mt-0 tw-min-w-0">
			<div class="tw-bg-white tw-px-3 tw-pt-2 tw-pb-1 tw-rounded tw-shadow-lg tw-mx-1">
				<kv-progress-campaign
					:funded-amount="fundedAmount"
					:total-amount="totalAmount"
					:days-left="daysLeft"
				/>
				<supported-by-lenders
					class="tw-mt-1.5"
					:participants="participants"
					is-challenge
				/>
			</div>

			<div class="tw-relative tw-flex tw-items-center tw-px-0">
				<div class="tw-absolute tw-right-0 tw-w-4 md:tw-w-10 tw-h-8 tw--mr-0.5 loan-activity-overlay"></div>
				<kv-inline-activity-feed
					v-if="challengeActivity.length > 0"
					:activities="challengeActivity"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import teamGoalInfo from '#src/plugins/team-goal-mixin';
import KvProgressCampaign from '#src/components/Kv/KvProgressCampaign';
import SupportedByLenders from '#src/components/BorrowerProfile/SupportedByLenders';
import { KvUserAvatar, KvInlineActivityFeed } from '@kiva/kv-components';

export default {
	name: 'ChallengeHeader',
	mixins: [teamGoalInfo],
	components: {
		KvProgressCampaign,
		KvUserAvatar,
		KvInlineActivityFeed,
		SupportedByLenders,
	},
	props: {
		teamData: {
			type: Object,
			default: () => ({}),
		},
	},
	computed: {
		teamName() {
			return this.teamData?.name ?? '';
		},
		teamImageUrl() {
			return this.teamData?.image?.url ?? '';
		},
	},
	mounted() {
		this.$kvTrackEvent('teams', 'view challenge', this.teamData?.name ?? '');
	}
};
</script>

<style scoped lang="postcss">

.loan-activity-overlay {
	background: linear-gradient(90deg, rgb(245 245 245 / 0%) 0%, rgb(245 245 245 / 100%) 70%);
}
</style>
