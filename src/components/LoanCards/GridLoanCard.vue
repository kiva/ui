<template>
	<div class="column column-block">
		<BorrowerInfo
			:id="loan.id"
			:name="loan.name"
			:amount="loan.loanAmount"
			:use="loan.use"
			:country="loan.geocode.country.name" />
	</div>
</template>

<script>
import BorrowerInfo from '@/components/LoanCards/BorrowerInfo';

export default {
	components: {
		BorrowerInfo,
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
