<template>
	<lightbox-filter
		class="country-filter"
		plural-name="countries"
		:all-items="countriesWithSelected"
		:current-ids="currentIsoCodes"
		@change="changeCountries"
	>
		<template #default="{ onChange }">
			<h2 class="lightbox-title">
				Select countries
			</h2>
			<div class="row collapse">
				<div class="small-6 columns region-list">
					<ul>
						<li v-for="(region, name) in regions" :key="name">
							<button
								class="region-button"
								@click="openRegion = name"
								:aria-pressed="openRegion === name ? 'true' : 'false'"
							>
								{{ name }}
							</button>
						</li>
					</ul>
				</div>
				<div class="small-6 columns country-list">
					<kv-expandable :skip-leave="true">
						<check-list
							v-if="currentRegion && currentRegion.length"
							:key="openRegion"
							:items="currentRegion"
							@change="onChange"
						/>
						<p v-else key="none">
							Pick a region
						</p>
					</kv-expandable>
				</div>
			</div>
		</template>
	</lightbox-filter>
</template>

<script>
import _get from 'lodash/get';
import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';
import gql from 'graphql-tag';
import KvExpandable from '@/components/Kv/KvExpandable';
import countryListQuery from '@/graphql/query/autolending/countryList.graphql';
import CheckList from './CheckList';
import LightboxFilter from './LightboxFilter';

export default {
	inject: ['apollo'],
	components: {
		CheckList,
		KvExpandable,
		LightboxFilter,
	},
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
		changeCountries(countries) {
			this.apollo.mutate({
				mutation: gql`mutation($countries: [String]) {
					autolending @client {
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

<style lang="scss">
@import 'settings';

.country-filter {
	$section-padding: 0.4rem 0.5rem;
	$desktop-section-padding: 0.2rem 1.5rem;

	.kv-lightbox-wrap .kv-lightbox .lightbox-row .lightbox-columns {
		max-width: 32rem;

		.lightbox-content {
			padding: 1rem 0;
		}
	}

	.lightbox-title {
		padding: $section-padding;
	}

	.region-list {
		border-right: 1px solid $kiva-stroke-gray;

		ul {
			list-style: none;
			margin: 0;
		}
	}

	.region-button {
		width: 100%;
		padding: $section-padding;
		color: $kiva-textlink;
		line-height: 1.8;
		font-size: 1rem;
		text-align: left;

		&:hover {
			color: $kiva-textlink-hover;
			text-decoration: underline;
		}

		&[aria-pressed="true"] {
			color: $kiva-text-light;
			text-decoration: none;
			background-color: $kiva-bg-darkgray;
		}
	}

	.country-list {
		p {
			color: $kiva-text-light;
			padding: $section-padding;
		}

		label {
			padding: $section-padding;
		}

		input {
			margin-bottom: 0;
		}
	}

	@include breakpoint(large) {
		.lightbox-title,
		.country-list p,
		.country-list label {
			padding: $desktop-section-padding;
		}

		.region-button {
			padding: $desktop-section-padding;
			font-size: rem-calc(18);
		}
	}
}
</style>
