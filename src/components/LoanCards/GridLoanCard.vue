<template>
	<div class="column column-block">
		<borrower-info
			:id="loan.id"
			:name="loan.name"
			:amount="loan.loanAmount"
			:use="loan.use"
			:country="loan.geocode.country.name" />
		<action-button />
		<matching-text :matching-text="loan.matchingText" />
	</div>
</template>

<script>
import BorrowerInfo from '@/components/LoanCards/BorrowerInfo';
import MatchingText from '@/components/LoanCards/MatchingText';
import ActionButton from '@/components/LoanCards/ActionButton';

export default {
	components: {
		BorrowerInfo,
		MatchingText,
		ActionButton,
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
