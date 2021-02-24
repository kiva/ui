<template>
	<div>
		<h3 class="filter-title">
			Countries
		</h3>
		<kv-radio
			:id="`filter-all-countries`"
			radio-value="all"
			v-model="radio"
			@click="saveAny"
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
				v-if="currentFilterValues.length > 0"
				class="edit-button"
				@click="emitChangeEvent('some')"
			>
				Edit <kv-icon name="pencil" />
			</button>
		</kv-radio>
		<p class="country-list">
			{{ selectedFiltersFormattedString(selectedCountries) }}
		</p>
	</div>
</template>

<script>
import _map from 'lodash/map';
import _get from 'lodash/get';

import countryListQuery from '@/graphql/query/autolending/countryList.graphql';
import KvIcon from '@/components/Kv/KvIcon';
import KvRadio from '@/components/Kv/KvRadio';
import anyOrSelectedAutolendingRadio from '@/plugins/any-or-selected-autolending-radio-mixin';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		KvIcon,
		KvRadio,
	},
	mixins: [
		anyOrSelectedAutolendingRadio
	],
	data() {
		return {
			allCountries: [],
			radioKey: 'country'
		};
	},
	apollo: {
		query: countryListQuery,
		preFetch: true,
		result({ data }) {
			this.currentFilterValues = _get(
				data, 'autolending.currentProfile.loanSearchCriteria.filters.country'
			) || [];
			this.allCountries = _map(_get(data, 'lend.countryFacets'), 'country') || [];

			if (this.currentFilterValues.length) {
				this.radio = 'some';
			} else {
				this.radio = 'all';
			}
		},
	},
	computed: {
		selectedCountries() {
			return this.allCountries.filter(country => this.currentFilterValues.includes(country.isoCode));
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

$section-padding: 0.4rem 0.5rem;

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
