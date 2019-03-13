<template>
	<www-page>
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Algolia Search!</h1>

				<div class="algolia-wrap">
					<ais-instant-search
						v-if="searchClient"
						:search-client="searchClient"
						:index-name="algoliaDefaultIndex">
						<!-- eslint-disable vue/attribute-hyphenation -->
						<!-- We could run a default query... :query="defaultSearch" -->
						<!-- Apply multiple facets or global facets with :filters="filters" -->
						<!-- Apply via array :facetFilters="facetFilters" -->
						<!-- :sumOrFiltersScores="true" Show loans that meet all criteria first-->
						<!-- :disjunctiveFacets="disjunctiveFacetsKeys" -->
						<ais-configure
							:hitsPerPage="12"
							ref="aisConfigure"
							:disjunctiveFacetsRefinements="disjunctiveFacets"
						>
							<div slot-scope="{ searchParameters }">
								Currently applied filters:
								<p class="small-text"><pre>{{ searchParameters }}</pre></p>
							</div>
						</ais-configure>

						<ais-current-refinements />

						<selected-refinements @facet-removed="handleFacetRemoved" />

						<!-- POC for Custom Categories Refinements -->
						<!-- > does NOT currently support count -->
						<div class="custom-refinement-list">
							<div class="custom-refinement"
								v-for="category in customCategories" :key="category.name">
								<kv-checkbox
									@checkbox-toggled="handleCheckboxToggle($event, category)">
									{{ category.name }} ({{ category.count }})
								</kv-checkbox>
							</div>
						</div>

						<!-- These are hidden and used a data providers to create counts -->
						<ais-refinement-list
							v-show="false"
							:attribute="'sector.name'" :limit="1000"
							ref="sectorRefinements" />
						<ais-refinement-list
							v-show="false"
							:attribute="'themeData.loanThemeTypeName'" :limit="1000"
							ref="themeRefinements" />
						<ais-refinement-list
							v-show="false"
							:attribute="'tags.name'" :limit="1000"
							ref="tagRefinements" />

						<!-- <ais-breadcrumb
							root-path=""
							:attributes="['locationFacets.lvl0', 'locationFacets.lvl1']" /> -->
						<ais-hierarchical-menu
							:attributes="['locationFacets.lvl0', 'locationFacets.lvl1']"
							:limit="100" />
						<ais-sort-by :items="defaultSortIndices"/>

						<ais-hits
							class="loan-card-group row small-up-1 large-up-2 xxlarge-up-3"
							:results-per-page="12">
							<template slot="default" slot-scope="{ items }">
								<algolia-adapter
									v-for="item in items" :key="item.id"
									:loan="item"
									:items-in-basket="itemsInBasket"
									:is-logged-in="isLoggedIn"
									loan-card-type="GridLoanCard"
									class="column-block columns"
								/>
							</template>
						</ais-hits>

						<ais-pagination :padding="2" />
						<ais-stats />
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

import WwwPage from '@/components/WwwFrame/WwwPage';

// This mixin provides some algolia search instance initialization on mounted
import algoliaInit from '@/plugins/algolia-init-mixin';
// This mixin provides config for our indices + loan channel categories
import algoliaConfig from '@/plugins/algolia-config-mixin';

// Import your specific Algolia Components here
// https://www.algolia.com/doc/api-reference/widgets/instantsearch/vue/
// algolia search is always required, moved to mixin
// import algoliasearch from 'algoliasearch/lite';
import {
	AisConfigure,
	AisInstantSearch,
	AisHits,
	AisPagination,
	AisCurrentRefinements,
	AisRefinementList,
	AisHierarchicalMenu,
	AisToggleRefinement,
	AisBreadcrumb,
	AisStats,
	AisSortBy,
} from 'vue-instantsearch';

import AlgoliaAdapter from '@/components/LoanCards/AlgoliaLoanCardAdapter';

import KvCheckbox from '@/components/Kv/KvCheckbox';

import SelectedRefinements from '@/pages/Lend/Filter/SelectedRefinements';

import itemsInBasketQuery from '@/graphql/query/basketItems.graphql';
import userStatus from '@/graphql/query/userId.graphql';
import experimentSetting from '@/graphql/query/experimentSetting.graphql';
import experimentQuery from '@/graphql/query/lendByCategory/experimentAssignment.graphql';

