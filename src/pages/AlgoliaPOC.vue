<template>
	<www-page>
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Algolia Search!</h1>

				<div class="algolia-wrap">
					<ais-instant-search
						v-if="searchClient"
						:search-client="searchClient"
						:index-name="algoliaDefaultIndex"
						:routing="routing"
					>
						<!-- eslint-disable vue/attribute-hyphenation -->
						<!-- We could run a default query... :query="defaultSearch" -->
						<!-- Apply multiple facets or global facets with :filters="filters" -->
						<!-- Apply via array :facetFilters="facetFilters" -->
						<!-- :sumOrFiltersScores="true" Show loans that meet all criteria first-->
						<!-- :disjunctiveFacets="disjunctiveFacetsKeys" -->
						<!-- :disjunctiveFacetsRefinements="disjunctiveFacets" -->
						<ais-configure
							:hitsPerPage="12"
							clickAnalytics="true"
							ref="aisConfigure"
						>
							<!-- <div slot-scope="{ searchParameters }">
								AisConfigure: Search Parameters
								<p class="tw-text-small"><pre>{{ searchParameters }}</pre></p>
							</div> -->
						</ais-configure>

						<!-- Add instantSearchInstance.helper object with methods :connector="true" -->
						<!-- <ais-state-results>
							<template slot-scope="{ index }">
								<small>{{ index }}</small>
							</template>
						</ais-state-results> -->

						<div class="row search-filter-and-results">
							<div class="columns small-12 small-push xlarge-3">
								<!-- <selected-refinements
									@facet-removed="handleFacetRemoved"
									:selected-custom-categories="{}"
									:custom-categorties="customCategoryList" /> -->

								<!-- POC for Custom Categories Refinements -->
								<!-- > does NOT currently support count -->
								<!-- <div class="custom-refinement-list">
									<div class="custom-refinement"
										v-for="category in customCategoryList" :key="category.name">
										<kv-checkbox
											@change="handleCheckboxToggle(checkboxStatus, category)">
											{{ category.name }} ({{ 0 }})
										</kv-checkbox>
									</div>
								</div> -->
								<h3>Sort By:</h3>
								<ais-sort-by :items="defaultSortIndices" />

								<h3>Gender:</h3>
								<ais-refinement-list
									:attribute="'gender'"
									:limit="100"
								/>

								<h3>Location:</h3>
								<ais-hierarchical-menu
									:attributes="['locationFacets.lvl0', 'locationFacets.lvl1']"
									:limit="100"
								/>

								<h3>Sectors:</h3>
								<ais-refinement-list
									:attribute="'sector.name'" :limit="1000"
									ref="sectorRefinements"
								/>

								<h3>Attributes:</h3>
								<ais-refinement-list
									:attribute="'loanThemeFilters.name'" :limit="1000"
									ref="themeRefinements"
								/>

								<h3>Tags:</h3>
								<ais-refinement-list
									:attribute="'tags.name'" :limit="1000"
									ref="tagRefinements"
								/>

								<filter-section-loan-details class="filter-section" />
							</div>

							<div class="columns small-12 small-push xlarge-9">
								<ais-stats>
									<h3 slot-scope="{ nbHits }">
										{{ nbHits }} loans found
									</h3>
								</ais-stats>

								<!-- we can easily turn off or switch out the icons shown for all controls -->
								<ais-search-box :show-loading-indicator="true" />

								<ais-current-refinements />

								<ais-state-results>
									<template slot-scope="{ page, hitsPerPage, queryID, index }">
										<ais-hits
											class="loan-card-group"
											:results-per-page="15"
										>
											<template #default="{ items }">
												<algolia-adapter
													v-for="(item, itemIndex) in items" :key="item.id"
													:loan="item"
													:items-in-basket="itemsInBasket"
													:is-logged-in="isLoggedIn"
													:algolia-props="{
														page, hitsPerPage, queryID, index, itemIndex, item
													}"
													loan-card-type="ListLoanCard"
													class="column-block columns"
												/>
											</template>
										</ais-hits>
									</template>
								</ais-state-results>
							</div>
						</div>

						<div class="row search-pagination-stats align-center">
							<ais-pagination :padding="2" class="columns small-12 xlarge-offset-3" />
							<ais-stats class="columns small-12 xlarge-offset-3 tw-text-center" />
							<ais-hits-per-page
								class="columns small-12 xlarge-offset-3" :items="[
									{ label: '15', value: 15, default: true },
									{ label: '25', value: 25 },
									{ label: '50', value: 50 },
								]"
							/>
						</div>
					</ais-instant-search>
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import _map from 'lodash/map';
import _forEach from 'lodash/forEach';
import _union from 'lodash/union';

