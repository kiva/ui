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
			:new-mg-entrypoint="newMgEntrypointExp"
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
			:new-mg-entrypoint="newMgEntrypointExp"
		/>
	</div>
</template>

<script>
import _get from 'lodash/get';
import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';
import gql from 'graphql-tag';
import { indexIn } from '@/util/comparators';
import publicLendMenuQuery from '@/graphql/query/lendMenuData.graphql';
import privateLendMenuQuery from '@/graphql/query/lendMenuPrivateData.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
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
			newMgEntrypointExp: false,
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
		onLoad() {
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
		},
	},
	mounted() {
		if (this.hasUserId) {
			this.apollo.watchQuery({
				query: privateLendMenuQuery,
				variables: {
					userId: this.userId,
				},
			}).subscribe({
				next: ({ data }) => {
					this.favoritesCount = data?.lend?.loans?.totalCount ?? 0;
					this.savedSearches = data?.my?.savedSearches?.values ?? [];
				}
			});
		}

		// CORE-641 NEW MG ENTRYPOINT
		// this experiment is assigned in experimentPreFetch.js
		const newMgEntrypointExperiment = this.apollo.readFragment({
			id: 'Experiment:topnav_mg_entrypoint',
			fragment: experimentVersionFragment,
		}) || {};
		this.newMgEntrypointExp = newMgEntrypointExperiment.version === 'b';

		// Fire Event for EXP-CORE-644-June-2022
		if (newMgEntrypointExperiment.version) {
			this.$kvTrackEvent(
				'TopNav',
				'EXP-CORE-644-June-2022',
				newMgEntrypointExperiment.version
			);
		}

		this.$nextTick(() => {
			this.showMGUpsellLink = true;
		});
	}
};
</script>
