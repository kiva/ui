<template>
	<div class="country-filters">
		<div class="row collapse">
			<div class="small-12 columns">
				<div
					v-for="(name, index) in Object.keys(regions).sort()"
					:key="name"
					:id="`${index}-region`"
					class="country-filters__region-section"
				>
					<h4 class="tw-mb-1">
						{{ name }}
					</h4>
					<check-list
						key="`${name}-country-list`"
						:items="regions[name]"
						:use-columns="true"
						@change="onChange"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import _groupBy from 'lodash/groupBy';
import anyOrSelectedAutolendingFilter from '@/plugins/any-or-selected-autolending-filter-mixin';
import CheckList from '@/pages/Autolending/CheckList';

export default {
	components: {
		CheckList,
	},
	mixins: [
		anyOrSelectedAutolendingFilter
	],
	props: {
		allCountries: {
			type: Array,
			default: () => []
		},
		initialCountries: {
			type: Array,
			default: () => []
		},
		selectedCountries: {
			type: Array,
			default: () => []
		},
	},
	data() {
		return {
			currentIsoCodes: [],
		};
	},
	created() {
		this.setFilterState();
	},
	computed: {
		countriesWithSelected() {
			return this.eligibleCountries
				.filter(country => country.numLoansFundraising > 0)
				.map(({
					isoCode, name, region
				}) => {
					return {
						id: isoCode,
						name: `${name}`,
						region,
						selected: this.currentIsoCodes.indexOf(isoCode) > -1,
					};
				});
		},
		eligibleCountries() {
			// filters all Countries against prescribed lsc theme
			const eligibleCountries = this.allCountries.filter(country => {
				// TODO: potentially exclude some countries simimlar to lend/filter
				if (this.initialCountries.length) {
					return this.initialCountries.includes(country.isoCode) || false;
				}
				return true;
			});
			return eligibleCountries || [];
		},
		regions() {
			const groupedRegions = _groupBy(this.countriesWithSelected, 'region');
			// alphabetize countries within each region
			Object.keys(groupedRegions).forEach(region => {
				groupedRegions[region].sort((a, b) => { return (a.name > b.name) ? 1 : -1; });
			});
			return groupedRegions;
		},
	},
	watch: {
		initialCountries(next, prev) {
			if (!this.selectedCountries && next !== prev) {
				this.setFilterState();
			}
		},
		selectedCountries(next, prev) {
			if (next !== prev) {
				this.setFilterState();
			}
		}
	},
	methods: {
		onChange(checked, values) {
			// Filter mixin function that calls mutation function
			this.changeCountries(this.getValues(checked, values, this.currentIsoCodes));
		},
		changeCountries(countries) {
			this.currentIsoCodes = countries;
			this.$emit('updated-filters', {
				country: countries.length ? countries : null
			});
		},
		setFilterState() {
			// set currently selected if present
			if (this.selectedCountries) {
				this.currentIsoCodes = this.selectedCountries;
				return true;
			}
			// fallback to initial settings if present
			if (this.initialCountries) {
				this.currentIsoCodes = this.initialCountries;
				return true;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
// @import 'settings';

.country-filters {
	&__region-section {
		margin-bottom: 1rem;
	}
}
</style>
