<template>
	<div class="column column-block">
		<borrower-info
			:id="loan.id"
			:name="loan.name"
			:amount="loan.loanAmount"
			:use="loan.use"
			:country="loan.geocode.country.name" />

		<matching-text :matching-text="loan.matchingText" />
	</div>
</template>

<script>
import BorrowerInfo from '@/components/LoanCards/BorrowerInfo';
import MatchingText from '@/components/LoanCards/MatchingText';

export default {
	components: {
		BorrowerInfo,
		MatchingText,
	},
	props: {
		loan: {
			type: Object,
			default: () => {}
		}
	},
};
</script>

<style>

</style>
