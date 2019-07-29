<template>
	<div class="borrower-info-wrapper">
		<borrower-info-header
			:country="country"
			:name="name"
			:loan-id="loanId"
			@track-loan-card-interaction="trackInteraction"
		/>
		<borrower-info-body
			:amount="amount"
			:status="status"
			:borrower-count="borrowerCount"
			:use="use"
			:name="name"
			:loan-id="loanId"
			@track-loan-card-interaction="trackInteraction"
		/>
	</div>
</template>

<script>
import BorrowerInfoHeader from '@/components/LoanCards/BorrowerInfo/BorrowerInfoHeader';
import BorrowerInfoBody from '@/components/LoanCards/BorrowerInfo/BorrowerInfoBody';

export default {
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
		amount: {
			type: String,
			default: ''
		},
		status: {
			type: String,
			default: ''
		},
		borrowerCount: {
			type: Number,
			default: 1
		},
		loanLength: {
			type: Number,
			default: null
		},
		/*
		activeSort: {
			type: String,
			default: 'Popularity'
		},
		*/
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

<style lang="scss">
@import 'settings';

.borrower-info-wrapper {
	text-align: center;
	margin-top: rem-calc(20);
	padding: 0 rem-calc(20);
	flex-grow: 1;
}
</style>
