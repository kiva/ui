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
		/**
		 * Facet options based on the loans available. Format:
		 * {
		 *   regions: [
		 *     {
		 *       region: '',
		 *       numLoansFundraising: 1,
		 *       countries: [
		 *         {
		 *           name: '',
		 *           region: '',
		 *           isoCode: '',
		 *           numLoansFundraising: 1,
		 *         }
		 *       ]
		 *     }
		 *   ],
		 *   sectors: [
		 *     {
		 *       id: 1,
		 *       name: '',
		 *     }
		 *   ],
		 *   themes: [
		 *     {
		 *       id: 1,
		 *       name: '',
		 *       numLoansFundraising: 1,
		 *     }
		 *   ],
		 * }
		 */
		loanSearchState: {
			type: Object,
			default: () => {}
		},
		/**
         * All available facet options from lend API. Format:
         * {
         *   countryFacets: [
         *     {
         *       name: '',
         *       isoCode: '',
         *       region: '',
         *     }
         *   ],
         *   sectorFacets: [
         *     {
         *       id: 1,
         *       name: '',
         *     }
         *   ],
         *   themeFacets: [
         *     {
         *       id: 1,
         *       name: '',
         *     }
         *   ],
         * }
         */
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
					return {
						sectorId: [facet.id]
					};
				case 'Country':
					return {
						countryIsoCode: [...this.loanSearchState?.countryIsoCode.filter(iso => {
							return facet.isoCode !== iso;
						})]
					};

				case 'LoanThemeFilter':
					return {
						theme: [...this.loanSearchState?.theme.filter(themeName => {
							return facet?.name?.toUpperCase() !== themeName;
						})]
					};
				default:
					return {};
			}
		},
		getLabelsFromState(loanSearchState = {}, allFacets) {
			let itemList = [];
			// Check for each section of loanSearchState
			// Countries
			if (loanSearchState.countryIsoCode.length) {
				const countryFacets = loanSearchState.countryIsoCode.map(iso => {
					return allFacets?.countryFacets?.find(facet => {
						return facet?.country?.isoCode === iso;
					})?.country;
				});
				itemList = [...countryFacets];
			}
			// Sectors
			if (loanSearchState.sectorId.length) {
				const sectorFacets = loanSearchState.sectorId.map(sectorId => {
					return allFacets?.sectorFacets?.find(facet => {
						return facet?.id === sectorId;
					});
				});
				itemList = [...itemList, ...sectorFacets];
			}
			// Themes/Attributes
			if (loanSearchState.theme.length) {
				const themeFacets = loanSearchState.theme.map(themeName => {
					return allFacets?.themeFacets?.find(facet => {
						return facet?.name?.toUpperCase() === themeName;
					});
				});
				itemList = [...itemList, ...themeFacets];
			}
			// gender
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
			// convert our removed facet back into a compatible facet structure
			// eslint-disable-next-line no-underscore-dangle
			const facetType = facet.__typename;
			const formatedFacet = this.formatRemovedFacet(facetType, facet);
			this.$emit('updated', formatedFacet);
		}
	},
};
</script>
