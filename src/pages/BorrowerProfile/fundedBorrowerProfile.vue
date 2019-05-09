<template>
	<www-page>
		<!-- Borrower photo -->
		<div class="row">
			<div class="small-6 columns">
				<!-- TODO:
				- tracking info needs to be updated
				- need to fold back in logged in state :is-visitor="isVisitor" -->
				<loan-card-image
					:loan-id="loan.id"
					:name="loan.name"
					:retina-image-url="loan.image.retina"
					:standard-image-url="loan.image.default"
					v-kv-track-event="['basket', 'basket-loan-profile', 'basket-loan-profile']"
					:open-in-new-tab="true"
					:use-default-styles="false"
				/>
			</div>
		</div>
		<!-- Borrower Name -->
		<div class='row'> {{ loan.name }} </div>
		<!-- Total funded/loan amount -->
		<div class='row'> {{ loan.loanFundraisingInfo.fundedAmount }}</div>
		<!-- Funded State/ FUNDED! -->
		<div class='row'> {{ loan.status }}</div>
		<!-- Borrower location -->
		<div class='row'> {{ loan.geocode.city }}</div>
		<!-- Loan use -->
		<div class='row'> {{ loan.use }} </div>
		<!-- Loan description -->
		<div class='row' v-html="loan.description"></div>
		<!-- Link to see full borrower profile in old stack. Need borrower ID here -->
		<div class='row'>
			<router-link :to="`/lend/${loan.id}`">Full Borrower Profile</router-link>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import _get from 'lodash/get';
import fundedBorrowerProfile from '@/graphql/query/fundedBorrowerProfile.graphql';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';

export default {
	components: {
		WwwPage,
		LoanCardImage,
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
