<template>
	<www-page>
		<div class='row'>
			<!-- Borrower photo -->
			<!-- Borrower Name -->
			<p> {{ loan.name }} </p>
			<!-- Total funded/loan amount -->
			<p> {{ loan.use }}</p>
			<p> {{ loan.description }}</p>
			<!-- Funded State/ FUNDED! -->
			<p> {{ loan.status }}</p>
			<!-- Borrower location -->
			<p> {{ loan.geocode.city }}</p>
		</div>
		<div class='row'>
			<!-- Loan use statement -->
		</div>
		<div class='row'>
			<!-- Borrower story -->
		</div>
		<!-- Link to see full borrower profile in old stack. Need borrower ID here -->
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import _get from 'lodash/get';
import fundedBorrowerProfile from '@/graphql/query/fundedBorrowerProfile.graphql';

export default {
	components: {
		WwwPage
	},
	inject: ['apollo'],
	data() {
		return {
			loan: () => {}
		};
	},
	apollo: {
		preFetch(config, client, args) {
			const fundedLoanId = _get(args, 'route.params.id');
			return client.query({
				query: fundedBorrowerProfile,
				variables: {
					id: fundedLoanId
				}
			});
		},
	},
	created() {
		// Read the page data from the cache
		const loanData = this.apollo.readQuery({
			query: fundedBorrowerProfile,
			variables: {
				id: this.$route.params.id
			},
		});

		this.loan = _get(loanData, 'lend.loan');
		console.log('loanData', this.loan);
	}
};
</script>

<style lang="scss">
@import 'settings';

</style>
