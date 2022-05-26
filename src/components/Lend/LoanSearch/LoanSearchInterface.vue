<template>
	<div class="tw-flex">
		<div class="tw-flex tw-flex-col tw-mr-4">
			<div class="md:tw-hidden tw-mb-3">
				<kv-button variant="secondary" @click="toggleLightbox(true)">
					Filter & Sort
				</kv-button>
				<kv-lightbox
					:visible="isLightboxVisible"
					variant="lightbox"
					title="Loan filter controls"
					@lightbox-closed="toggleLightbox(false)"
				>
					<template #header>
						{{ null }} <!-- Hide title text -->
					</template>
					<loan-search-filter :facets="facets" />
				</kv-lightbox>
			</div>
			<div class="tw-hidden md:tw-block">
				<loan-search-filter :facets="facets" />
			</div>
		</div>
		<div class="md:tw-hidden tw-pt-1.5">
			<p>{{ totalCount }} Loans</p>
		</div>
		<div class="tw-col-span-2">
			<div class="tw-hidden md:tw-block tw-h-4 tw-mb-2 md:tw-mb-3 lg:tw-mb-3.5">
				<p>{{ totalCount }} Loans</p>
			</div>
			<kv-grid class="tw-grid-rows-4">
				<loan-card-controller
					v-for="loan in loans"
					:items-in-basket="null"
					:is-visitor="true"
					:key="loan.id"
					:loan="loan"
					loan-card-type="ListLoanCard"
					:rounded-corners="true"
				/>
			</kv-grid>
		</div>
	</div>
</template>

<script>
import loanSearchStateQuery from '@/graphql/query/loanSearchState.graphql';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import LoanSearchFilter from '@/components/Lend/LoanSearch/LoanSearchFilter';
import {
	runFacetsQueries,
	transformIsoCodes,
	transformAttributes,
	runLoansQuery,
	fetchLoanFacets
} from '@/util/loanSearchUtils';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		LoanCardController,
		KvGrid,
		KvButton,
		LoanSearchFilter,
		KvLightbox
	},
	data() {
		return {
			/**
			 * All available facet options from lend API. Format:
			 * {
			 *   countryFacets: [
			 *     {
			 *       name: '',
			 *       isoCode: '',
			 *       region: '',
			 *     }
			 *   ],
			 *   sectorFacets: [
			 *     {
			 *       id: 1,
			 *       name: '',
			 *     }
			 *   ],
			 *   attributeFacets: [
			 *     {
			 *       id: 1,
			 *       name: '',
			 *     }
			 *   ],
			 * }
			 */
			allFacets: undefined,
			/**
			 * Facet options based on the loans available. Format:
			 * {
			 *   regions: [
			 *     {
			 *       region: '',
			 *       numLoansFundraising: 1,
			 *       countries: [
			 *         {
			 *           name: '',
			 *           region: '',
			 *           isoCode: '',
			 *           numLoansFundraising: 1,
			 *         }
			 *       ]
			 *     }
			 *   ],
			 *   sectors: [
			 *     {
			 *       id: 1,
			 *       name: '',
			 *     }
			 *   ],
			 *   attributes: [
			 *     {
			 *       id: 1,
			 *       name: '',
			 *       numLoansFundraising: 1,
			 *     }
			 *   ],
			 * }
			 */
			facets: {},
			loans: [],
			totalCount: 0,
			isLightboxVisible: false
		};
	},
	mounted() {
		// Here we subscribe to the loanSearchState and run the loan query when it updates
		// TODO: work some guards to prevent duplicate queries and throttling to more carefully control # of queries
		this.apollo.watchQuery({ query: loanSearchStateQuery }).subscribe({
			next: async ({ data }) => {
				// Get all facet options from lend API. Only fetch once, since the options shouldn't change frequently.
				if (!this.allFacets) this.allFacets = await fetchLoanFacets(this.apollo);

				// Get filtered facet options from FLSS
				const { isoCodes, attributes } = await runFacetsQueries(this.apollo, data?.loanSearchState);

				// Merge all facet options with filtered options
				this.facets = {
					regions: transformIsoCodes(isoCodes, this.allFacets?.countryFacets),
					sectors: this.allFacets?.sectorFacets || [],
					attributes: transformAttributes(attributes, this.allFacets?.attributeFacets)
				};

				// Get filtered loans from FLSS
				const loans = await runLoansQuery(this.apollo, data?.loanSearchState);
				this.loans = loans.loans;
				this.totalCount = loans.totalCount;
			}
		});
	},
	methods: {
		toggleLightbox(toggle) {
			this.isLightboxVisible = toggle;
		},
	},
};
</script>
