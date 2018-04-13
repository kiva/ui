<template>
	<div>
		<lend-list-menu class="hide-for-large" :categories="categories" :regions="regions" />
		<lend-mega-menu ref="mega" class="show-for-large" :categories="categories" :regions="regions" />
	</div>
</template>

<script>
import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';
import { mapState } from 'vuex';
import { indexIn } from '@/util/comparators';
import LendListMenu from './LendListMenu';
import LendMegaMenu from './LendMegaMenu';

export default {
	components: {
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
	},
	methods: {
		onOpen() {
			this.$refs.mega.onOpen();
		},
		onClose() {
			this.$refs.mega.onClose();
		}
	},
	beforeCreate() {
		this.$store.dispatch('getLendMenuInfo');
	},
};
</script>
