<template>
	<div class="loan-filters">
		<div class="loan-filters__top-row">
			<span class="tw-mb-2 md:tw-mb-0">
				<div class="tw-inline-flex tw-items-center">
					<h2>
						Support causes you care about.
					</h2>
				</div>
			</span>

			<div v-if="showLoanDisplayToggle" class="loan-filters__loan-display">
				<div
					class="tw-flex tw-cursor-pointer tw-items-center"
					id="view-toggle"
				>
					<span class=" tw-inline-block tw-border-r tw-border-tertiary tw-px-1.5">
						{{ totalCount }} loans
					</span>
					<span
						class="tw-inline-flex"
						@click="showFilters()"
					>
						<h4 class="tw-text-h4 tw-font-medium tw-text-action tw-border-r tw-border-tertiary tw-px-1.5">
							Filter loans
						</h4>
					</span>
					<span
						class="tw-flex tw-items-center tw-flex-wrap"
					>
						<span
							class="tw-inline-flex"
							v-show="activeLoanDisplay === 'grid'"
							@click="setLoanDisplayMode('rows')"
						>
							<h4 class="tw-text-h4 tw-font-medium tw-text-action tw-px-1">
								Row View
							</h4>
							<kv-material-icon
								class="tw-mr-1 tw-w-2 tw-text-action tw-inline-block"
								name="list-green"
								:icon="mdiLandRowsHorizontal"
							/>
						</span>
					</span>

					<span
						class="tw-flex tw-items-center tw-flex-wrap"
					>
						<span
							class="tw-inline-flex"
							v-show="activeLoanDisplay === 'rows'"
							@click="setLoanDisplayMode('grid')"
						>
							<h4 class="tw-text-h4 tw-font-medium tw-text-action tw-px-1">
								Grid View
							</h4>
							<kv-material-icon
								class="tw-mr-1 tw-w-2 tw-text-action tw-inline-block"
								name="grid-green"
								:icon="mdiGridLarge"
							/>
						</span>
					</span>
				</div>
			</div>
		</div>
		<div
			v-if="filterChips.length"
			class="loan-filters__chips chips"
		>
			<div class="row">
				<div
					class="chips__container small-12 large-8 xxlarge-9 columns"
					:class="{'chips--collapsed' : isChipsCollapsed}"
					ref="chipsContainer"
				>
					<div
						ref="chipsInnerContainer"
					>
						<kv-chip-classic
							v-for="(filter, index) in filterChips"
							:key="`chip-${index}`"
							:title="cleanChipName(filter.name)"
							@click="handleRemoveFilter(filter)"
						>
							{{ filter.name }}
						</kv-chip-classic>
					</div>
				</div>
				<div class="small-12 large-4 xxlarge-3 columns">
					<div class="chips__toggle-container">
						<kv-button
							v-if="isChipsCollapsable"
							variant="secondary"
							class="chips__toggle tw-mb-2"
							@click="isChipsCollapsed = !isChipsCollapsed"
						>
							{{ isChipsCollapsed ? `Show all ${filterChips.length} filters` : 'Hide filters' }}
						</kv-button>
						<span v-if="!isInitialFilters && isChipsCollapsable">|</span>
						<kv-button
							v-if="!isInitialFilters"
							class="chips__toggle"
							@click="handleResetFilters"
						>
							Reset all
						</kv-button>
					</div>
				</div>
			</div>
		</div>

		<kv-lightbox
			v-if="filtersVisible"
			class="loan-filters__lightbox"
			id="filterControlsLightbox"
			title="Filter Loans"
			:visible="filtersVisible"
			@lightbox-closed="filtersVisible = false"
		>
			<div class="loan-filter-controls">
				<span class="tw-flex-col">
					<span class="tw-flex">
						<div
							class="loan-filters__lightbox tw-mb-0.5"
							id="gender-filter-container"
						>
							<h3 class="tw-py-1 tw-p-2 tw-inline-block">
								Gender
							</h3>

							<fieldset class="tw-flex tw-flex-col tw-gap-4 tw-my-2 tw-p-1">
								<gender-filter
									class="loan-filter-controls__filter-type"
									:initial-gender="initialGender"
									:selected-gender="selectedGender"
									@gender-updated="handleUpdatedFilters"
								/>
							</fieldset>
						</div>

						<div
							class="loan-filters__lightbox tw-flex-grow"
							id="sort-filter-container"
						>
							<h3 class="tw-py-1 tw-p-2 tw-inline-block">
								Sort By
							</h3>
							<fieldset class="tw-flex tw-flex-col tw-gap-2 tw-my-2 tw-p-1">
								<sort-order
									class="loan-filter-controls__filter-type"
									:initial-sort="initialSortBy"
									:selected-sort="selectedSort"
									@sort-order-updated="handleSortByUpdated"
								/>
							</fieldset>
						</div>
					</span>
					<hr class="tw-border-tertiary tw-my-1">
				</span>

				<kv-accordion-item
					class="loan-filters__lightbox-accordian"
					id="region-accordian"
				>
					<template #header>
						<h3 class="tw-py-1">
							Countries
						</h3>
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
					<template #header>
						<h3 class="tw-py-1">
							Sectors
						</h3>
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
					<template #header>
						<h3 class="tw-py-1">
							Attributes
						</h3>
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
					<template #header>
						<h3 class="tw-py-1">
							Tags
						</h3>
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

			<template #controls>
				<kv-button
					variant="primary"
					@click.prevent="applyFilters"
				>
					Apply Filters
				</kv-button>
			</template>
		</kv-lightbox>
	</div>
