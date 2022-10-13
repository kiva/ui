<template>
	<div v-if="items.length">
		<div class="tw-flex tw-items-start tw-flex-col" :class="{ 'lg:tw-flex-row': isCollapsed }">
			<div ref="container" class="chip-container tw-overflow-hidden" :style="containerMaxHeight">
				<div ref="chips" class="tw-flex tw-flex-wrap tw-gap-1.5">
					<div v-for="(item, i) in items" :key="i">
						<kv-chip-classic @click="handleChipClick(item)">
							{{ item.name }}
						</kv-chip-classic>
					</div>
				</div>
			</div>
			<div v-if="isCollapsableSet" class="tw-whitespace-nowrap tw-my-0.5 tw-mx-1">
				<kv-text-link @click="handleToggleClick">
					{{ isCollapsed ? `Show all ${items.length} filters` : 'Hide filters' }}
				</kv-text-link>
				<template v-if="!isCollapsed">
					|
					<kv-text-link @click="handleResetClick">
						Reset all
					</kv-text-link>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import _throttle from 'lodash/throttle';
import KvChipClassic from '@/components/Kv/KvChipClassic';
import { transformTagName, distributionModelDisplayMap } from '@/util/loanSearch/filterUtils';
import KvTextLink from '~/@kiva/kv-components/vue/KvTextLink';

export default {
	name: 'LoanSearchFilterChips',
	components: {
		KvChipClassic,
		KvTextLink,
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
	data() {
		return {
			isCollapsable: undefined,
			isCollapsed: true,
			throttledDetermineIsCollapsable: _throttle(this.determineIsCollapsable, 200),
		};
	},
	mounted() {
		this.determineIsCollapsable();

		window.addEventListener('resize', this.throttledDetermineIsCollapsable);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.throttledDetermineIsCollapsable);
	},
	computed: {
		isCollapsableSet() {
			return typeof this.isCollapsable !== 'undefined' && this.isCollapsable;
		},
		items() {
			return this.getLabelsFromState(this.loanSearchState, this.allFacets);
		},
		containerMaxHeight() {
			return !this.isCollapsed ? { 'max-height': 'none' } : undefined;
		}
	},
	methods: {
		formatRemovedFacet(facetType, facet) {
			switch (facetType) {
				case 'Gender':
					return { gender: null };
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
				case 'Tag':
					return { tagId: [...this.loanSearchState.tagId?.filter(id => facet.id !== id)] };
				case 'DistributionModel':
					return { distributionModel: null };
				default:
					return {};
			}
		},
		getLabelsFromState(loanSearchState = {}, allFacets) {
			const itemList = [];
			if (loanSearchState.countryIsoCode?.length) {
				const countryFacets = loanSearchState.countryIsoCode?.map(iso => {
					return allFacets.countryFacets?.find(facet => {
						return facet.country.isoCode === iso;
					})?.country;
				});
				itemList.push(...countryFacets);
			}
			if (loanSearchState.sectorId?.length) {
				const sectorFacets = loanSearchState.sectorId?.map(sectorId => {
					return allFacets.sectorFacets?.find(facet => {
						return facet.id === sectorId;
					});
				});
				itemList.push(...sectorFacets);
			}
			if (loanSearchState.themeId?.length) {
				const themeFacets = loanSearchState.themeId?.map(id => {
					return allFacets.themeFacets?.find(facet => facet.id === id);
				});
				itemList.push(...themeFacets);
			}
			// Gender
			if (loanSearchState.gender) {
				let genderFacet;
				switch (loanSearchState.gender) {
					case 'female':
						genderFacet = {
							value: 'female',
							name: 'Women',
							__typename: 'Gender'
						};
						break;
					case 'male':
						genderFacet = {
							value: 'male',
							name: 'Men',
							__typename: 'Gender'
						};
						break;
					default:
						genderFacet = {
							value: 'nonbinary',
							name: 'Nonbinary',
							__typename: 'Gender'
						};
						break;
				}
				itemList.push(genderFacet);
			}
			if (loanSearchState.tagId?.length) {
				const tagFacets = loanSearchState.tagId?.map(id => {
					const tagFacet = allFacets.tagFacets?.find(facet => facet.id === id);

					return {
						...tagFacet,
						name: transformTagName(tagFacet?.name)
					};
				});
				itemList.push(...tagFacets);
			}
			if (loanSearchState.distributionModel) {
				const distributionModelFacet = allFacets.distributionModelFacets
					?.find(f => f.name === loanSearchState.distributionModel);
				itemList.push({
					name: distributionModelDisplayMap[distributionModelFacet?.name.toUpperCase()],
					__typename: 'DistributionModel'
				});
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
		},
		handleResetClick() {
			this.$emit('reset');

			this.isCollapsed = true;

			this.$kvTrackEvent('Lending', 'click-reset-filter-chips', 'Loan Search Filter Chips Reset');
		},
		async determineIsCollapsable() {
			// Refs will be undefined initially if Vue reused the component
			if (!this.$refs.container || !this.$refs.chips) {
				await this.$nextTick();
			}

			const { container, chips } = this.$refs;

			if (container && chips) {
				// Store whether collapsed to restore after calculation below
				const storedIsCollapsed = this.isCollapsed;

				// Collapse the chips and hide the toggle link
				this.isCollapsed = true;
				this.isCollapsable = undefined;

				// Update virtual DOM with single row of chips
				await this.$nextTick();

				this.isCollapsable = chips.clientHeight > container.clientHeight;
				this.isCollapsed = storedIsCollapsed;
			}
		},
		handleToggleClick() {
			this.isCollapsed = !this.isCollapsed;

			this.$kvTrackEvent(
				'Lending',
				'click-toggle-filter-chips',
				'Loan Search Filter Chips Toggled',
				this.isCollapsed ? 'hidden' : 'shown'
			);
		},
	},
	watch: {
		items() {
			this.determineIsCollapsable();
		}
	}
};
</script>

<style lang="postcss" scoped>
	.chip-container { max-height: 148px; }

	@screen lg { .chip-container { max-height: 44px; } }
</style>
