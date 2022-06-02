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
						class="tw-text-action tw-inline-block"
						v-if="loan.status==='funded'"
					>
						100%
					</h2>
					<h2 class="tw-text-action tw-inline-block tw-capitalize">
						{{ loan.status }}
					</h2>
					<!-- Total funded/loan amount -->
					<div class="tw-mt-1">
						Total loan: ${{ loan.loanFundraisingInfo.fundedAmount | numeral('0,0') }}
					</div>
					<!-- Borrower Name -->
					<h1> {{ loan.name }} </h1>
					<!-- Borrower location -->
					<div class="tw-mt-2">
						<div class="loan-location-flag">
							<kv-flag :country="`${ loan.geocode.country.isoCode }`" />
						</div>
						<span>
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
					<hr class="tw-border-tertiary">
					<h3 class="tw-text-center tw-mb-2 tw-mt-3" v-html="lymlHeading"></h3>
					<l-y-m-l
						class="tw-mb-3"
						:basketed-loans="itemsInBasket"
						:target-loan="loan"
						@add-to-basket="handleAddToBasket"
					/>
				</div>
			</div>
			<hr class="tw-border-tertiary">
			<div class="row">
				<div class="small-12 columns tw-text-center tw-py-4">
					<!-- Loan use -->
					<h2>
						A loan helped {{ loan.use }}
					</h2>
				</div>
			</div>
			<hr class="tw-border-tertiary">
			<div class="row">
				<div class="small-12 columns loan-description-wrapper tw-pt-4">
					<h2 class="tw-mb-4">
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
import numeral from 'numeral';
import logReadQueryError from '@/util/logReadQueryError';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvFlag from '@/components/Kv/KvFlag';
import fundedBorrowerProfile from '@/graphql/query/fundedBorrowerProfile.graphql';
import basketItems from '@/graphql/query/basketItems.graphql';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import LYML from '@/components/LoansYouMightLike/LymlContainer';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	name: 'FundedBorrowerProfile',
	metaInfo() {
		const canonicalUrl = `https://${this.$appConfig.host}${this.$route.path}`.replace('funded', 'lend');
		return {
			link: [
				{
					vmid: 'canonical',
					rel: 'canonical',
					href: canonicalUrl
				}
			]
		};
	},
	components: {
		WwwPage,
		LoanCardImage,
		KvFlag,
		LYML,
		KvLoadingSpinner
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			loan: () => {},
			itemsInBasket: [],
		};
	},
	apollo: {
		preFetch(config, client, { cookieStore, route }) {
			const fundedLoanId = numeral(route?.params?.id).value();

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
			});
		},
	},
	computed: {
		lymlHeading() {
			const defaultMessage = `${this.loan.name}'s loan finished fundraising,
				but these similar borrowers need your support`;
			const customMessage = `${this.loan.name}'s loan finished fundraising,<br class="show-for-medium">
				but these similar borrowers just need a little more help to reach their goals!`;
			return this.lymlCustomSort === 'random' ? defaultMessage : customMessage;
		}
	},
	created() {
		// Read the page data from the cache
		let loanData = {};
		const loanIdFromRoute = numeral(_get(this.$route, 'params.id')).value();
		try {
			loanData = this.apollo.readQuery({
				query: fundedBorrowerProfile,
				variables: {
					id: loanIdFromRoute,
					basketId: this.cookieStore.get('kvbskt'),
				},
			});

			this.loan = _get(loanData, 'lend.loan');
			this.itemsInBasket = _get(loanData, 'shop.basket.items.values');
		} catch (e) {
			logReadQueryError(e, 'FundedBorrowerProfilePage fundedBorrowerProfile');
			this.$router.push({ path: `/lend/${loanIdFromRoute}?minimal=false` });
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

.loan-location-flag {
	display: inline-block;
	width: rem-calc(16);
	margin-right: 0.25rem;
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
