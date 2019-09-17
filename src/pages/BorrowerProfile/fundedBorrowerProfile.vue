<template>
	<www-page>
		<div v-if="typeof loan !== 'undefined'">
			<div class="row borrower-profile-wrapper">
				<div class="small-12 medium-4 columns">
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
					<h2
						class="strong funding-status"
						v-if="loan.status==='funded'"
					>
						100%
					</h2>
					<h2 class="strong funding-status">
						{{ loan.status }}
					</h2>
					<!-- Total funded/loan amount -->
					<div class="loan-total-text">
						Total loan: ${{ loan.loanFundraisingInfo.fundedAmount | numeral('0,0') }}
					</div>
					<!-- Borrower Name -->
					<h1> {{ loan.name }} </h1>
					<!-- Borrower location -->
					<div>
						<span class="country-image">
							<kv-flag :country="`${ loan.geocode.country.isoCode }`" :custom-height="14" />
						</span>
						<span class="loan-location-text">
							{{ loan.geocode.city }}, {{ loan.geocode.state }}, {{ loan.geocode.country.name }}
							/ {{ loan.sector.name }}
						</span>

						<div>
							<!-- Link to see full borrower profile in old stack -->
							<router-link
								:to="`/lend/${loan.id}?minimal=false`"
								v-kv-track-event="['Lending', 'full-borrower-profile-exit-link']"
							>
								See full borrower profile
							</router-link>
						</div>
					</div>
				</div>
			</div>
			<!-- Loans you might light section -->
			<div class="row lyml-wrapper">
				<div class="small-12 columns">
					<hr>
					<h3 class="lyml-text text-center" v-html="lymlHeading"></h3>
					<l-y-m-l
						:basketed-loans="itemsInBasket"
						:target-loan="loan"
						:sort-by="lymlCustomSort"
						@add-to-basket="handleAddToBasket"
					/>
				</div>
			</div>
			<hr>
			<div class="row">
				<div class="small-12 columns text-center">
					<!-- Loan use -->
					<h2 class="loan-use-text">
						A loan helped {{ loan.use }}
					</h2>
				</div>
			</div>
			<hr>
			<div class="row">
				<div class="small-12 columns loan-description-wrapper">
					<h2 class="loan-description-heading-text">
						{{ loan.name }}'s story
					</h2>
					<!-- Loan description -->
					<div v-html="loan.description"></div>
				</div>
			</div>
		</div>
		<div v-else id="loading-overlay">
			<div class="spinner-wrapper">
				<kv-loading-spinner />
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import cookieStore from '@/util/cookieStore';
import logReadQueryError from '@/util/logReadQueryError';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvFlag from '@/components/Kv/KvFlag';
import fundedBorrowerProfile from '@/graphql/query/fundedBorrowerProfile.graphql';
import experimentAssignment from '@/graphql/query/lendByCategory/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import basketItems from '@/graphql/query/basketItems.graphql';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import LYML from '@/components/LoansYouMightLike/lymlContainer';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	components: {
		WwwPage,
		LoanCardImage,
		KvFlag,
		LYML,
		KvLoadingSpinner
	},
	inject: ['apollo'],
	data() {
		return {
			loan: () => {},
			itemsInBasket: [],
			lymlCustomSort: 'random',
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
			}).then(({ data }) => {
				const loan = _get(data, 'lend.loan');
				if (loan === null || loan === 'undefined') {
					// redirect to legacy borrower profile
					return Promise.reject({
						path: `/lend/${fundedLoanId}?minimal=false`,
					});
				}

				return client.query({ query: experimentAssignment, variables: { id: 'funded_lyml_sort' } });
			});
		},
	},
	computed: {
		lymlHeading() {
			const defaultMessage = `${this.loan.name}'s loan finished fundraising,
				but these other borrowers need your support`;
			const customMessage = `${this.loan.name}'s loan finished fundraising,<br class="show-for-medium">
				but these similar borrowers just need a little more help to reach their goals!`;
			return this.lymlCustomSort === 'random' ? defaultMessage : customMessage;
		}
	},
	created() {
		// Read the page data from the cache
		let loanData = {};
		const loanIdFromRoute = _get(this.$route, 'params.id');

		try {
			loanData = this.apollo.readQuery({
				query: fundedBorrowerProfile,
				variables: {
					id: loanIdFromRoute,
					basketId: cookieStore.get('kvbskt'),
				},
			});

			this.loan = _get(loanData, 'lend.loan');
			this.itemsInBasket = _get(loanData, 'shop.basket.items.values');
		} catch (e) {
			logReadQueryError(e, 'FundedBorrowerProfilePage fundedBorrowerProfile');
			window.location = `/lend/${loanIdFromRoute}?minimal=false`;
		}

		// Read assigned version of lyml custom sort exp
		const customSortExpVersion = this.apollo.readFragment({
			id: 'Experiment:funded_lyml_sort',
			fragment: experimentVersionFragment,
		}) || {};
		// set custom sort on component and track exp version
		if (customSortExpVersion.version) {
			this.lymlCustomSort = customSortExpVersion.version === 'shown' ? 'amountLeft' : 'random';
			this.$kvTrackEvent('basket', 'EXP-CASH-1030-Aug2019', customSortExpVersion.version === 'shown' ? 'b' : 'a');
		}
	},
	methods: {
		handleAddToBasket(payload) {
			if (payload.success) {
				this.apollo.query({
					query: basketItems,
					fetchPolicy: 'network-only',
				}).then(data => {
					// need to update this.itemsInBasket here.
					this.itemsInBasket = _get(data, 'data.shop.basket.items.values');
				});
			}
		},
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
	display: inline-block;
	text-transform: capitalize;
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

#loading-overlay {
	position: absolute;
	width: auto;
	height: auto;
	left: 1rem;
	right: 1rem;
	bottom: 0;
	top: 0;
	background-color: rgba($platinum, 0.7);

	.spinner-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		height: 100%;
		top: auto;
		left: auto;
		transform: none;
		transition: top 100ms linear;
	}
}

</style>