// Import your specific Algolia Components here
// https://www.algolia.com/doc/api-reference/widgets/instantsearch/vue/
// algolia search is always required, moved to mixin
// import algoliasearch from 'algoliasearch/lite';
import {
	AisConfigure,
	AisInstantSearch,
	AisSearchBox,
	AisHits,
	AisPagination,
	AisHitsPerPage,
	AisCurrentRefinements,
	AisRefinementList,
	AisHierarchicalMenu,
	// AisToggleRefinement,
	// AisBreadcrumb,
	AisStats,
	AisSortBy,
	AisStateResults,
} from 'vue-instantsearch';

import AlgoliaAdapter from '@/components/LoanCards/AlgoliaLoanCardAdapter';

// This mixin provides some algolia search instance initialization on mounted
import algoliaInit from '@/plugins/algolia-init-mixin';

import logReadQueryError from '@/util/logReadQueryError';
import WwwPage from '@/components/WwwFrame/WwwPage';

// import KvCheckbox from '@/components/Kv/KvCheckbox';

// import SelectedRefinements from '@/pages/Lend/Filter/FilterComponents/SelectedRefinements';
import FilterSectionLoanDetails from '@/pages/Lend/Filter/FilterSections/LoanDetails/FilterSectionLoanDetails';

import itemsInBasketQuery from '@/graphql/query/basketItems.graphql';
import userStatus from '@/graphql/query/userId.graphql';