export default {
	components: {
		WwwPage,
		AisConfigure,
		AisInstantSearch,
		AisHits,
		AisPagination,
		AisCurrentRefinements,
		AisRefinementList,
		AisHierarchicalMenu,
		AisToggleRefinement,
		AisBreadcrumb,
		AisStats,
		KvCheckbox,
		AlgoliaAdapter,
		AisSortBy,
		SelectedRefinements
	},
	inject: [
		'apollo',
	],
	mixins: [
		algoliaConfig,
		algoliaInit
	],
	metaInfo: {
		title: 'Algolia Search'
	},
	data() {
		return {
			// aka. Loan Channel config
			// PROVIDED BY: algolia-config-mixin
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
			// PROVIDED BY: algolia-config-mixin
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

			itemsInBasket: null,
			isLoggedIn: false,
			configureRefine: null,
			configureSearchParameters: null
		};
	},
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: itemsInBasketQuery
			}).then(() => {
				// Pre-fetch user Status
				return client.query({ query: userStatus });
			}).then(() => {
				// TODO: REMOVE Once Lend Increment Button EXP ENDS
				// Pre-fetch the setting for lend increment button
				return client.query({ query: experimentSetting, variables: { key: 'uiexp.lend_increment_button' } });
			}).then(() => {
				// TODO: REMOVE Once Lend Increment Button EXP ENDS
				// Pre-fetch the assigned version for lend increment button
				return client.query({ query: experimentQuery, variables: { id: 'lend_increment_button' } });
			});
		}
	},
	created() {
		const basketData = this.apollo.readQuery({
			query: itemsInBasketQuery
		});
		this.itemsInBasket = _map(_get(basketData, 'shop.basket.items.values'), 'id');

		const userData = this.apollo.readQuery({
			query: userStatus
		});
		this.isLoggedIn = _get(userData, 'my.userAccount.id') !== undefined || false;
	},
	mounted() {
		this.$nextTick(() => {
			this.getRefinementCounts();
		});
	},
	methods: {
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
			const newDisjunctiveFacets = Object.assign({}, this.disjunctiveFacets);
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
			const newDisjunctiveFacets = Object.assign({}, this.disjunctiveFacets);

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
		getRefinementCounts() {
			console.log(this.$refs.sectorRefinements);
			console.log(this.$refs.sectorRefinements.$el);
			// well it takes a moment for these to show up...
			// > Whats the right way to wait and do this? To monitor it based on the component instance
			// > May be able to watch these or some other property to detect state changes
			setTimeout(() => {
				console.log(this.$refs.sectorRefinements.items);
			}, 1000);
			// const sectorRefinements = this.$refs.sectorRefinements.items || null;
			// const themeRefinements = _get(this.$refs.themeRefinements, 'items');
			// const tagRefinements = _get(this.$refs.tagRefinements, 'items');

			/* item signature
				count: 1561
				highlighted: "Agriculture"
				isRefined: false
				label: "Agriculture"
				value: "Agriculture"
			*/

			// console.log(this.$refs.sectorRefinements.getAttribute('items'));
			// console.log(themeRefinements);
			// console.log(tagRefinements);

			return 0;
		},
		handleFacetRemoved(payload) {
			console.log(payload);
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
			const newDisjunctiveFacets = Object.assign({}, this.disjunctiveFacets);

			// remove facets from existing set
			_forEach(newDisjunctiveFacets, (value, key) => {
				console.log(value, key);
				console.log(payload.value);
				// filter existing array by removed array
				if (key === payload.attribute) {
					newDisjunctiveFacets[key] = value.filter(facet => {
						console.log(facet);
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

.loan-card-group {
	position: relative;
}

.ais-Pagination-list {
	list-style: none;
	text-align: center;
	display: flex;
	margin: 0.75rem auto;
	justify-content: space-between;
	align-items: center;
	max-width: 17rem;

	.ais-Pagination-item {
		color: $kiva-text-light;
	}

	.ais-Pagination-item--active,
	.ais-Pagination-item--disabled {
		a {
			color: $kiva-text-light;
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
</style>
