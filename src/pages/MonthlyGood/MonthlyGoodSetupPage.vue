<template>
	<monthly-good-setup-page-control
		v-if="showMGSetupControl"
		:amount="amount"
		:category="category"
		:onetime="onetime"
		:source="source"
	/>
</template>

<script>
import MonthlyGoodSetupPageControl from '@/pages/MonthlyGood/MonthlyGoodSetupPageControl';
// Variant template driven by experiment
// import MonthlyGoodSetupPageVariant from '@/pages/MonthlyGood/MonthlyGoodSetupPageVariant';

export default {
	props: {
		amount: {
			type: Number,
			default: 25
		},
		category: {
			type: String,
			default: 'default'
		},
		onetime: {
			type: String,
			default: 'false'
		},
		source: {
			type: String,
			default: ''
		}
	},
	components: {
		MonthlyGoodSetupPageControl,
	},
	data() {
		return {
			showMGSetupControl: true
		};
	},
};

</script>
