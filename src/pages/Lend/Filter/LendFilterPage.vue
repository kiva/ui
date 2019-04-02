<template>
	<www-page class="lend-filter-page" :gray-background="true">
		<lend-header />
		<div class="row page-content">
			<ais-instant-search
				v-if="searchClient"
				:search-client="searchClient"
				:index-name="algoliaDefaultIndex">
				<lend-filter-menu
					:default-sort-indices="defaultSortIndices"
					:custom-categories="customCategories"
					:selected-custom-categories="selectedCustomCategories"
					@toggle-custom-category="toggleCustomCategory"
				/>
				<!-- eslint-disable vue/attribute-hyphenation -->
				<div class="small-12 columns">
					<ais-configure
						:hitsPerPage="12"
						:disjunctiveFacetsRefinements="disjunctiveFacets"
						ref="aisConfigure"
					/>
					<selected-refinements
						:custom-categories="customCategories"
						:selected-custom-categories="selectedCustomCategories"
						@remove-custom-category="removeCustomCategory"
						@clear-custom-categories="clearCustomCategories"
					/>
					<ais-hits
						class="loan-card-group row"
						:results-per-page="12">
						<template slot="default" slot-scope="{ items }">
							<algolia-adapter
								v-for="item in items" :key="item.id"
								:loan="item"
								:items-in-basket="itemsInBasket"
								:is-logged-in="isLoggedIn"
								loan-card-type="ListLoanCard"
								class="small-12 columns"
							/>
						</template>
					</ais-hits>
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

import itemsInBasketQuery from '@/graphql/query/basketItems.graphql';
import userStatus from '@/graphql/query/userId.graphql';

// Algolia Imports
import algoliaInit from '@/plugins/algolia-init-mixin';
import algoliaConfig from '@/plugins/algolia-config-mixin';
import {
	AisConfigure,
	AisInstantSearch,
	AisHits,
} from 'vue-instantsearch';
import AlgoliaAdapter from '@/components/LoanCards/AlgoliaLoanCardAdapter';
import AlgoliaPaginationWrapper from '@/pages/Lend/AlgoliaPaginationWrapper';
import AlgoliaPaginationStats from '@/pages/Lend/AlgoliaPaginationStats';
import LendFilterMenu from '@/pages/Lend/Filter/LendFilterMenu';
import SelectedRefinements from '@/pages/Lend/Filter/SelectedRefinements';

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
		// Set items in basket
		const itemsInBasketResults = this.apollo.readQuery({
			query: itemsInBasketQuery,
			variables: {
				basketId: cookieStore.get('kvbskt'),
			},
		});
		this.itemsInBasket = _map(_get(itemsInBasketResults, 'shop.basket.items.values'), 'id');
		// Set user status
		const userData = this.apollo.readQuery({ query: userStatus });
		this.isLoggedIn = _get(userData, 'my.userAccount.id') !== undefined || false;
	},
	data() {
		return {
			itemsInBasket: null,
			isLoggedIn: false,
			selectedCustomCategories: {},
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
			return client.query({
				query: itemsInBasketQuery,
			}).then(() => {
				// Pre-fetch user Status
				return client.query({ query: userStatus });
			});
		}
	},
	methods: {
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
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.lend-filter-page {
	.page-content {
		max-width: 63.75rem;
		padding: 0 1.5625rem;
	}
}
</style>
