<template>
	<div>
		<h3 class="filter-title">
			Countries
		</h3>
		<kv-radio
			:id="`filter-all-countries`"
			radio-value="all"
			v-model="radio"
		>
			Any countries
		</kv-radio>
		<kv-radio
			:id="`filter-some-countries`"
			radio-value="some"
			v-model="radio"
			@click="emitChangeEvent('some')"
		>
			Selected countries only
			<button
				v-if="currentIsoCodes.length > 0"
				class="edit-button"
				@click="emitChangeEvent('some')"
			>
				Edit <kv-icon name="pencil" />
			</button>
		</kv-radio>
		<p class="country-list">
			{{ selectedCountriesString }}
		</p>
	</div>
</template>

<script>
import _map from 'lodash/map';
import _get from 'lodash/get';

import countryListQuery from '@/graphql/query/autolending/countryList.graphql';
import KvIcon from '@/components/Kv/KvIcon';
import KvRadio from '@/components/Kv/KvRadio';

export default {
	inject: ['apollo'],
	components: {
		KvIcon,
		KvRadio,
	},
	props: {
		selectorShown: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			allCountries: [],
			currentIsoCodes: [],
			radio: 'all',
		};
	},
	apollo: {
		query: countryListQuery,
		preFetch: true,
		result({ data }) {
			this.currentIsoCodes = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.country') || [];
			this.allCountries = _map(_get(data, 'lend.countryFacets'), 'country') || [];

			if (this.currentIsoCodes.length) {
				this.radio = 'some';
			} else {
				this.radio = 'all';
			}
		},
	},
	methods: {
		emitChangeEvent(value) {
			this.$emit('change', {
				radioKey: 'countries',
				value
			});
		}
	},
	computed: {
		selectedCountries() {
			return this.allCountries.filter(country => this.currentIsoCodes.includes(country.isoCode));
		},
		// the selected items limited to 10
		selectedCountriesShortList() {
			return this.selectedCountries.slice(0, 10);
		},
		// the count of items that aren't being displayed
		countriesRemaining() {
			return this.selectedCountries.length - this.selectedCountriesShortList.length;
		},
		// string of names of selected items
		selectedCountriesString() {
			const arrayOfSelectedCountryNames = this.selectedCountriesShortList.map(country => country.name).join(', ');
			const extra = this.countriesRemaining > 0 ? `, +${this.countriesRemaining} more` : '';
			return `${arrayOfSelectedCountryNames}${extra}`;
		},
	},
	watch: {
		selectorShown(value) {
			// If going 'back to all options' and no countries are selected, set value back to any
			if (!value && this.currentIsoCodes.length === 0) {
				this.radio = 'all';
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

$section-padding: 0.4rem 0.5rem;
$desktop-section-padding: 0.2rem 1.5rem;

.edit-button {
	color: $kiva-textlink;
	font-weight: 300;
	margin-left: 0.55em;

	::v-deep .icon {
		width: 0.75rem;
		height: 0.75rem;
	}
}

p.country-list {
	color: $kiva-text-light;
	padding: $section-padding;
}
</style>
