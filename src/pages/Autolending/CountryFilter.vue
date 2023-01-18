<template>
	<div>
		<h4 class="tw-mb-2">
			Countries
		</h4>
		<div class="row collapse">
			<div class="small-6 columns region-list">
				<ul>
					<li v-for="(region, name) in regions" :key="name">
						<button
							class="tw-p-1"
							:class="{
								'tw-text-tertiary' : openRegion === name,
								'tw-text-link' : openRegion !== name
							}"
							@click="openRegion = name"
							:aria-pressed="openRegion === name ? 'true' : 'false'"
						>
							{{ name }}
						</button>
					</li>
				</ul>
			</div>
			<div class="small-6 columns">
				<check-list
					v-if="currentRegion && currentRegion.length"
					:key="openRegion"
					:items="currentRegion"
					@change="onChange"
				/>
				<p v-else key="none" class="tw-text-tertiary tw-p-1">
					Pick a region
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';
import { gql } from '@apollo/client';
import countryListQuery from '@/graphql/query/autolending/countryList.graphql';
import anyOrSelectedAutolendingFilter from '@/plugins/any-or-selected-autolending-filter-mixin';
import CheckList from './CheckList';

export default {
	name: 'CountryFilter',
	inject: ['apollo', 'cookieStore'],
	components: {
		CheckList,
	},
	mixins: [
		anyOrSelectedAutolendingFilter
	],
	data() {
		return {
			allCountries: [],
			currentIsoCodes: [],
			openRegion: '',
		};
	},
	computed: {
		countriesWithSelected() {
			return _map(this.allCountries, ({ isoCode, name, region }) => {
				return {
					id: isoCode,
					name,
					region,
					selected: this.currentIsoCodes.indexOf(isoCode) > -1,
				};
			});
		},
		regions() {
			return _groupBy(this.countriesWithSelected, 'region');
		},
		currentRegion() {
			return _sortBy(_get(this.regions, this.openRegion), 'name');
		},
	},
	apollo: {
		query: countryListQuery,
		preFetch: true,
		result({ data }) {
			this.allCountries = _map(_get(data, 'lend.countryFacets'), 'country') || [];
			this.currentIsoCodes = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.country') || [];
		},
	},
	methods: {
		onChange(checked, values) {
			// Filter mixin function that calls mutation function
			this.changeCountries(this.getValues(checked, values, this.currentIsoCodes));
		},
		changeCountries(countries) {
			this.apollo.mutate({
				mutation: gql`mutation updateCountries($countries: [String]) {
					autolending @client {
						id
						editProfile(profile: {
							loanSearchCriteria: {
								filters: {
									country: $countries
								}
							}
						})
					}
				}`,
				variables: {
					countries: countries.length ? countries : null,
				}
			});
		}
	},
};
</script>