export default {
	name: 'AlgoliaPOC',
	components: {
		WwwPage,
		AisConfigure,
		AisInstantSearch,
		AisSearchBox,
		AisHits,
		AisHitsPerPage,
		AisPagination,
		AisCurrentRefinements,
		AisRefinementList,
		AisHierarchicalMenu,
		// AisToggleRefinement,
		// AisBreadcrumb,
		AisStats,
		// KvCheckbox,
		AlgoliaAdapter,
		AisSortBy,
		FilterSectionLoanDetails,
		AisStateResults,
	},
	inject: [
		'apollo',
		'cookieStore',
	],
	mixins: [
		algoliaInit
	],
	metaInfo: {
		title: 'Algolia Search',
	},
	data() {
		return {
			// aka. Loan Channel config
			// PROVIDED BY: algolia-custom-categories-mixin
			/* eslint-disable max-len */
			// customCategories: [
			// 	{
			// 		name: 'Agriculture',
			// 		//  OR tags.name:#Sustainable Ag (need to fix name to remove spaces)
			// 		filter: 'sector.name:Agriculture OR themeData.loanThemeTypeName:Agriculture OR themeData.loanThemeTypeName:Trees',
			// 		disjunctiveFacets: {
			// 			'sector.name': ['Agriculture'],
			// 			'themeData.loanThemeTypeName': ['Agriculture', 'Trees'],
			// 			'tags.name': ['#Sustainable Ag']
			// 		}
			// 	}
			// ],
			// /* eslint-enable max-len */

			// Optional default search state
			// > Sets search state and reflects that state in ais-current-refinements component
			// disjunctiveFacets: {
			// 	'sector.name': [],
			// 	'themeData.loanThemeTypeName': [],
			// 	'tags.name': []
			// },

			// Optional default search
			// defaultSearch: 'Energy',

			// Optional default filter (uses OR / AND combinations)
			// filters: 'themeData.loanThemeTypeName:General OR sector.name:Agriculture OR tags.name:#Schooling',
			// filters: 'status:fundRaising',

			// Optional facet filters (Not Recommended, prefer filters when needed)
			// facetFilters: [
			// 	// OR Combo
			// 	[
			// 		'sector.name:Agriculture',
			// 		'themeData.loanThemeTypeName:General'
			// 	],
			// 	// AND
			// 	'tags.name:#Vegan'
			// ],

			// Optional default search state
			// INFO: These properties alter the ais-configure component
			// > Sets search state and reflects that state in ais-current-refinements component
			// disjunctiveFacets: {
			// 	'sector.name': [],
			// 	'themeData.loanThemeTypeName': [],
			// 	'tags.name': []
			// },
			itemsInBasket: null,
			isLoggedIn: false,
		};
	},
	computed: {
		// customCategoryList() {
		// 	return _map(this.customCategories, (category, categoryId) => ({ ...category, categoryId }));
		// },
	},
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: itemsInBasketQuery
			}).then(() => {
				// Pre-fetch user Status
				return client.query({ query: userStatus });
			});
		}
	},
	created() {
		const basketId = this.cookieStore.get('kvbskt');

		try {
			const basketData = this.apollo.readQuery({
				query: itemsInBasketQuery,
				variables: { basketId },
			});
			this.itemsInBasket = _map(_get(basketData, 'shop.basket.items.values'), 'id');
		} catch (e) {
			logReadQueryError(e, 'AlgoliaPOC itemsInBasketQuery');
		}

		this.apollo.watchQuery({
			query: itemsInBasketQuery,
			variables: { basketId },
		}).subscribe({
			next: ({ data }) => {
				this.itemsInBasket = _map(_get(data, 'shop.basket.items.values'), 'id');
			},
		});

		let userData = {};
		try {
			userData = this.apollo.readQuery({
				query: userStatus,
				variables: { basketId },
			});
		} catch (e) {
			logReadQueryError(e, 'AlgoliaPOC userStatus');
		}

		this.isLoggedIn = _get(userData, 'my.userAccount.id') !== undefined;
	},
	methods: {

		fetchFacets() {
			// Calling a search on the client with facets declared will return all options for thos facets
			// WHAT: Access search instance on a global component to call this...
			// WHY 1: Use global list within each facet's transform function to ensure items are always shown
			// WHY 2: auto suggest https://www.algolia.com/doc/api-reference/api-methods/search-for-facet-values
			/*
			client.search({
				query: '',
				facets: ['Beds', 'Occupancy', 'Floor'],
				attributesToRetrieve: [],  // a little optimisation for response transfer speed
			});
			*/
		},
		// Our checkbox toggle provides category data on change
		// > we decide what to do with it.
		handleCheckboxToggle(checkboxStatus, category) {
			if (checkboxStatus) {
				// if the box is checked (true) add this category's selected facets
				this.disjunctiveFacets = this.mergeDisjunctiveFacets(category.disjunctiveFacets);
			} else {
				// remove this category's selected facets
				this.disjunctiveFacets = this.extractDisjunctiveFacets(category.disjunctiveFacets);
			}
		},
		mergeDisjunctiveFacets(newFacets) {
			// we can also get all properties of ais-configure through a $ref placed on that component
			// console.log(this.$refs.aisConfigure);

			// merge newFacets into existing facets
			// > clone existing facets so we don't mutate our data directly (we want 1 batch update)
			// const newDisjunctiveFacets = Object.assign({}, this.disjunctiveFacets);
			const newDisjunctiveFacets = { ...this.disjunctiveFacets };
			// iterate over each facet type and merge array values for each facet
			_forEach(newDisjunctiveFacets, (value, key) => {
				newDisjunctiveFacets[key] = _union(value, newFacets[key]);
			});

			// return new set
			// console.log(`New Search State: ${JSON.stringify(newDisjunctiveFacets)}`);
			return newDisjunctiveFacets;
		},
		extractDisjunctiveFacets(removedFacets) {
			// we can also get all properties of ais-configure through a $ref placed on that component
			// console.log(this.$refs.aisConfigure);
			// console.log(`Removed Facets: ${JSON.stringify(removedFacets)}`);

			// > clone existing facets so we don't mutate our data directly (we want 1 batch update)
			// const newDisjunctiveFacets = Object.assign({}, this.disjunctiveFacets);
			const newDisjunctiveFacets = { ...this.disjunctiveFacets };

			// remove facets from existing set
			_forEach(newDisjunctiveFacets, (value, key) => {
				// filter existing array by removed array
				newDisjunctiveFacets[key] = value.filter(facet => {
					return removedFacets[key].indexOf(facet) === -1;
				});
			});

			// return new set
			// console.log(`New Search State: ${JSON.stringify(newDisjunctiveFacets)}`);
			return newDisjunctiveFacets;
		},
		handleFacetRemoved(payload) {
			// console.log(payload);
			/* item signature
				attribute: "sector.name"
				count: 62
				exhaustive: true
				label: "Health"
				refine: ƒ refine(refinement)
				type: "disjunctive"
				value: "Health"
			*/
			// Currently set global disjunctive facets
			// const newDisjunctiveFacets = Object.assign({}, this.disjunctiveFacets);
			const newDisjunctiveFacets = { ...this.disjunctiveFacets };

			// remove facets from existing set
			_forEach(newDisjunctiveFacets, (value, key) => {
				// console.log(value, key);
				// console.log(payload.value);
				// filter existing array by removed array
				if (key === payload.attribute) {
					newDisjunctiveFacets[key] = value.filter(facet => {
						// console.log(facet);
						return facet !== payload.value;
					});
				}
			});
			// update global facets
			this.disjunctiveFacets = newDisjunctiveFacets;
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}

.search-filter-and-results {
	flex-direction: column-reverse;
}

@include breakpoint(large) {
	.search-filter-and-results {
		flex-direction: initial;
	}
}

.loan-card-group {
	position: relative;
}

.ais-HierarchicalMenu-list,
.ais-RefinementList-list {
	list-style: none;
	margin-left: 0;

	.ais-HierarchicalMenu-list--child {
		list-style-type: circle;
		margin-left: 1.2rem;
	}
}

.algolia-loan-card-adapter {
	padding-left: 0;
	padding-right: 0;
}

.ais-SearchBox-form {
	display: flex;
	position: relative;

	.ais-SearchBox-submit,
	.ais-SearchBox-reset {
		display: block;
		padding: 0.2rem 0.8rem;
		height: 1rem;
		height: 2.6875rem;
		background: rgba(0, 0, 0, 0.03);
		margin-left: 0.2rem;

		&:hover {
			background-color: rgba(110, 176, 252, 0.05);
		}
	}

	.ais-SearchBox-loadingIndicator {
		position: absolute;
		right: 6rem;
		top: 0.8rem;
	}
}

.ais-Pagination-list {
	list-style: none;
	text-align: center;
	display: flex;
	margin: 0.75rem auto;
	justify-content: center;
	align-items: center;
	max-width: 25rem;

	.ais-Pagination-item {
		color: $kiva-text-light;
	}

	.ais-Pagination-item--active,
	.ais-Pagination-item--disabled {
		a {
			color: $kiva-text-light;
		}
	}

	.ais-Pagination-link {
		padding: 0.5rem 0.8rem;
		// border: 1px solid #eee;
		border-radius: 0.3rem;
		background-color: rgba(0, 0, 0, 0.03);
		margin: 0 0.2rem;

		&:hover {
			background-color: rgba(110, 176, 252, 0.05);
		}
	}

	.ais-Pagination-item--first,
	.ais-Pagination-item--previous,
	.ais-Pagination-item--next,
	.ais-Pagination-item--last {
		font-weight: bold;

		a:hover,
		a:visited {
			text-decoration: none;
		}
	}
}

.ais-HitsPerPage {
	max-width: 13rem;
}
</style>
