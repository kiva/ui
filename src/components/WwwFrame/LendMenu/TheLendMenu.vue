<template>
	<div class="the-lend-menu">
		<kv-loading-spinner v-if="isLoading" />
		<lend-list-menu
			ref="list"
			class="hide-for-large"
			v-show="!isLoading"
			:categories="categories"
			:regions="regions"
		/>
		<lend-mega-menu
			ref="mega"
			class="show-for-large"
			v-show="!isLoading"
			:categories="categories"
			:regions="regions"
		/>
	</div>
</template>

<script>
import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';
import { mapState } from 'vuex';
import { indexIn } from '@/util/comparators';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import LendListMenu from './LendListMenu';
import LendMegaMenu from './LendMegaMenu';

export default {
	components: {
		KvLoadingSpinner,
		LendListMenu,
		LendMegaMenu,
	},
	computed: {
		...mapState({
			categories: state => state.loan.headerCategories,
			regions: state => {
				const facets = _map(state.loan.countryFacets, facet => {
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
				return regions.sort(indexIn(state.loan.regionDisplayOrder, 'name'));
			}
		}),
		isLoading() {
			return this.regions.length === 0;
		},
	},
	methods: {
		onOpen() {
			this.$refs.mega.onOpen();
		},
		onClose() {
			this.$refs.mega.onClose();
		},
		onLoad() {
			this.$store.dispatch('getLendMenuInfo');
		},
	},
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
