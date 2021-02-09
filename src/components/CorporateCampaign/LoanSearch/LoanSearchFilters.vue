<template>
	<div class="loan-filters">
		<div class="loan-filters__top-row">
			<div class="loan-filters__controls">
				<kv-button
					class="loan-filters__toggle rounded smallest secondary"
					@click.native.prevent="showFilters()"
				>
					Filter loans

					<kv-icon
						class="loan-filters__toggle-icon"
						name="small-chevron"
						:from-sprite="true"
						aria-hidden="true"
					/>
				</kv-button>
				<span class="loan-filters__total-count">{{ totalCount }} loans</span>
			</div>

			<div class="loan-filters__loan-display">
				<kv-pill-toggle
					id="pill"
					:options="[
						{
							title: 'Rows',
							key: 'rows',
						},
						{
							title: 'Grid',
							key: 'grid',
						},
					]"
					selected="rows"
					@pill-toggled="(val) => { $emit('set-loan-display', val === 'rows') }"
				/>
			</div>
		</div>

		<div v-if="filterChips.length" class="loan-filters__chips">
			<kv-chip
				v-for="(filter, index) in filterChips"
				:key="index"
				:title="cleanChipName(filter.name)"
				@click-chip="handleRemoveFilter(filter)"
			/>
		</div>

		<kv-lightbox
			class="loan-filters__lightbox"
			id="filterControlsLightbox"
			title="Filter Loans"
			:visible="filtersVisible"
			@lightbox-closed="filtersVisible = false"
		>
			<div class="loan-filter-controls">
				<gender-filter
					:initial-gender="initialGender"
					:selected-gender="selectedGender"
					@updated-filters="handleUpdatedFilters"
				/>

				<kv-accordion-item
					class="loan-filters__lightbox-accordian"
					id="region-accordian"
				>
					<template v-slot:header>
						<h3>Countries</h3>
					</template>
					<location-filter
						class="loan-filter-controls__filter-type"
						:all-countries="allCountries"
						:initial-countries="initialCountries"
						:selected-countries="selectedCountries"
						@updated-filters="handleUpdatedFilters"
					/>
				</kv-accordion-item>

				<kv-accordion-item
					class="loan-filters__lightbox-accordian"
					id="sectors-accordian"
				>
					<template v-slot:header>
						<h3>Sectors</h3>
					</template>
					<sector-filter
						class="loan-filter-controls__filter-type"
						:all-sectors="allSectors"
						:initial-sectors="initialSectors"
						:selected-sectors="selectedSectors"
						@updated-filters="handleUpdatedFilters"
					/>
				</kv-accordion-item>

				<kv-accordion-item
					class="loan-filters__lightbox-accordian"
					id="attributes-accordian"
				>
					<template v-slot:header>
						<h3>Attributes</h3>
					</template>
					<attribute-filter
						class="loan-filter-controls__filter-type"
						:all-attributes="allAttributes"
						:initial-attributes="initialAttributes"
						:selected-attributes="selectedAttributes"
						@updated-filters="handleUpdatedFilters"
					/>
				</kv-accordion-item>

				<kv-accordion-item
					class="loan-filters__lightbox-accordian"
					id="tags-accordian"
				>
					<template v-slot:header>
						<h3>Tags</h3>
					</template>
					<tag-filter
						class="loan-filter-controls__filter-type"
						:all-tags="allTags"
						:initial-tags="initialTags"
						:selected-tags="selectedTags"
						@updated-filters="handleUpdatedFilters"
					/>
				</kv-accordion-item>
			</div>

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
import KvChip from '@/components/Kv/KvChip';
import KvLightbox from '@/components/Kv/KvLightbox';
import AttributeFilter from '@/components/CorporateCampaign/LoanSearch/AttributeFilter';
import GenderFilter from '@/components/CorporateCampaign/LoanSearch/GenderFilter';
import KvAccordionItem from '@/components/Kv/KvAccordionItem';
import KvIcon from '@/components/Kv/KvIcon';
import KvPillToggle from '@/components/Kv/KvPillToggle';
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
		KvChip,
		KvLightbox,
		KvPillToggle,
		AttributeFilter,
		GenderFilter,
		KvAccordionItem,
		KvIcon,
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
		},
		filterChips() {
			// gather selected Countries
			const selectedCountriesRaw = this.allCountries.filter(country => {
				return this.selectedCountries.includes(country.isoCode);
			});

			// gather selected Sectors
			const selectedSectorsRaw = this.allSectors.filter(sector => {
				return this.selectedSectors.includes(sector.id);
			});

			// gather selected Themes
			const selectedAttributesRaw = this.allAttributes.filter(attribute => {
				return this.selectedAttributes.includes(attribute.name);
			});

			// gather selected tags
			const selectedTagsRaw = this.allTags.filter(tag => {
				return this.selectedTags.includes(tag.id);
			});

			// const selectedTagsEnriched = selectedTagsRaw.map()
			return [...selectedCountriesRaw, ...selectedSectorsRaw, ...selectedAttributesRaw, ...selectedTagsRaw];
		},
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
		cleanChipName(name) {
			return name.replace(/#/g, '');
		},
		handleRemoveFilter(filter) {
			console.log(filter);
			this.showFilters();
			// eslint-disable-next-line no-underscore-dangle
			// const type = filter.__typename;
			// switch (type) {
			// 	case 'Country':
			// 		break;
			// 	case 'Sector':
			// 		break;
			// 	case 'LoanThemeFilter':
			// 		break;
			// 	case 'Tag':
			// 		break;
			// 	default:
			// 		break;
			// }
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.loan-filters {
	&__top-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
		margin: 0 1rem 1rem;

		@include breakpoint(medium) {
			flex-direction: row;
			margin: 0 3.5rem 1rem;
		}
	}

	&__controls {
		margin-bottom: 1rem;

		@include breakpoint(medium) {
			margin-bottom: 0;
		}
	}

	&__toggle {
		margin: 0 1rem 0 0;
	}

	&__toggle-icon {
		width: 1.2rem;
		height: 0.75rem;
		margin: 0 0 0 0.5rem;
	}

	&__total-count {
		font-weight: 700;
	}

	&__chips {
		display: block;
		margin: 1.5rem 1rem 0.5rem;

		@include breakpoint(medium) {
			margin: 1.5rem 3.5rem 0.5rem;
		}

		// Temporarily hide close 'X'
		::v-deep .filter-close-button-container {
			display: none;
		}
	}

	h3 {
		display: block;
		padding: 0.5rem 0;
	}

	// &__loan-display {

	// }

	&__lightbox {
		::v-deep .kv-lightbox__container {
			min-width: 20rem;
		}
	}
}

.loan-filter-controls {
	@include breakpoint('medium') {
		width: rem-calc(360);
	}

	@include breakpoint('large') {
		width: rem-calc(550);
	}

	@include breakpoint('xlarge') {
		width: rem-calc(625);
	}

	&__filter-type {
		padding: 0 0 1rem;
	}
}
</style>
