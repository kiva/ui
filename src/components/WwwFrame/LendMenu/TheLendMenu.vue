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
			:is-regions-loading="isRegionsLoading"
			:is-channels-loading="isChannelsLoading"
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
			:is-regions-loading="isRegionsLoading"
			:is-channels-loading="isChannelsLoading"
			:show-m-g-upsell-link="showMGUpsellLink"
		/>
	</div>
</template>

<script>
import _get from 'lodash/get';
import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';
import { gql } from '@apollo/client';

import { indexIn } from '@/util/comparators';
import publicLendMenuQuery from '@/graphql/query/lendMenuData.graphql';
import privateLendMenuQuery from '@/graphql/query/lendMenuPrivateData.graphql';
import LendListMenu from './LendListMenu';
import LendMegaMenu from './LendMegaMenu';

const pageQuery = gql`query lendMenu {
		my {
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
	inject: ['apollo', 'cookieStore'],
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
			isRegionsLoading: true,
			isChannelsLoading: true,
			showMGUpsellLink: false,
		};
	},
	apollo: {
		query: pageQuery,
		preFetch: true,
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
		},
	},
	methods: {
		onClose() {
			this.$refs.list.onClose();
			this.$refs.mega.onClose();
		},
		async onLoad() {
			this.apollo.watchQuery({
				query: gql`query countryFacets {
					lend {
						countryFacets {
							count
							country {
								name
								region
								isoCode
							}
						}
					}

				}`
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

				this.favoritesCount = data?.lend?.loans?.totalCount ?? 0;
				this.savedSearches = data?.my?.savedSearches?.values ?? [];
			}
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.showMGUpsellLink = true;
		});
	}
};
</script>
