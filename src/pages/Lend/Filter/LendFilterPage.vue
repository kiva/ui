<template>
	<www-page class="lend-filter-page" :gray-background="true">
		<lend-header
			:hard-left-align="true"
			class="filter-page-lend-header"
			browse-url="/lend-by-category"
			filter-url="/lend/filter"
		/>
		<div class="row page-content">
			<ais-instant-search
				v-if="searchClient"
				:search-client="searchClient"
				:index-name="algoliaDefaultIndex">
				<lend-filter-menu
					:default-sort-indices="defaultSortIndices"
					:custom-categories="customCategories"
					:selected-custom-categories="selectedCustomCategories"
					@clear-custom-categories="clearCustomCategories"
					@hide-filter-menu="hideFilterMenu"
					@show-filter-menu="showFilterMenu"
					@toggle-custom-category="toggleCustomCategory"
				/>
				<!-- eslint-disable vue/attribute-hyphenation -->
				<div class="small-12 columns">
					<ais-configure
						:hitsPerPage="12"
						:disjunctiveFacetsRefinements="disjunctiveFacets"
						clickAnalytics="true"
						ref="aisConfigure"
					/>
					<selected-refinements
						:custom-categories="customCategories"
						:selected-custom-categories="selectedCustomCategories"
						@remove-custom-category="removeCustomCategory"
						@clear-custom-categories="clearCustomCategories"
					/>
					<ais-state-results>
						<template slot-scope="{ page, hitsPerPage, queryID, index }">
							<ais-hits
								class="loan-card-group row"
								:class="{'filter-menu-open': filterMenuOpen}"
								:results-per-page="12"
							>
								<template slot="default" slot-scope="{ items }">
									<algolia-adapter
										v-for="(item, itemIndex) in items" :key="item.id"
										:loan="item"
										:items-in-basket="itemsInBasket"
										:is-logged-in="isLoggedIn"
										loan-card-type="ListLoanCard"
										:algolia-props="{ page, hitsPerPage, queryID, index, itemIndex, item }"
										class="small-12 columns"
									/>
								</template>
							</ais-hits>
						</template>
					</ais-state-results>
					<algolia-pagination-wrapper :padding="2" />
					<algolia-pagination-stats :padding="2" />
				</div>
				<!-- eslint-enable vue/attribute-hyphenation -->
			</ais-instant-search>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import _map from 'lodash/map';
import _forEach from 'lodash/forEach';
import cookieStore from '@/util/cookieStore';
import LoadingOverlay from '@/pages/Lend/LoadingOverlay';
import WwwPage from '@/components/WwwFrame/WwwPage';
import LendHeader from '@/pages/Lend/LendHeader';

import lendFilterPageQuery from '@/graphql/query/lendFilterPage.graphql';
import experimentQuery from '@/graphql/query/lendByCategory/experimentAssignment.graphql';
import updateExperimentVersion from '@/graphql/mutation/updateExperimentVersion.graphql';

// Algolia Imports
import algoliaInit from '@/plugins/algolia-init-mixin';
import algoliaConfig from '@/plugins/algolia-config-mixin';
import {
	AisConfigure,
	AisInstantSearch,
	AisHits,
	AisStateResults,
} from 'vue-instantsearch';
import AlgoliaAdapter from '@/components/LoanCards/AlgoliaLoanCardAdapter';
import AlgoliaPaginationWrapper from '@/pages/Lend/AlgoliaPaginationWrapper';
import AlgoliaPaginationStats from '@/pages/Lend/AlgoliaPaginationStats';
import LendFilterMenu from '@/pages/Lend/Filter/FilterComponents/LendFilterMenu';
import SelectedRefinements from '@/pages/Lend/Filter/FilterComponents/SelectedRefinements';

