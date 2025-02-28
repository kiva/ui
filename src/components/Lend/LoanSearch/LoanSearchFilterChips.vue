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
import KvChipClassic from '#src/components/Kv/KvChipClassic';
import filterConfig from '#src/util/loanSearch/filterConfig';
import { KvTextLink } from '@kiva/kv-components';

export default {
	name: 'LoanSearchFilterChips',
	components: {
		KvChipClassic,
		KvTextLink,
	},
	emits: ['updated', 'reset'],
	props: {
		loanSearchState: {
			type: Object,
			default: () => ({})
		},
		allFacets: {
			type: Object,
			default: () => ({})
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
	beforeUnmount() {
		window.removeEventListener('resize', this.throttledDetermineIsCollapsable);
	},
	computed: {
		isCollapsableSet() {
			return typeof this.isCollapsable !== 'undefined' && this.isCollapsable;
		},
		items() {
			return this.getLabelsFromState();
		},
		containerMaxHeight() {
			return !this.isCollapsed ? { 'max-height': 'none' } : undefined;
		}
	},
	methods: {
		formatRemovedFacet(facet) {
			return filterConfig.config[facet.key].getRemovedFacet(this.loanSearchState, facet);
		},
		getLabelsFromState() {
			return filterConfig.keys.reduce((prev, key) => {
				const chips = filterConfig.config[key].getFilterChips(this.loanSearchState, this.allFacets);
				prev.push(...chips.map(f => ({ ...f, key })));
				return prev;
			}, []);
		},
		handleChipClick(facet) {
			// Convert our removed facet back into a compatible facet structure
			// eslint-disable-next-line no-underscore-dangle
			const facetType = facet.__typename;
			const formattedFacet = this.formatRemovedFacet(facet);
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
