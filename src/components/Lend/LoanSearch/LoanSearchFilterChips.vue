<template>
	<div class="tw-flex tw-flex-wrap tw-gap-1.5 tw-my-.5 tw-mb-1">
		<div v-for="(item, i) in items" :key="i" class="tw-inline-block">
			<kv-chip-classic @click="handleChipClick(item)">
				{{ item.name }}
			</kv-chip-classic>
		</div>
	</div>
</template>

<script>
import KvChipClassic from '@/components/Kv/KvChipClassic';

export default {
	name: 'LoanSearchFilterChips',
	components: {
		KvChipClassic,
	},
	props: {
		loanSearchState: {
			type: Object,
			default: () => {}
		},
		allFacets: {
			type: Object,
			default: () => {}
		}
	},
	computed: {
		items() {
			return this.getLabelsFromState(this.loanSearchState, this.allFacets);
		}
	},
	methods: {
		formatRemovedFacet(facetType, facet) {
			switch (facetType) {
				case 'Gender':
					return {
						gender: null
					};
				case 'Sector':
					return { sectorId: [...this.loanSearchState.sectorId?.filter(id => facet.id !== id)] };
				case 'Country':
					return {
						countryIsoCode: [...this.loanSearchState.countryIsoCode?.filter(iso => {
							return facet.isoCode !== iso;
						})]
					};
				case 'LoanThemeFilter':
					return { themeId: [...this.loanSearchState.themeId?.filter(id => facet.id !== id)] };
				default:
					return {};
			}
		},
		getLabelsFromState(loanSearchState = {}, allFacets) {
			let itemList = [];
			// Check for each section of loanSearchState
			// Countries
			if (loanSearchState.countryIsoCode?.length) {
				const countryFacets = loanSearchState.countryIsoCode?.map(iso => {
					return allFacets.countryFacets?.find(facet => {
						return facet.country.isoCode === iso;
					})?.country;
				});
				itemList = [...countryFacets];
			}
			// Sectors
			if (loanSearchState.sectorId?.length) {
				const sectorFacets = loanSearchState.sectorId?.map(sectorId => {
					return allFacets.sectorFacets?.find(facet => {
						return facet.id === sectorId;
					});
				});
				itemList = [...itemList, ...sectorFacets];
			}
			// Themes/Attributes
			if (loanSearchState.themeId?.length) {
				const themeFacets = loanSearchState.themeId?.map(id => {
					return allFacets.themeFacets?.find(facet => facet.id === id);
				});
				itemList = [...itemList, ...themeFacets];
			}
			// Gender
			if (loanSearchState.gender !== null) {
				const genderFacet = loanSearchState.gender === 'female'
					? {
						value: 'female',
						name: 'Women',
						__typename: 'Gender'
					}
					: {
						value: 'male',
						name: 'Men',
						__typename: 'Gender'
					};
				itemList.push(genderFacet);
			}
			return itemList;
		},
		handleChipClick(facet) {
			// Convert our removed facet back into a compatible facet structure
			// eslint-disable-next-line no-underscore-dangle
			const facetType = facet.__typename;
			const formattedFacet = this.formatRemovedFacet(facetType, facet);
			this.$emit('updated', formattedFacet);

			this.$kvTrackEvent('Lending', 'click-remove-filter-chip', `${facetType}-${facet.name}`);
		}
	},
};
</script>
