<template>
	<div class="the-lend-menu">
		<kv-loading-spinner v-if="isLoading" />
		<lend-list-menu
			ref="list"
			class="hide-for-large"
			v-show="!isLoading"
			:categories="computedCategories"
			:regions="regions"
			:searches="savedSearches"
			:favorites="favoritesCount"
			:user-id="userId"
		/>
		<lend-mega-menu
			ref="mega"
			class="show-for-large"
			v-show="!isLoading"
			:categories="computedCategories"
			:regions="regions"
			:searches="savedSearches"
			:favorites="favoritesCount"
			:user-id="userId"
		/>
	</div>
</template>

<script>
import _get from 'lodash/get';
import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';
import { indexIn } from '@/util/comparators';
import publicLendMenuQuery from '@/graphql/query/lendMenuData.graphql';
import privateLendMenuQuery from '@/graphql/query/lendMenuPrivateData.graphql';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import LendListMenu from './LendListMenu';
import LendMegaMenu from './LendMegaMenu';

export default {
	components: {
		KvLoadingSpinner,
		LendListMenu,
		LendMegaMenu,
	},
	inject: ['apollo'],
	props: {
		legacyExpData: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			userId: null,
			categories: [],
			countryFacets: [],
			favoritesCount: 0,
			savedSearches: [],
			regionDisplayOrder: [
				'North America',
				'Central America',
				'South America',
				'Africa',
				'Eastern Europe',
				'Middle East',
				'Asia',
				'Oceania'
			],
			loadingSemaphore: 0,
		};
	},
	computed: {
		regions() {
			const facets = _map(this.countryFacets, facet => {
				return {
					name: facet.country.name,
					region: facet.country.region,
					isoCode: facet.country.isoCode.toLowerCase(),
					count: facet.count || 0,
				};
			});
			const groups = _groupBy(facets, 'region');
			const regions = _map(groups, (countries, name) => {
				return {
					name,
					countries: _sortBy(countries, 'name'),
				};
			});
			return regions.sort(indexIn(this.regionDisplayOrder, 'name'));
		},
		computedCategories() {
			let categoryRowsActive = false;
			// try to get status of category row exp
			try {
				const expData = JSON.parse(this.legacyExpData);
				const categoryRowsExp = _get(expData, 'category_rowscategory_rows');
				categoryRowsActive = categoryRowsExp && categoryRowsExp.version === 'b';
			} catch (e) { console.error(e); }
			// convert category urls to use /lend-by-category if exp is active
			if (categoryRowsActive) {
				return _map(this.categories, category => {
					const updatedCat = JSON.parse(JSON.stringify(category));
					updatedCat.url = updatedCat.url.replace('lend', 'lend-by-category');
					return updatedCat;
				});
			}
			return this.categories;
		},
		isLoading() {
			return this.loadingSemaphore > 0 || this.categories.length === 0;
		},
		hasUserId() {
			return !!this.userId;
		},
	},
	methods: {
		onOpen() {
			this.$refs.mega.onOpen();
		},
		onClose() {
			this.$refs.list.onClose();
			this.$refs.mega.onClose();
		},
		onLoad() {
			this.apollo.watchQuery({ query: publicLendMenuQuery }).subscribe({
				next: ({ data }) => {
					this.userId = _get(data, 'my.userAccount.id');
					this.categories = _get(data, 'lend.loanChannels.values');
					this.countryFacets = _get(data, 'lend.countryFacets');
				}
			});
		},
		startLoading() {
			this.loadingSemaphore += 1;
		},
		stopLoading() {
			if (this.loadingSemaphore > 0) {
				this.loadingSemaphore -= 1;
			} else {
				this.loadingSemaphore = 0;
			}
		},
	},
	watch: {
		hasUserId(hasUserId) {
			if (hasUserId) {
				this.startLoading();
				this.apollo.query({
					query: privateLendMenuQuery,
					variables: {
						userId: this.userId,
					}
				}).then(({ data, errors }) => {
					if (!errors) {
						this.favoritesCount = _get(data, 'lend.loans.totalCount');
						this.savedSearches = _get(data, 'my.savedSearches.values');
					} else {
						this.favoritesCount = 0;
						this.savedSearches = [];
					}
				}).finally(() => {
					this.stopLoading();

					// data might have changed since the initial render, so trigger any needed updates
					this.onOpen();
				});
			}
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.the-lend-menu {
	.loading-spinner {
		margin: 1rem;
		width: 3rem;
		height: 3rem;
	}
}
</style>
