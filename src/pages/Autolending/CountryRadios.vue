<template>
	<div>
		<h3 class="tw-mb-2">
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
				class="tw-text-link tw-ml-1"
				@click="emitChangeEvent('some')"
			>
				Edit <kv-icon name="pencil" class="tw-w-1.5 tw-h-1.5" />
			</button>
		</kv-radio>
		<p class="tw-text-tertiary tw-p-1">
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
	name: 'CountryRadios',
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
