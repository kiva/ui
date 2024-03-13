<template>
	<div>
		<kv-progress-campaign
			:funded-amount="fundedAmount"
			:total-amount="totalAmount"
			:days-left="daysLeft"
		/>
	</div>
</template>

<script>
import KvProgressCampaign from '@/components/Kv/KvProgressCampaign';
import intervalToDuration from 'date-fns/intervalToDuration';

export default {
	name: 'ChallengeHeader',
	components: {
		KvProgressCampaign
	},
	props: {
		challengeData: {
			type: Object,
			default: () => ({}),
		},
	},
	computed: {
		fundedAmount() {
			return this.challengeData?.amountGoal ?? 0;
		},
		totalAmount() {
			return this.challengeData?.participatoin?.amountLent ?? 0;
		},
		daysLeft() {
			return intervalToDuration({
				start: this.challengeData?.endDate ?? new Date(),
				end: this.challengeData?.endDate ?? new Date(),
			}).days;
		},
	}
};
</script>
