<template>
	<div class="borrower-info-wrapper">
		<borrower-info-header
			:country="country"
			:iso-code="isoCode"
			:state="state"
			:city="city"
			:name="name"
			:loan-id="loanId"
			@track-loan-card-interaction="trackInteraction"
		/>
		<borrower-info-body
			:use="use"
			:loan-id="loanId"
			@track-loan-card-interaction="trackInteraction"
		/>
	</div>
</template>

<script>
import BorrowerInfoHeader from '@/components/LoanCards/BorrowerInfo/BorrowerInfoHeader';
import BorrowerInfoBody from '@/components/LoanCards/BorrowerInfo/BorrowerInfoBody';

export default {
	name: 'BorrowerInfo',
	props: {
		use: {
			type: String,
			default: ''
		},
		loanId: {
			type: Number,
			default: null
		},
		name: {
			type: String,
			default: ''
		},
		country: {
			type: String,
			default: ''
		},
		isoCode: {
			type: String,
			default: ''
		},
		state: {
			type: String,
			default: ''
		},
		city: {
			type: String,
			default: ''
		},
	},
	components: {
		BorrowerInfoBody,
		BorrowerInfoHeader,
	},
	methods: {
		trackInteraction(args) {
			this.$emit('track-loan-card-interaction', args);
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.borrower-info-wrapper {
	text-align: center;
	margin-top: rem-calc(20);
	padding: 0 rem-calc(20);
	flex-grow: 1;
}
</style>
