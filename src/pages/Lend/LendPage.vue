<template>
	<www-page>
		<div class="row">
			<div class="small-12 columns heading-region">
				<h1>Make a loan, change a life</h1>
				<p class="small-12 xlarge-9">Each Kiva loan helps people build a better
				future for themselves and their families.</p>
			</div>
			<div class="loanCardGroup row small-up-1 large-up-2 xxlarge-up-3">
				<GridLoanCard :loan="loan" v-for="loan in loans" :key="loan.id" />
			</div>
		</div>
	</www-page>
</template>

<script>
import LoanData from '@/pages/Lend/Loans.json';
import WwwPage from '@/components/WwwFrame/WwwPage';
import GridLoanCard from '@/components/LoanCards/GridLoanCard';

export default {
	components: {
		WwwPage,
		GridLoanCard,
	},
	metaInfo: {
		title: 'Lend page'
	},
	props: {
		loans: {
			type: Array,
			default: () => LoanData.data.loans.values
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.heading-region {
    margin-top: 1.25rem;
}

</style>
