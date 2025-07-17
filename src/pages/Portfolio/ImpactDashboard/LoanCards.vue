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
			:lender="lender" :loans="loans"
			:selected-loan="selectedLoan"
			:show-carousel-tabs="true"
			:total-loans="totalLoans"
			@add-to-basket="addToBasket"
			@go-to-link="goToLink"
			@handle-selected-loan="handleSelectedLoan"
			show-menu
		/>
	</AsyncPortfolioSection>
</template>

<script>
import { gql } from 'graphql-tag';

import BorrowerCarousel from '#src/components/MyKiva/BorrowerCarousel';
import logReadQueryError from '#src/util/logReadQueryError';
import borrowerProfileExpMixin from '#src/plugins/borrower-profile-exp-mixin';
import { TRANSACTION_LOANS_KEY } from '#src/util/myKivaUtils';

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
        }
        transactions(
            filter: {
                category: loan
            }
            limit: 100
        ) {
            values {
                category
                loan {
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
                type
                createTime
            }
        }
    }
}`;

export default {
	name: 'LoanCards',
	components: {
		AsyncPortfolioSection,
		BorrowerCarousel
	},
	mixins: [borrowerProfileExpMixin],
	inject: ['apollo'],
	data() {
		return {
			loans: [],
			totalLoans: 0,
			lender: {},
			isLoading: true,
		};
	},
	async mounted() {
		this.loadInitialBasketItems();
	},
	methods: {
		fetchAsyncData() {
			this.apollo.query({ query: userQuery })
				.then(result => {
					const transactions = result.data?.my?.transactions?.values?.filter(t => {
						return t.type !== TRANSACTION_LOANS_KEY;
					});
					this.loans = transactions?.map(t => t.loan) ?? [];
					this.totalLoans = result.data?.my?.loans?.totalCount ?? 0;
					this.lender = {
						public: result.data?.my?.userAccount?.public ?? false,
						inviterName: result.data?.my?.userAccount?.inviterName ?? null,
					};
					this.isLoading = false;
				}).catch(e => {
					logReadQueryError(e, 'Portfolio Page Loans userQuery');
				});
		}
	}
};
</script>
