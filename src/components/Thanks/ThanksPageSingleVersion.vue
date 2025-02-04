<template>
	<div class="tw-bg-eco-green-1 tw-p-3 md:tw-py-4 tw-flex tw-flex-col tw-gap-2.5">
		<div class="content-box tw-mx-auto">
			<OptInModule
				v-if="showOptInModule"
				:loans="loans"
				:is-guest="isGuest"
				:number-of-badges="numberOfBadges"
				:only-donations="onlyDonations"
				class="print:tw-hidden tw-mb-2.5"
			/>
			<div
				v-if="!isGuest"
			>
				<LoanComment
					v-for="loan in loans"
					:key="loan.id"
					:loan="loan"
					class="tw-mb-2.5"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import LoanComment from '#src/components/Thanks/SingleVersion/LoanComment';
import OptInModule from '#src/components/Thanks/MyKiva/OptInModule';

import {
	computed,
} from 'vue';

const props = defineProps({
	isGuest: {
		type: Boolean,
		default: true,
	},
	isOptedIn: {
		type: Boolean,
		default: false,
	},
	loans: {
		type: Array,
		default: () => ([]),
	},
	receipt: {
		type: Object,
		default: () => ({}),
	},
	monthlyDonationAmount: {
		type: String,
		default: '',
	},
	/**
	 * [{
	 *   achievementId: string,
	 * }]
	 */
	badgesAchieved: {
		type: Array,
		default: () => ([]),
	},
});

const numberOfBadges = computed(() => (props.badgesAchieved.length || 1));

const showOptInModule = computed(() => !props.isOptedIn);

const onlyDonations = computed(() => (
	(props.receipt && props.receipt?.totals?.itemTotal === props.receipt?.totals?.donationTotal)
	|| props.monthlyDonationAmount?.length
));

</script>

<style lang="postcss" scoped>
.content-box {
	max-width: 620px;
}
</style>
