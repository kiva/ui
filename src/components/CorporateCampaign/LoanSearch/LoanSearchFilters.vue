<template>
	<div class="loan-search-filters">
		<div class="filter-list">
			<h3>Filter {{ totalCount }} Loans:</h3>
			<ul>
				<li @click="showFilters('gender')">
					Gender
				</li>
				<li @click="showFilters('location')">
					Location
				</li>
				<li @click="showFilters('sector')">
					Sector
				</li>
				<li @click="showFilters('tags')">
					Tags
				</li>
				<li @click="showFilters('attribute')">
					Attributes
				</li>
			</ul>
		</div>

		<kv-lightbox
			class="filter-controls-lightbox"
			id="filterControlsLightbox"
			title="Filter Loans"
			:visible="filtersVisible"
			@lightbox-closed="filtersVisible = false"
		>
			<gender-filter
				class="filter-type gender-filter"
				:initial-gender="initialGender"
				:selected-gender="selectedGender"
				@updated-filters="handleUpdatedFilters"
			/>

			<location-filter
				class="filter-type location-filter-container"
				:all-countries="allCountries"
				:initial-countries="initialCountries"
				:selected-countries="selectedCountries"
				@updated-filters="handleUpdatedFilters"
			/>

			<sector-filter
				class="filter-type sector-filter"
				:all-sectors="allSectors"
				:initial-sectors="initialSectors"
				:selected-sectors="selectedSectors"
				@updated-filters="handleUpdatedFilters"
			/>

			<attribute-filter
				class="filter-type attribute-filter"
				:all-attributes="allAttributes"
				:initial-attributes="initialAttributes"
				:selected-attributes="selectedAttributes"
				@updated-filters="handleUpdatedFilters"
			/>

			<tag-filter
				class="filter-type tag-filter"
				:all-tags="allTags"
				:initial-tags="initialTags"
				:selected-tags="selectedTags"
				@updated-filters="handleUpdatedFilters"
			/>

			<template slot="controls">
				<kv-button
					class="button smallest"
					@click.native.prevent="applyFilters"
				>
					Apply Filters
				</kv-button>
			</template>
		</kv-lightbox>
	</div>
</template>

<script>
import _sortBy from 'lodash/sortBy';
import gql from 'graphql-tag';
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';
import AttributeFilter from '@/components/CorporateCampaign/LoanSearch/AttributeFilter';
import GenderFilter from '@/components/CorporateCampaign/LoanSearch/GenderFilter';
import LocationFilter from '@/components/CorporateCampaign/LoanSearch/LocationFilter';
import SectorFilter from '@/components/CorporateCampaign/LoanSearch/SectorFilter';
import TagFilter from '@/components/CorporateCampaign/LoanSearch/TagFilter';

const filterOptionsQuery = gql`
	query filterOptionsQuery {
		lend {
			countryFacets {
				country {
					isoCode
					name
					numLoansFundraising
					region
				}
			}
			loanThemeFilter {
				id
				name
			}
			sector {
				id
				name
			}
			tag {
				id
				name
			}
		}
	}
`;

