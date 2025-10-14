<template>
	<div>
		<lend-list-menu
			ref="list"
			class="lg:tw-hidden"
			:categories="computedCategories"
			:regions="regions"
			:searches="savedSearches"
			:favorites="favoritesCount"
			:user-id="userId"
			:is-channels-loading="isChannelsLoading"
			:is-regions-loading="isRegionsLoading"
			:is-user-data-loading="isUserDataLoading"
			:show-m-g-upsell-link="showMGUpsellLink"
		/>
		<lend-mega-menu
			ref="mega"
			class="tw-hidden lg:tw-block"
			:categories="computedCategories"
			:regions="regions"
			:searches="savedSearches"
			:favorites="favoritesCount"
			:user-id="userId"
			:is-channels-loading="isChannelsLoading"
			:is-regions-loading="isRegionsLoading"
			:is-user-data-loading="isUserDataLoading"
			:show-m-g-upsell-link="showMGUpsellLink"
		/>
	</div>
</template>

<script>
import _get from 'lodash/get';
import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';
import { gql } from 'graphql-tag';

import { indexIn } from '#src/util/comparators';
import publicLendMenuQuery from '#src/graphql/query/lendMenuData.graphql';
import privateLendMenuQuery from '#src/graphql/query/lendMenuPrivateData.graphql';
import countryListQuery from '#src/graphql/query/countryList.graphql';
import LendListMenu from './LendListMenu';
import LendMegaMenu from './LendMegaMenu';

const pageQuery = gql`query lendMenu {
		my {
			id
			userAccount {
				id
			}
		}
	}`;

export default {
	name: 'TheLendMenu',
	components: {
		LendListMenu,
		LendMegaMenu,
	},
	inject: {
		apollo: { default: null },
		cookieStore: { default: null },
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
			isRegionsLoading: true,
			isChannelsLoading: true,
			isUserDataLoading: false,
			showMGUpsellLink: false,
		};
	},
	apollo: {
		query: pageQuery,
		preFetch: true,
		shouldPreFetch(config, { renderConfig }) {
			// Don't prefetch if using CDN caching
			return !renderConfig.useCDNCaching;
		},
		result({ data }) {
			this.userId = _get(data, 'my.userAccount.id');
		},
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
			const categories = _map(this.categories, category => {
				const updatedCat = JSON.parse(JSON.stringify(category));
				updatedCat.url = updatedCat.url.replace('lend', 'lend-by-category');
				return updatedCat;
			});
			return _sortBy(categories, 'name');
		},
		hasUserId() {
			return !!this.userId;
		}
	},
	methods: {
		onClose() {
			this.$refs.list.onClose();
			this.$refs.mega.onClose();
		},
		async onLoad() {
			this.apollo.watchQuery({
				query: countryListQuery,
			}).subscribe({
				next: ({ data }) => {
					this.countryFacets = _get(data, 'lend.countryFacets');
					this.isRegionsLoading = false;
				}
			});

			this.apollo.watchQuery({ query: publicLendMenuQuery }).subscribe({
				next: ({ data }) => {
					this.categories = _get(data, 'lend.loanChannels.values');
					this.isChannelsLoading = false;
				}
			});

			if (this.hasUserId) {
				const { data } = await this.apollo.query({
					query: privateLendMenuQuery,
					variables: {
						userId: this.userId,
					},
					fetchPolicy: 'network-only',
				});

				this.isUserDataLoading = false;
				this.favoritesCount = data?.lend?.loans?.totalCount ?? 0;
				this.savedSearches = data?.my?.savedSearches?.values ?? [];
			}
		},
	},
	created() {
		this.isUserDataLoading = this.$renderConfig?.useCDNCaching && this.$renderConfig?.cdnNotedLoggedIn;
	},
	mounted() {
		this.$nextTick(() => {
			this.showMGUpsellLink = true;
		});
	}
};
</script>
