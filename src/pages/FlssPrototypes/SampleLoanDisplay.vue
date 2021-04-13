<template>
	<www-page-minimal
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
							Support causes you care about.

							<!--PSD TODO switch to simple dropdown tailored queries-->

							<!--PSD HOWTO pass queries to dev graphql endpoint-->
							<!-- write a query via appollo here in the page?-->

							<!--PSD HOWTO pass loan ids from query to federation-->

							<!--PSD placeholder page is /pages/FlssPrototypes-->
						</h2>

						<div class="loan-view-controls">
							<flss-loan-filters class="loan-view-controls__filters" />
						</div>

						<flss-loan-row
							v-show="showLoanRows"
							id="simpleLoanRowDisplay"
							:is-visible="showLoanRows"
							:key="'one-category'"
							:row-number="1"
							:show-loans="showLoans"
							@show-loan-details="showLoanDetails"
						/>
					</div>
				</div>
			</section>

			<hr>

			<hr>
		</div>
	</www-page-minimal>
</template>
<script>

import gql from 'graphql-tag';
import { processPageContentFlat } from '@/util/contentfulUtils';
import { lightHeader, lightFooter } from '@/util/siteThemes';

const pageQuery = gql`query loanQuery {
lend {
    loans (filters: {gender: female, country: ["KE"]}, limit: 5) {
    totalCount
    values {
        id
        name
        loanAmount
        image {
            id
            url(presetSize: small)
        }
        activity {
            id
            name
        }
        geocode {
            country {
            isoCode
            name
            }
        }
    }
}
}

`;
export default {
	inject: ['apollo', 'cookieStore'],
	components: {
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
			headerTheme: lightHeader,
			footerTheme: lightFooter,
			rawPageData: null,
			pageData: null,
			showLoans: false,
			showLoanRows: true,

		};
	},
	metaInfo() {
		return {
			title: `${this.pageTitle}`,
		};
	},
	apollo: {
		preFetch: true,
		query:
         pageQuery,
		// TODO: Convert to prefetch function and check for page path before fetching all content
		// - Requires extended contentful graphql query options for include depth and query by addtional fields
		preFetchVariables({ route }) {
			return { contentKey: route.params.dynamicRoute };
		},
		variables() {
			return { contentKey: this.$route.params.dynamicRoute };
		},
		result({ data }) {
			// extract dynamicRoute param for contentful query
			const { dynamicRoute } = this.$route.params;
			// redirect if missing page data and/or route
			if (typeof dynamicRoute === 'undefined') {
				this.$router.push('/');
			}
			this.rawPageData = data;
			const pageEntry = data.contentful?.entries?.items?.[0] ?? null;
			this.pageData = pageEntry ? processPageContentFlat(pageEntry) : null;
		},
	},
	created() {
		// extract query
		this.pageQuery = this.$route.query;
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
	},
	destroyed() {
		clearInterval(this.currentTimeInterval);
	},
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
