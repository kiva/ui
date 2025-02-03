<template>
	<div
		ref="tyUnifiedVersion"
		class="tw-bg-eco-green-1 tw-p-3 md:tw-py-4 tw-flex tw-flex-col tw-gap-2.5"
	>
		<OptInModule
			v-if="showOptInModule"
			:loans="loans"
			:is-guest="isGuest"
			:number-of-badges="numberOfBadges"
			:only-donations="onlyDonations"
			class="print:tw-hidden"
		/>
	</div>
</template>

<script setup>
import {
	computed,
} from 'vue';
import OptInModule from './MyKiva/OptInModule';

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
