<template>
	<div>
		<ul class="lend-list-menu hide-for-large">
			<expandable-list-item title="Categories" name="lend-menu-category-panel">
				<ul>
					<li v-for="category in categories" :key="category.index">
						<router-link :to="category.url">
							{{ category.name }}
						</router-link>
					</li>
				</ul>
			</expandable-list-item>
			<expandable-list-item title="Regions" name="lend-menu-region-panel">
				<ul>
					<expandable-list-item
						v-for="region in regions"
						:key="region.name"
						:title="region.name"
						:name="`lend-menu-${region.name}-panel` | kebabCase"
					>
						<ul>
							<li v-for="country in region.countries" :key="country.name">
								<router-link :to="{ path: 'lend', query: { country: country.isoCode }}">
									{{ country.name }} ({{ country.count }})
								</router-link>
							</li>
						</ul>
					</expandable-list-item>
				</ul>
			</expandable-list-item>
			<router-link to="/lend">All loans</router-link>
		</ul>
		<div class="lend-mega-menu show-for-large">
			Hello there.
		</div>
	</div>
</template>

<script>
import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';
import { mapState } from 'vuex';
import { indexIn } from '@/util/comparators';
import ExpandableListItem from './ExpandableListItem';

export default {
	components: {
		ExpandableListItem
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
		})
	},
	beforeCreate() {
		this.$store.dispatch('getLendMenuInfo');
	}
};
</script>

<style lang="scss">
@import 'settings';
</style>
