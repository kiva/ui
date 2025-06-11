<template>
	<AsyncPortfolioSection
		class="!tw-bg-transparent md:!tw-p-0"
		@visible="fetchAsyncData"
	>
		<BorrowerCarousel
			:lender="lender"
			:loans="loans"
			:total-loans="totalLoans"
			:is-loading="isLoading"
			:show-menu="true"
			:cards-number="6"
			:show-cta-when-no-loans="false"
			:show-carousel-tabs="true"
			class="portfolio-borrowers-carousel"
		/>
	</AsyncPortfolioSection>
</template>

<script setup>
import { ref, inject } from 'vue';
import { gql } from 'graphql-tag';
import logReadQueryError from '#src/util/logReadQueryError';
import BorrowerCarousel from '#src/components/MyKiva/BorrowerCarousel';
import AsyncPortfolioSection from './AsyncPortfolioSection';

// Query to gather user loans
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
        loans(limit: 50) {
            totalCount
            values {
                id
                name
                gender
                status
                use
                image {
                    id
                    hash
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
                loanAmount
                fundraisingPercent @client
                plannedExpirationDate
                loanFundraisingInfo {
					id
					fundedAmount
					reservedAmount
				}
                terms {
                    expectedPayments {
                        amount
                        localAmount
                        dueToKivaDate
                        effectiveDate
                    }
                }
                inPfp
                pfpMinLenders
                anonymizationLevel
            }
        }
    }
}`;

const apollo = inject('apollo');

const loans = ref([]);
const isLoading = ref(true);
const totalLoans = ref(0);
const lender = ref({});

const fetchAsyncData = () => {
	apollo.query({ query: userQuery })
		.then(result => {
			loans.value = result.data?.my?.loans?.values ?? [];
			totalLoans.value = result.data?.my?.loans?.totalCount ?? 0;
			lender.value = {
				public: result.data?.my?.userAccount?.public ?? false,
				inviterName: result.data?.my?.userAccount?.inviterName ?? null,
			};
			isLoading.value = false;
		}).catch(e => {
			logReadQueryError(e, 'Portfolio Page Loans userQuery');
		});
};
</script>
