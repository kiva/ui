<template>
	<a
		v-if="countriesNotLentTo.length"
		class="find-new-country"
		:href="searchURL"
		@click.prevent="startSearch"
		v-kv-track-event="['Lending', 'click-countries-not-lent']"
	>
		Find a loan in a new country
	</a>
</template>

<script>
import _differenceBy from 'lodash/differenceBy';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';
import { createWidgetMixin } from 'vue-instantsearch';
import userIdQuery from '@/graphql/query/userId.graphql';
import countriesNotLentQuery from '@/graphql/query/countriesNotLentTo.graphql';

export default {
	inject: ['apollo'],
	mixins: [
		createWidgetMixin({
			connector: (renderFn, unmountFn) => () => {
				// declaring here so that they can be used by both init() and render()
				let refine;
				let getURL;

				return {
					init({ helper, createURL }) {
						// Set location refinement to all unlent countries
						refine = (attr, values) => {
							helper.clearRefinements(attr);
							values.forEach(val => helper.addDisjunctiveFacetRefinement(attr, val));
							helper.search();
						};

						// Generate a search url based on the changes that would happen to the state
						getURL = (attr, values) => {
							helper.state.clearRefinements(attr);
							values.forEach(val => helper.state.addDisjunctiveFacetRefinement(attr, val));
							return createURL(helper.state);
						};

						// This object is exposed as this.state in the component
						renderFn({ refine, getURL }, true);
					},

					render() {
						// This object is exposed as this.state in the component
						renderFn({ refine, getURL }, false);
					},

					dispose() {
						unmountFn();
					},
				};
			},
		}),
	],
	props: {
		attribute: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			countriesNotLentTo: [],
		};
	},
	computed: {
		facetValues() {
			// transform the country objects into the algolia facet values (e.g. 'Region > Name')
			return this.countriesNotLentTo.map(({ region, name }) => `${region} > ${name}`);
		},
		searchURL() {
			// getUrl is defined in the connector of the createWidgetMixin above
			return this.state ? this.state.getURL(this.attribute, this.countriesNotLentTo) : '';
		},
	},
	apollo: {
		preFetch(config, client) {
			return new Promise((resolve, reject) => {
				// query for the user id first, and only query for more data if the user is logged in
				client.query({ query: userIdQuery }).then(result => {
					if (result.data.my) {
						// user is logged in, so fetch country lending info
						return client.query({ query: countriesNotLentQuery });
					}
					// user isn't logged in so resolve without any data
					resolve({ data: {} });
				}).then(resolve).catch(reject);
			});
		},
	},
	created() {
		try {
			// Check for prefetched data
			const { my } = this.apollo.readQuery({ query: userIdQuery });
			if (my) {
				const data = this.apollo.readQuery({ query: countriesNotLentQuery });
				this.countriesNotLentTo = this.getCountriesNotLentTo(data);
			} else {
				this.countriesNotLentTo = [];
			}
		} catch (e) {
			this.countriesNotLentTo = [];
		}

		// watch for the user logging in/out and fetch data when they are logged in
		this.apollo.watchQuery({ query: userIdQuery }).subscribe({
			next: result => {
				if (result.data.my) {
					this.apollo.query({
						query: countriesNotLentQuery,
						fetchPolicy: 'network-only',
					}).then(({ data }) => {
						this.countriesNotLentTo = this.getCountriesNotLentTo(data);
					}).catch(() => {
						this.countriesNotLentTo = [];
					});
				} else {
					this.countriesNotLentTo = [];
				}
			}
		});
	},
	methods: {
		startSearch() {
			if (this.state) {
				// refine is defined in the connector of the createWidgetMixin above
				this.state.refine(this.attribute, this.facetValues);
			}
		},
		getCountriesNotLentTo(data) {
			// get an array of objects for all the countries where kiva is currently active
			const allCountries = _map(_get(data, 'lend.countryFacets'), 'country');
			// get the array of objects for all the countries the user has lent to
			const countriesLentTo = _get(data, 'my.lendingStats.countriesLentTo');
			// get countries not lent to by removing all the countries from allCountries that are in countriesLentTo
			const countriesNotLentTo = _differenceBy(allCountries, countriesLentTo, 'isoCode');
			// return the result, sorted by country name
			return _sortBy(countriesNotLentTo, 'name');
		},
	},
};
</script>

<style lang="scss" scoped>
.find-new-country {
	display: block;
	margin-bottom: 0.5rem;
}
</style>
