<template>
	<div class="column column-block">
		<BorrowerInfo
			:id="loan.id"
			:name="loan.name"
			:amount="loan.loanAmount"
			:use="loan.use"
			:country="loan.geocode.country.name" />

		<MatchingText />
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
