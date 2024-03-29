<template>
	<div class="tw-flex tw-flex-col lg:tw-flex-row tw-w-full tw-gap-1 lg:tw-gap-5 tw-mb-4 lg:tw-mb-4">
		<div class="lg:tw-basis-3/5 tw-flex tw-flex-col tw-gap-y-2">
			<div class="tw-flex tw-items-center tw-gap-2">
				<img
					v-if="teamImageUrl"
					class="tw-w-4 tw-h-4 lg:tw-w-8 lg:tw-h-8 tw-flex-none tw-rounded-sm"
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
					class="user-avatar"
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

			<kv-inline-activity-feed
				v-if="challengeActivity.length > 0"
				:activities="challengeActivity"
			/>
		</div>
	</div>
</template>

<script>
import KvProgressCampaign from '@/components/Kv/KvProgressCampaign';
import intervalToDuration from 'date-fns/intervalToDuration';
import SupportedByLenders from '@/components/BorrowerProfile/SupportedByLenders';
import KvUserAvatar from '~/@kiva/kv-components/vue/KvUserAvatar';
import KvInlineActivityFeed from '~/@kiva/kv-components/vue/KvInlineActivityFeed';

export default {
	name: 'ChallengeHeader',
	components: {
		KvProgressCampaign,
		KvUserAvatar,
		KvInlineActivityFeed,
		SupportedByLenders,
	},
	props: {
		challengeData: {
			type: Object,
			default: () => ({}),
		},
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
		challengeName() {
			return this.challengeData?.name ?? '';
		},
		challengeDescription() {
			return this.challengeData?.description ?? '';
		},
		authorName() {
			return this.challengeData?.descriptionAuthor?.name ?? '';
		},
		authorImageUrl() {
			return this.challengeData?.descriptionAuthor?.image?.url ?? '';
		},
		fundedAmount() {
			return this.challengeData?.participation?.values?.reduce((sum, value) => {
				return sum + (value?.amountLent ?? 0);
			}, 0) ?? 0;
		},
		totalAmount() {
			return this.challengeData?.targets?.values?.[0]?.targetLendAmount ?? 0;
		},
		daysLeft() {
			const start = this.challengeData?.startDate ? new Date(this.challengeData?.startDate) : new Date();
			const end = this.challengeData?.endDate ? new Date(this.challengeData?.endDate) : new Date();
			return intervalToDuration({
				start,
				end,
			}).days;
		},
		challengeActivity() {
			const activities = this.challengeData?.participation?.values ?? [];
			const data = [];

			activities
				// Show one activity item per lender with the amounts summed
				.forEach(activity => {
					const existing = data.find(a => a?.lender?.id === activity?.lender?.id);
					if (existing) {
						const existingAmount = parseFloat(existing?.amountLent ?? 0);
						const activityAmount = parseFloat(activity?.amountLent ?? 0);
						existing.amountLent = existingAmount + activityAmount;
					} else {
						// Shallow copy the read-only object so we can sum the amountLent
						data.push({ ...activity });
					}
				});

			return data;
		},
		participants() {
			return this.challengeData?.participation ?? {};
		}
	},
};
</script>

<style scoped lang="postcss">
.user-avatar {
	@apply tw-w-4;
}

.user-avatar >>> img {
	@apply tw-w-4 tw-h-4;
}
</style>
