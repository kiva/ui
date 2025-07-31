<template>
	<AsyncPortfolioSection
		class="!tw-bg-transparent md:!tw-p-0"
		@visible="fetchAsyncData"
	>
		<BorrowerCarousel
			class="portfolio-borrowers-carousel"
			:basket-items="basketItems"
			:cards-number="7"
			:is-adding="isAdding"
			:lender="lender"
			:loans="loans"
			:show-carousel-tabs="true"
			:total-loans="totalLoans"
			show-menu
			@handle-selected-loan="showLoanDetails"
			@mouse-enter-status-card="loadBPData"
		/>
		<BorrowerSideSheetWrapper
			:basket-items="basketItems"
			:is-adding="isAdding"
			:kv-track-function="$kvTrackEvent"
			:selected-loan-id="selectedLoan?.id"
			:show-next-steps="true"
			:show-side-sheet="showSideSheet"
			@add-to-basket="addToBasket"
			@go-to-link="goToLink"
			@close-side-sheet="handleCloseSideSheet"
		/>
	</AsyncPortfolioSection>
</template>

<script>
import { gql } from 'graphql-tag';
import BorrowerCarousel from '#src/components/MyKiva/BorrowerCarousel';
import BorrowerSideSheetWrapper from '#src/components/BorrowerProfile/BorrowerSideSheetWrapper';
import logReadQueryError from '#src/util/logReadQueryError';
import borrowerProfileExpMixin from '#src/plugins/borrower-profile-exp-mixin';
import AsyncPortfolioSection from './AsyncPortfolioSection';

const userQuery = gql`query userQuery {
	my {
        id
        userAccount {
            id
            public
            inviterName
        }
        mostRecentBorrowedLoan {
            id
		}
        loans {
            totalCount
            values {
                id
                name
                gender
                status
                use
                image {
                    id
                    url
                    hash
                }
                loanAmount
                plannedExpirationDate
                terms {
                    currency
                    currencyFullName
                    lossLiabilityNonpayment
                    lossLiabilityCurrencyExchange
                    loanAmount
                    disbursalDate
                    disbursalAmount
                    flexibleFundraisingEnabled
                    lenderRepaymentTerm
                    expectedPayments {
                    amount
                    localAmount
                    dueToKivaDate
                    effectiveDate
                    }
                }
                tags
                ... on LoanPartner {
                    themes
                }
                sector {
                    id
                }
                geocode {
                    city
                    state
                    country {
                    id
                    name
                    isoCode
                    region
                    }
                }
            }
        }
    }
}`;

export default {
	name: 'LoanCards',
	components: {
		AsyncPortfolioSection,
		BorrowerCarousel,
		BorrowerSideSheetWrapper,
	},
	mixins: [borrowerProfileExpMixin],
	inject: ['apollo'],
	data() {
		return {
			loans: [],
			totalLoans: 0,
			lender: {},
			isLoading: true,
			showSideSheet: false,
		};
	},
	async mounted() {
		this.loadInitialBasketItems();
	},
	methods: {
		fetchAsyncData() {
			this.apollo.query({ query: userQuery })
				.then(result => {
					this.loans = result.data?.my?.loans?.values ?? [];
					this.totalLoans = result.data?.my?.loans?.totalCount ?? 0;
					this.lender = {
						public: result.data?.my?.userAccount?.public ?? false,
						inviterName: result.data?.my?.userAccount?.inviterName ?? null,
					};
					this.isLoading = false;
				}).catch(e => {
					logReadQueryError(e, 'Portfolio Page Loans userQuery');
				});
		},
		handleCloseSideSheet() {
			this.showSideSheet = false;
		},
		showLoanDetails(payload) {
			this.handleSelectedLoan({ loanId: payload?.id });
			this.showSideSheet = true;
		},
	}
};
</script>
