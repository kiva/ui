<template>
	<www-page>
		<div class="row borrower-profile-wrapper">
			<div class="small-12 medium-4 columns">
				<!-- TODO:
				- tracking info needs to be updated -->
				<!-- Borrower photo -->
				<loan-card-image
					:loan-id="loan.id"
					:name="loan.name"
					:retina-image-url="loan.image.retina"
					:standard-image-url="loan.image.default"
					:is-visitor="true"
					v-kv-track-event="['basket', 'basket-loan-profile', 'basket-loan-profile']"
					:open-in-new-tab="true"
					:use-default-styles="false"
				/>
			</div>
			<div class="small-12 medium-8 columns">
				<!-- Funded State -->
				<h2 class="strong funding-status">100% {{ loan.status }}</h2>
				<!-- Total funded/loan amount -->
				<div class="loan-total-text">
					Loan total: ${{ loan.loanFundraisingInfo.fundedAmount | numeral('0,0') }}
				</div>
				<!-- Borrower Name -->
				<h1> {{ loan.name }} </h1>
				<!-- Borrower location -->
				<div>
					<span class="country-image">
						<kv-flag :country="`${ loan.geocode.country.isoCode }`" />
					</span>
					<span class="loan-location-text">
						{{ loan.geocode.city }}, {{ loan.geocode.state }}, {{ loan.geocode.country.name }}
						/ {{ loan.sector.name }}
					</span>

					<div>
						<!-- Link to see full borrower profile in old stack -->
						<router-link :to="`/lend/${loan.id}`">See full borrower profile</router-link>
					</div>
				</div>
			</div>
		</div>
		<!-- Loans you might light section -->
		<div class="row lyml-wrapper">
			<div class="small-12 columns">
				<hr>
				<h3 class="lyml-text text-center">
					{{ loan.name }}'s loan has already fully funded, but these
					other deserving borrowers need your support to cross the finish line
				</h3>
				<l-y-m-l
					:basketed-loans="itemsInBasket"
					:target-loan="loan"
				/>
			</div>
		</div>
		<hr>
		<div class='row'>
			<div class="small-12 columns text-center">
				<!-- Loan use -->
				<h2 class="loan-use-text">
					A loan of ${{ loan.loanFundraisingInfo.fundedAmount | numeral('0,0') }} helps {{ loan.use }}
				</h2>
			</div>
		</div>
		<hr>
		<div class="row">
			<div class="small-12 columns loan-description-wrapper">
				<h2 class="loan-description-heading-text"> {{ loan.name }}'s story </h2>
				<!-- Loan description -->
				<div v-html="loan.description"></div>
			</div>
		</div>
	</www-page>
</template>

<script>
import cookieStore from '@/util/cookieStore';
import _get from 'lodash/get';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvFlag from '@/components/Kv/KvFlag';
import fundedBorrowerProfile from '@/graphql/query/fundedBorrowerProfile.graphql';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import LYML from '@/components/LoansYouMightLike/lymlContainer';

export default {
	components: {
		WwwPage,
		LoanCardImage,
		KvFlag,
		LYML
	},
	inject: ['apollo'],
	data() {
		return {
			loan: () => {},
			itemsInBasket: []
		};
	},
	apollo: {
		preFetch(config, client, args) {
			const fundedLoanId = _get(args, 'route.params.id');
			return client.query({
				query: fundedBorrowerProfile,
				variables: {
					id: fundedLoanId,
					basketId: cookieStore.get('kvbskt'),
				}
			});
		},
	},
	created() {
		// Read the page data from the cache
		const loanData = this.apollo.readQuery({
			query: fundedBorrowerProfile,
			variables: {
				id: this.$route.params.id,
				basketId: cookieStore.get('kvbskt'),
			},
		});

		this.loan = _get(loanData, 'lend.loan');
		this.itemsInBasket = _get(loanData, 'shop.basket.items.values');

		this.apollo.watchQuery({
			query: fundedBorrowerProfile,
			variables: {
				id: this.$route.params.id,
				basketId: cookieStore.get('kvbskt'),
			}
		}).subscribe({
			next: ({ data }) => {
				console.log(data);
				this.itemsInBasket = _get(data, 'shop.basket.items.values');
			},
		});
	}
};
</script>

<style lang="scss">
@import 'settings';

.borrower-profile-wrapper {
	padding-top: 1rem;
}

.funding-status {
	color: $kiva-green;
	font-size: 2.5rem;
}

.loan-use-text,
.loan-total-text,
.loan-description-heading-text,
.loan-location-text,
.lyml-text {
	font-weight: $button-font-weight;
}

.loan-description-wrapper {
	padding-bottom: 1.25rem;
}

.lyml-wrapper {
	padding: 1.25rem 0;
}

</style>