export default {
	inject: ['apollo'],
	components: {
		KvButton,
		KvLightbox,
		AttributeFilter,
		GenderFilter,
		LocationFilter,
		SectorFilter,
		TagFilter
	},
	props: {
		initialFilters: {
			type: Object,
			default: () => {}
		},
		totalCount: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			allAttributes: [],
			allCountries: [],
			allSectors: [],
			allTags: [],
			filtersVisible: false,
			initialFiltersCopy: null,
			modifiedFilters: null,
		};
	},
	mounted() {
		// fetch loan filter options
		this.apollo.query({
			query: filterOptionsQuery
		}).then(({ data }) => {
			this.allAttributes = _sortBy(data.lend?.loanThemeFilter ?? [], 'country.name');
			const countries = data.lend?.countryFacets ?? [];
			this.allCountries = countries.map(entry => entry.country);
			this.allSectors = _sortBy(data.lend?.sector ?? [], 'name');
			this.allTags = _sortBy(data.lend?.tag ?? [], 'name');
		});
	},
	computed: {
		// Attributes are also known as LoanThemes
		initialAttributes() {
			return this.initialFilters.theme || [];
		},
		selectedAttributes() {
			const incomingFilter = this.initialFiltersCopy.theme !== this.modifiedFilters.theme
				? this.modifiedFilters.theme : this.initialFiltersCopy.theme;
			return incomingFilter || [];
		},
		initialGender() {
			return this.initialFilters.gender || 'both';
		},
		selectedGender() {
			const incomingFilter = this.initialFiltersCopy.gender !== this.modifiedFilters.gender
				? this.modifiedFilters.gender : this.initialFiltersCopy.gender;
			return incomingFilter || 'both';
		},
		initialCountries() {
			// list of 2 character country code
			return this.initialFilters.country || [];
		},
		selectedCountries() {
			const incomingFilter = this.initialFiltersCopy.country !== this.modifiedFilters.country
				? this.modifiedFilters.country : this.initialFiltersCopy.country;
			return incomingFilter || [];
		},
		initialSectors() {
			return this.initialFilters.sector || [];
		},
		selectedSectors() {
			const incomingFilter = this.initialFiltersCopy.sector !== this.modifiedFilters.sector
				? this.modifiedFilters.sector : this.initialFiltersCopy.sector;
			return incomingFilter || [];
		},
		initialTags() {
			return this.initialFilters.loanTags || [];
		},
		selectedTags() {
			const incomingFilter = this.initialFiltersCopy.loanTags !== this.modifiedFilters.loanTags
				? this.modifiedFilters.loanTags : this.initialFiltersCopy.loanTags;
			return incomingFilter || [];
		}
	},
	watch: {
		initialFilters: {
			handler() {
				// establish non-reactive copy of initial filters object
				this.initialFiltersCopy = this.copyFilters(this.initialFilters);
				// establish non-reactive copy ready for modification
				this.modifiedFilters = this.copyFilters(this.initialFilters);
			},
			immediate: true,
			deep: true,
		}
	},

	methods: {
		showFilters() {
			this.filtersVisible = true;
		},
		handleUpdatedFilters(payload) {
			// console.log('handleUpdatedFilters: ', payload);
			const filterKeys = Object.keys(payload);
			// console.log('filterKeys: ', filterKeys);
			filterKeys.forEach(key => {
				this.modifiedFilters[key] = payload[key];
			});
		},
		applyFilters() {
			// console.log(this.modifiedFilters);
			this.$emit('updated-filters', this.modifiedFilters);
			this.filtersVisible = false;
		},
		// TODO: Move to Util file
		copyFilters(initialFilters) {
			const filtersCopy = {};

			const initialFilterKeys = Object.keys(initialFilters);
			initialFilterKeys.forEach(key => {
				// copy an object
				if (
					typeof initialFilters[key] === 'object'
					&& initialFilters[key]
					&& initialFilters[key] === 'undefined'
				) {
					filtersCopy[key] = { ...initialFilters[key] };

				// copy an array
				} else if (
					typeof initialFilters[key] === 'object'
					&& initialFilters[key]
					&& initialFilters[key].length
				) {
					filtersCopy[key] = initialFilters[key].slice();

				// copy a string
				} else if (typeof initialFilters[key] === 'string') {
					filtersCopy[key] = initialFilters[key].toString();

				// copy a boolean
				} else if (typeof initialFilters[key] === 'boolean') {
					filtersCopy[key] = Boolean(initialFilters[key]);

				// handle undefined defaults
				} else if (typeof initialFilters[key] === 'undefined') {
					filtersCopy[key] = undefined;

				// handle null defaults and all others
				} else {
					filtersCopy[key] = null;
				}
			});

			return filtersCopy;
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.filter-list {
	margin: 0 1rem;

	@include breakpoint(medium) {
		margin: 0 3rem;
	}

	@include breakpoint(large) {
		display: flex;
		overflow: scroll;
	}

	h3 {
		display: block;
		padding: 0.5rem;
	}

	ul {
		display: flex;
		margin: 0;
		overflow-x: scroll;

		@include breakpoint(large) {
			overflow: auto;
		}

		li {
			padding: 0.5rem;
			cursor: pointer;

			&:hover {
				text-decoration: underline;
			}
		}
	}
}

.filter-controls-lightbox {
	.filter-type {
		padding: 0 0 1rem;
	}
}
</style>