export default {
	components: {
		SelectedRefinements,
		LoadingOverlay,
		WwwPage,
		LendHeader,
		LendFilterMenu,
		AisConfigure,
		AisInstantSearch,
		AisHits,
		AisStateResults,
		AlgoliaAdapter,
		AlgoliaPaginationWrapper,
		AlgoliaPaginationStats,
	},
	metaInfo: {
		title: 'Lend Filter'
	},
	mixins: [
		algoliaInit,
		algoliaConfig
	],
	created() {
		// subscribe to and set page query data
		this.apollo.watchQuery({
			query: lendFilterPageQuery,
			variables: {
				basketId: cookieStore.get('kvbskt'),
			},
		}).subscribe({
			next: ({ data }) => {
				// Set items in basket (prefetch also sets up the subscribe query)
				this.itemsInBasket = _map(_get(data, 'shop.basket.items.values'), 'id');
				// Set user status
				this.isLoggedIn = _get(data, 'my.userAccount.id') !== undefined || false;
			},
		});

		// Update Lend Filter Exp
		this.getLendFilterExpVersion();
	},
	data() {
		return {
			itemsInBasket: null,
			isLoggedIn: false,
			filterMenuOpen: false,
			selectedCustomCategories: {},
			lendFilterExpActive: false,
			lendFilterExpVersion: '',
			shouldUpdateLendFilterExpCookie: false,
		};
	},
	computed: {
		disjunctiveFacets() {
			const sectorKey = 'sector.name';
			const themeDataKey = 'themeData.loanThemeTypeName';
			const tagsKey = 'tags.name';
			let sectorSet = new Set();
			let themeDataSet = new Set();
			let tagsSet = new Set();

			_forEach(this.selectedCustomCategories, (selected, customCategoryId) => {
				if (!selected) {
					return;
				}

				const customCategoryFacets = this.customCategories[customCategoryId].disjunctiveFacets;

				sectorSet = customCategoryFacets[sectorKey] && customCategoryFacets[sectorKey].length
					? new Set([...sectorSet, ...customCategoryFacets[sectorKey]])
					: sectorSet;
				themeDataSet = customCategoryFacets[themeDataKey] && customCategoryFacets[themeDataKey].length
					? new Set([...themeDataSet, ...customCategoryFacets[themeDataKey]])
					: themeDataSet;
				tagsSet = customCategoryFacets[tagsKey] && customCategoryFacets[tagsKey].length
					? new Set([...tagsSet, ...customCategoryFacets[tagsKey]])
					: tagsSet;
			});

			return {
				'sector.name': Array.from(sectorSet),
				'themeData.loanThemeTypeName': Array.from(themeDataSet),
				'tags.name': Array.from(tagsSet),
			};
		},
	},
	inject: [
		'apollo',
	],
	apollo: {
		preFetch(config, client) {
			// prefetch page data + experiment settings
			return client.query({
				query: lendFilterPageQuery,
				variables: {
					basketId: cookieStore.get('kvbskt')
				},
			});
		}
	},
	mounted() {
		this.updateLendFilterExp();
	},
	methods: {
		hideFilterMenu() {
			this.filterMenuOpen = false;
		},
		showFilterMenu() {
			this.filterMenuOpen = true;
		},
		toggleCustomCategory(categoryId) {
			this.$set(
				this.selectedCustomCategories,
				categoryId,
				!this.selectedCustomCategories[categoryId],
			);
		},
		removeCustomCategory(categoryId) {
			this.$set(
				this.selectedCustomCategories,
				categoryId,
				false,
			);
		},
		clearCustomCategories() {
			_forEach(this.selectedCustomCategories, (_, categoryId) => {
				this.$set(
					this.selectedCustomCategories,
					categoryId,
					false,
				);
			});
		},
		getLendFilterExpVersion() {
			// Lend Filter Exp
			// Read temp cookie (set before redirect from /lend) + Assignment
			const lendListViewExpLegacy = cookieStore.get('kvlendfilter');
			// We have a legacy experiment already set
			if (lendListViewExpLegacy !== '') {
				console.log('found legacy exp');
				// use legacy version
				this.lendFilterExpVersion = lendListViewExpLegacy;
				// Once Mounted we need to update the ui cookie to ensure future continuity between stacks
				this.shouldUpdateLendFilterExpCookie = true;
			} else {
				console.log('assigning via ui exp manager');
				// we have no legacy exp setup, so assign in ui
				const lendFilterEXP = this.apollo.readQuery({
					query: experimentQuery,
					variables: { id: 'lend_filter_v3' },
				});

				this.lendFilterExpVersion = _get(lendFilterEXP, 'experiment.version');
			}
			// Update exp active values
			// Set Active Status
			// TODO: DO we actually need this on this page?
			this.lendFilterExpActive = this.lendFilterExpVersion === 'b';
		},
		updateLendFilterExp() {
			// if we've recieved overridden the ui assignment with a legacy assignment
			if (this.shouldUpdateLendFilterExpCookie) {
				// re-assign uiab cookie using our legacy assignment
				this.apollo.mutate({
					mutation: updateExperimentVersion,
					variables: {
						id: 'lend_filter',
						version: this.lendFilterExpVersion
					}
				}).then(newExpData => {
					// will remove
					console.log(newExpData);
					// remove legacy cookie
					cookieStore.remove('kvlendfilter');
				});
			}
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.lend-filter-page {
	scroll-behavior: smooth;
	$filter-transition: 0.25s ease-out;

	.page-content {
		.loan-card-group {
			opacity: 1;
			transition: opacity $filter-transition;

			&.filter-menu-open {
				opacity: 0.2;
			}
		}
	}
}
</style>
