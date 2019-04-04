<template>
	<div class="algolia-loan-card-adapter">
		<loan-card-controller
			:key="loan.id"
			:loan="adaptedLoan"
			:is-visitor="!isLoggedIn"
			:items-in-basket="itemsInBasket"
			:loan-card-type="loanCardType"
			@add-to-basket="handleAddToBasket"
		/>
		<!--
			Add tracking later
			:enable-tracking="true"
			:category-id="loanChannel.id"
			:category-set-id="setId"
			:row-number="rowNumber"
			:card-number="index + 1"

			Add experiments later
			:image-enhancement-experiment-version="imageEnhancementExperimentVersion"
		-->
	</div>
</template>

<script>
import _get from 'lodash/get';
import algoliaLoanStatus from '@/graphql/query/algoliaLoanStatus.graphql';
import LoanCardController from '@/components/LoanCards/LoanCardController';

export default {
	components: {
		LoanCardController,
	},
	inject: ['apollo'],
	props: {
		loan: {
			type: Object,
			default: () => {}
		},
		itemsInBasket: {
			type: Array,
			default: () => []
		},
		isLoggedIn: {
			type: Boolean,
			default: false
		},
		loanCardType: {
			type: String,
			required: true,
		},
		algoliaProps: {
			type: Object,
			default: () => {}
		},
	},
	data() {
		return {
			latestFundraisingInfo: null,
			latestUserProperties: null,
		};
	},
	computed: {
		adaptedLoan() {
			// TODO: There must be a better way
			const defaultImage = `https://www-dev-kiva-org.global.ssl.fastly.net/img/w480h360/${_get(this.loan, 'image.hash')}.jpg`; // eslint-disable-line
			const retinaImage = `https://www-dev-kiva-org.global.ssl.fastly.net/img/w960h720/${_get(this.loan, 'image.hash')}.jpg`; // eslint-disable-line
			const exprirationDate = new Date(_get(this.loan, 'plannedExpirationDate') * 1000);

			return {
				id: parseInt(_get(this.loan, 'id'), 10),
				status: this.latestStatus || _get(this.loan, 'status').toString().toLowerCase(),
				borrowerCount: _get(this.loan, 'borrowerCount'),
				geocode: _get(this.loan, 'geocode'),
				image: {
					default: defaultImage,
					retina: retinaImage
				},
				lenderRepaymentTerm: parseInt(_get(this.loan, 'lenderRepaymentTerm'), 10),
				loanAmount: _get(this.loan, 'loanAmount').toString(),
				loanFundraisingInfo: this.latestFundraisingInfo || {
					fundedAmount: _get(this.loan, 'fundedAmount'),
					isExpiringSoon: _get(this.loan, 'expiringSoon'),
					reservedAmount: _get(this.loan, 'reservedAmount'),
				},
				use: _get(this.loan, 'use'),
				matchingText: '',
				name: _get(this.loan, 'name'),
				partnerName: _get(this.loan, 'partner.name'),
				plannedExpirationData: exprirationDate.toISOString(),
				userProperties: this.latestUserProperties || {
					favorited: false,
					lentTo: false
				},
			};
		},
	},
	mounted() {
		this.queryLoanStatus();
	},
	watch: {
		'loan.id': {
			handler() {
				this.queryLoanStatus();
			}
		}
	},
	methods: {
		queryLoanStatus() {
			this.apollo.query({
				query: algoliaLoanStatus,
				variables: {
					ids: [parseInt(_get(this.loan, 'id'), 10)]
				},
				fetchPolicy: 'network-only',
			}).then(({ data }) => {
				if (data.lend.loans.totalCount) {
					this.latestFundraisingInfo = {
						fundedAmount: _get(data, 'lend.loans.values[0].loanFundraisingInfo.fundedAmount'),
						isExpiringSoon: _get(data, 'lend.loans.values[0].loanFundraisingInfo.expiringSoon'),
						reservedAmount: _get(data, 'lend.loans.values[0].loanFundraisingInfo.reservedAmount'),
					};
					// update our local user props
					this.latestUserProperties = {
						favorited: _get(data, 'lend.loans.values[0].userProperties.favorited'),
						lentTo: _get(data, 'lend.loans.values[0].userProperties.lentTo'),
					};
				}
			});
		},
		handleAddToBasket(payload) {
			if (typeof window === 'undefined') return false;
			// track algolia conversion if add to basket was successful
			if (window.aa && payload.success) {
				window.aa('convertedObjectIDs', {
					eventName: 'Add to Cart',
					index: this.algoliaProps.index,
					queryID: this.algoliaProps.queryID,
					objectIDs: [this.algoliaProps.item.objectID],
				});
			}
		}
	}
};
</script>

<style lang="scss">
.algolia-loan-card-adapter {
	padding: 0;
}
</style>