</template>

<script>
import _isEqual from 'lodash/isEqual';
import _sortBy from 'lodash/sortBy';
import { gql } from 'graphql-tag';
import { mdiChevronDown, mdiGridLarge, mdiLandRowsHorizontal } from '@mdi/js';
import AttributeFilter from '#src/components/CorporateCampaign/LoanSearch/AttributeFilter';
import GenderFilter from '#src/components/CorporateCampaign/LoanSearch/GenderFilter';
import LocationFilter from '#src/components/CorporateCampaign/LoanSearch/LocationFilter';
import SectorFilter from '#src/components/CorporateCampaign/LoanSearch/SectorFilter';
import SortOrder from '#src/components/CorporateCampaign/LoanSearch/SortOrder';
import TagFilter from '#src/components/CorporateCampaign/LoanSearch/TagFilter';
import KvChipClassic from '#src/components/Kv/KvChipClassic';
import {
	KvMaterialIcon, KvAccordionItem, KvLightbox, KvButton
} from '@kiva/kv-components';

const filterOptionsQuery = gql`
	query filterOptionsQuery {
		lend {
			countryFacets {
				country {
					id
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
				vocabularyId
			}
		}
	}
`;
export default {
	name: 'LoanSearchFilters',
	inject: ['apollo'],
	components: {
		KvButton,
		KvChipClassic,
		KvLightbox,
		AttributeFilter,
		GenderFilter,
		KvAccordionItem,
		KvMaterialIcon,
		LocationFilter,
		SectorFilter,
		SortOrder,
		TagFilter
	},
	emits: [
		'updated-filters',
		'updated-sort-by',
		'reset-loan-filters',
		'set-loan-display'
	],
	props: {
		activeLoanDisplay: {
			type: String,
			default: 'rows'
		},
		appliedFilters: {
			type: Object,
			default: () => {}
		},
		initialFilters: {
			type: Object,
			default: () => {}
		},
		/**
		 * Tag names that we don't want to show in the filter lightbox
		 * e.g., ['#Team Guys Holding Fish', '#Technology']
		* */
		excludedTags: {
			type: Array,
			default: () => []
		},
		initialSortBy: {
			type: String,
			default: 'popularity',
		},
		showLoanDisplayToggle: {
			type: Boolean,
			default: true
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
			selectedSort: null,
			isChipsCollapsable: true,
			isChipsCollapsed: true,
			mdiChevronDown,
			mdiGridLarge,
			mdiLandRowsHorizontal
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
			this.allTags = _sortBy(data.lend?.tag ?? [], 'name').filter(tag => {
				return !this.excludedTags.includes(tag.name);
			});
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
			// gather gender setting
			const genderOptions = [
				{ name: 'Women', key: 'female', __typename: 'GenderEnum' },
				{ name: 'Men', key: 'male', __typename: 'GenderEnum' },
			];
			const selectedGenderRaw = genderOptions.filter(gender => {
				if (this.appliedFilters && this.appliedFilters.gender) {
					return this.appliedFilters.gender === gender.key;
				}
				return false;
			});
			// gather selected Countries
			const selectedCountriesRaw = this.allCountries.filter(country => {
				const appliedCountries = this.appliedFilters?.country ?? [];
				if (appliedCountries.length) {
					return appliedCountries.includes(country.isoCode);
				}
				return false;
			});
			// gather selected Sectors
			const selectedSectorsRaw = this.allSectors.filter(sector => {
				const appliedSectors = this.appliedFilters?.sector ?? [];
				if (appliedSectors.length) {
					return appliedSectors.includes(sector.id);
				}
				return false;
			});
			// gather selected Themes
			const selectedAttributesRaw = this.allAttributes.filter(attribute => {
				const appliedAttributes = this.appliedFilters?.theme ?? [];
				if (appliedAttributes.length) {
					return appliedAttributes.includes(attribute.name);
				}
				return false;
			});
			// gather selected tags
			const selectedTagsRaw = this.allTags.filter(tag => {
				if (tag.name?.charAt(0) === '#') { // kludge to only include public tags
					const appliedTags = this.appliedFilters?.loanTags ?? [];
					if (appliedTags.length) {
						return appliedTags.includes(tag.id);
					}
				}
				return false;
			});
			return [
				...selectedGenderRaw,
				...selectedCountriesRaw,
				...selectedSectorsRaw,
				...selectedAttributesRaw,
				...selectedTagsRaw
			];
		},
		isInitialFilters() {
			return _isEqual(this.modifiedFilters, this.initialFilters);
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
		},
		modifiedFilters: {
			handler() {
				this.determineIsChipsCollapsable();
			},
			deep: true,
		},
	},
	methods: {
		setLoanDisplayMode(mode) {
			switch (mode) {
				case 'rows':
					this.$emit('set-loan-display', true);
					break;
				case 'grid':
					this.$emit('set-loan-display', false);
					break;
				default:
					break;
			}
		},
		showFilters() {
			this.filtersVisible = true;
		},
		handleUpdatedFilters(payload) {
			const filterKeys = Object.keys(payload);
			filterKeys.forEach(key => {
				this.modifiedFilters[key] = payload[key];
			});
		},
		applyFilters() {
			const gqlFilters = this.modifiedFilters;
			if (gqlFilters.gender === 'both') {
				gqlFilters.gender = null;
			}
			this.$emit('updated-filters', gqlFilters);
			this.$emit('updated-sort-by', this.selectedSort);
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
			// eslint-disable-next-line no-underscore-dangle
			const type = filter.__typename;
			switch (type) {
				case 'GenderEnum':
					this.modifiedFilters.gender = null;
					this.applyFilters();
					break;
				case 'Country':
					if (this.modifiedFilters.country && this.modifiedFilters.country.length) {
						const newCountries = this.modifiedFilters.country.filter(isoCode => {
							return filter.isoCode !== isoCode;
						});
						this.modifiedFilters.country = newCountries;
						this.applyFilters();
					}
					break;
				case 'Sector':
					if (this.modifiedFilters.sector && this.modifiedFilters.sector.length) {
						const newSectors = this.modifiedFilters.sector.filter(sectorId => {
							return filter.id !== sectorId;
						});
						this.modifiedFilters.sector = newSectors;
						this.applyFilters();
					}
					break;
				case 'LoanThemeFilter':
					if (this.modifiedFilters.theme && this.modifiedFilters.theme.length) {
						const newThemes = this.modifiedFilters.theme.filter(themeName => {
							return filter.name !== themeName;
						});
						this.modifiedFilters.theme = newThemes;
						this.applyFilters();
					}
					break;
				case 'Tag':
					if (this.modifiedFilters.loanTags && this.modifiedFilters.loanTags.length) {
						const newTags = this.modifiedFilters.loanTags.filter(tagId => {
							return filter.id !== tagId;
						});
						this.modifiedFilters.loanTags = newTags;
						this.applyFilters();
					}
					break;
				default:
					break;
			}
		},
		handleSortByUpdated(sortBy) {
			if (this.selectedSort !== sortBy) {
				this.selectedSort = sortBy;
			}
		},
		handleResetFilters() {
			this.modifiedFilters = this.copyFilters(this.initialFilters);
			this.$emit('reset-loan-filters');
		},
		async determineIsChipsCollapsable() {
			const { chipsContainer, chipsInnerContainer } = this.$refs;
			if (chipsContainer && chipsInnerContainer) {
				const isCollapsed = this.isChipsCollapsed.valueOf(); // get the initial collapsed state
				this.isChipsCollapsed = true; // collapse the container.
				await this.$nextTick(); // let that render
				// is the inner container bigger than the outer?
				this.isChipsCollapsable = chipsInnerContainer.clientHeight > chipsContainer.clientHeight;
				this.isChipsCollapsed = isCollapsed; // go back to the initial state
			}
		}
	},
};
</script>
<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;

.loan-filters {
	&__top-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
		margin: 0 0 1rem;
		@include breakpoint(medium) {
			flex-direction: row;
		}
	}

	&__controls {
		margin-bottom: 1rem;
		@include breakpoint(medium) {
			margin-bottom: 0;
		}
	}

	&__toggle-text {
		margin: 0 0.2rem 0 0;
	}

	&__toggle-icon {
		width: 2.2rem;
		height: 1.75rem;
		margin: 0;
		display: inline-block;
		vertical-align: top;
	}

	&__lightbox {
		:deep(.kv-lightbox__container) {
			min-width: 20rem;
		}
	}
}

.chips {
	&__toggle-container {
		display: block;
		margin: 1rem auto 0 0;
		@include breakpoint(large) {
			margin: 0 0 0 auto;
			text-align: right;
		}
	}

	&__toggle {
		font-size: $small-text-font-size;
		white-space: nowrap;
	}

	&--collapsed {
		overflow: hidden;
		max-height: 7rem;
		@include breakpoint(large) {
			max-height: rem-calc(38);
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
