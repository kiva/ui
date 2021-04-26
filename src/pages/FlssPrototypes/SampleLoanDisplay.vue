<template>
	<www-page
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<div class="simple-campaign-landing">
			<hr>

			<section
				class="loan-categories section"
				id="simpleLoanSection"
				ref="simpleLoanSection"
			>
				<div class="row">
					<div class="columns">
						<h2 class="loan-categories__header text-center">
							Fundraising Loan Search Service Loans

							<!--PSD TODO switch to simple dropdown tailored queries-->
<<<<<<< HEAD
							
||||||| parent of 1f06500e... debug data flowing to loan controller

							<!--PSD HOWTO pass queries to dev graphql endpoint-->
							<!-- write a query via appollo here in the page?-->
                            
							<!-- duplicate basicLoanData and use custom queries instead to flss -->
							<!-- and then import the new flss component -->
=======

							<!--PSD HOWTO pass queries to dev graphql endpoint-->
							<!-- write a query via appollo here in the page?-->

							<!-- duplicate basicLoanData and use custom queries instead to flss -->
							<!-- and then import the new flss component -->
>>>>>>> 1f06500e... debug data flowing to loan controller
						</h2>
						<div class="loan-container">
							<button @click="toggle">
								Toggle
							</button>
							<div v-if="active">
								Menu
							</div>
							<flss-loans
								id="flssLoanRowDisplay"
								:filters="filters"
								:is-visitor="true"
								:items-in-basket="null"
								:is-logged-in="null"
								:is-visible="showLoanRows"
								:key="'one-category'"
								:row-number="1"
								:show-loans="true"
								sort-by="popularity"
							/>
						</div>
					</div>
				</div>
			</section>
		</div>
	</www-page>
</template>
<script>

import gql from 'graphql-tag';
import { lightHeader, lightFooter } from '@/util/siteThemes';
import WwwPage from '@/components/WwwFrame/WwwPage';
import FlssLoans from '@/pages/FlssPrototypes/FlssLoanRow';
// import LoanCardController from '@/components/LoanCards/FlssLoanCardController';

const pageQuery = gql`query pageContent($basketId: String!) {
	shop(basketId: $basketId) {
		id
		basket {
			id
			items {
				totalCount
				values {
					id
					basketItemType
				}
			}
		}
	}
	my {
		userAccount {
			id
		}
	}
}`;

export default {
	inject: ['apollo', 'cookieStore', 'kvAuth0'],
	components: {
		WwwPage,
		FlssLoans
		// LoanCardController
	},
	mixins: [],
	props: {
		dynamicRoute: {
			type: String,
			default: '',
		},
		formComplete: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			active: false,
			headerTheme: lightHeader,
			footerTheme: lightFooter,
			rawPageData: null,
			pageData: null,
			showLoans: false,
			showLoanRows: true,
			filters: {}
		};
	},
	metaInfo() {
		return {
			title: `${this.pageTitle}`,
		};
	},
	apollo: {
		preFetch: true,
		query: pageQuery,
	},
	created() {
	},
	mounted() {
	},
	watch: {
	},
	computed: {
		pageSettingData() {
			const settings = this.pageData?.page?.settings ?? [];
			const jsonDataArray = settings.map(setting => setting.dataObject || {});
			/* eslint-disable-next-line no-unused-vars, no-empty-pattern */
			const allJsonData = jsonDataArray.reduce(
				(accumulator, settingDataObject) => {
					return { ...accumulator, ...settingDataObject };
				},
				{}
			);
			return allJsonData;
		},
		pageTitle() {
			const layoutTitle = this.pageData?.page?.pageLayout?.pageTitle;
			const pageTitle = this.pageData?.page?.pageTitle ?? 'Loans that change lives';
			return layoutTitle || pageTitle;
		},
		initialSortBy() {
			return (
				this.promoData?.managedAccount?.loanSearchCriteria?.sortBy
        ?? 'popularity'
			);
		},

	},
	methods: {

		showLoanDetails(loan) {
			this.detailedLoan = loan;
			this.loanDetailsVisible = true;
		},
		toggle() {
			this.active = !this.active;
		}
	},
	destroyed() {
		clearInterval(this.currentTimeInterval);
	},
<<<<<<< HEAD
||||||| parent of 1f06500e... debug data flowing to loan controller
    
=======

>>>>>>> 1f06500e... debug data flowing to loan controller
};
</script>

<style lang="scss" scoped>
@import "settings";

.simple-campaign-landing {
	&__status {
		$header-height: rem-calc(45); // same as TheHeader.vue
		$header-height-large: rem-calc(64); // same as TheHeader.vue

		position: sticky;
		top: $header-height;
		z-index: 2;

		@include breakpoint(large) {
			top: $header-height-large;
		}
	}

	&__loading-page {
		z-index: 1;
	}
}

.loan-categories {
	margin-top: 2rem;

	& .row {
		max-width: 69.15rem;
	}

	&__header {
		font-weight: bold;
		margin-bottom: 2rem;

		@include breakpoint(large) {
			@include large-text();
		}
	}
}

.loan-details-lightbox {
	::v-deep .kv-lightbox__header {
		button.kv-lightbox__close-btn {
			background: $white;
			border-radius: 1.25rem;
		}
	}
}

.loan-details {
	// Style overrides for the loan details lightbox content
	// Note, styles inside DetailedLoanCard.vue are not scoped
	border: 0;

	&.detailed-loan-card.row {
		max-width: 100%;
		border: 0;

		@include breakpoint(xlarge) {
			width: 58.75rem;
		}

		::v-deep {
			.full-details-link,
			.close-button-wrapper,
			.info-panel a,
			.borrower-info-body.loan-use a {
				display: none;
			}

			.name-location-sector .name {
				text-decoration: none;
				color: $body-font-color;
				cursor: text;
			}
		}
	}

	.overview-column {
		margin-bottom: 1.5rem;
	}
}

.loan-view-controls {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	flex-direction: column;

	@include breakpoint(medium) {
		flex-direction: row;
		margin: 0 1rem;
	}
	@include breakpoint(large) {
		margin: 0 3rem;
	}

	&__filters {
		margin-bottom: 1rem;

		@include breakpoint(medium) {
			margin-bottom: 0;
		}
	}
}
</style>
