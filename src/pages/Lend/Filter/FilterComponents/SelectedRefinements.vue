<template>
	<div class="selected-refinements">
		<ais-current-refinements :transform-items="transformItems">
			<div slot-scope="{ items }">
				<div class="row">
					<div class="small-12 medium-10 columns">
						<div :class="[{ collapsed: isCollapsed }, 'accordion-container']">
							<div class="accordion-content" ref="accordionContent">
								<filter-chip
									v-for="item in items"
									:key="[
										item.attribute,
										item.type,
										item.label,
										item.operator,
									].join(':')"
									:title="`${item.label}`"
									@click-chip="handleRemoveRefinement(item)"
								/>
							</div>
						</div>
					</div>
					<div class="small-12 medium-2 columns">
						<div class="filter-summary-container">
							<div v-if="isCollapsible" class="show-toggle-container">
								<!-- eslint-disable max-len -->
								<div v-if="isCollapsed" @click="handleClickShowMore">Show all {{ items.length }} filters</div>
							</div>
						</div>
					</div>
				</div>
				<div v-if="!isCollapsed && isCollapsible" class="hide-reset-toggle-container">
					<div @click="handleClickShowFewer" class="hide-filter align-middle">Hide filters</div>

					<ais-clear-refinements class="clear-all align-middle">
						<clear-all-refinements
							slot-scope="{ canRefine, refine }"
							@clear-all-refinements="refine"
							@clear-custom-categories="clearCustomCategories"
							v-if="canRefine"
						/>
					</ais-clear-refinements>
				</div>
			</div>
		</ais-current-refinements>
	</div>
</template>

<script>
import algoliaCustomCategories from '@/plugins/algolia-custom-categories-mixin';
import {
	AisCurrentRefinements,
	AisClearRefinements,
} from 'vue-instantsearch';
import FilterChip from '@/pages/Lend/Filter/FilterComponents/FilterChip';
import ClearAllRefinements from '@/pages/Lend/Filter/FilterComponents/ClearAllRefinements';

export default {
	components: {
		AisCurrentRefinements,
		AisClearRefinements,
		FilterChip,
		ClearAllRefinements,
	},
	props: {
		customCategories: {
			type: Object,
			required: true,
		},
		selectedCustomCategories: {
			type: Object,
			required: true,
		},
	},
	mixins: [
		algoliaCustomCategories,
	],
	data() {
		return {
			attributeMap: {
				'partner.delinquencyRate': {
					labelPrefix: 'Delinquency Rate',
					unit: '%',
					plural: '',
				},
				'partner.riskRating': {
					labelPrefix: 'Risk Rating',
					unit: 'star',
					plural: 's',
				},
				'partner.defaultRate': {
					labelPrefix: 'Default Rate',
					unit: '%',
					plural: '',
				},
				lenderRepaymentTerm: {
					labelPrefix: 'Loan Length',
					unit: 'month',
					plural: 's',
				},
			},
			genderMap: {
				female: 'Women',
				male: 'Men',
			},
			fixedRowHeight: 38,
			fixedRowCount: 3,
			isCollapsible: false,
			isCollapsed: true,
		};
	},
	methods: {
		handleRemoveRefinement(item) {
			item.refine(item);
			this.$emit('facet-removed', item);
		},
		handleClickShowMore() {
			this.isCollapsed = false;
		},
		handleClickShowFewer() {
			this.isCollapsed = true;
		},
		setCollapsibleState() {
			// eslint-disable-next-line max-len
			const accordionHeight = window.innerWidth <= 680 ? this.fixedRowHeight * this.fixedRowCount : this.fixedRowHeight;

			this.isCollapsible = this.$refs.accordionContent
				? this.$refs.accordionContent.clientHeight > accordionHeight
				: false;
		},
		generateLabel(item) {
			const {
				label,
				type,
				attribute,
			} = item;
			if (type === 'numeric') {
				return this.generateNumericLabel(item);
			} else if (attribute === 'gender') {
				return this.genderMap[label];
			}
			return label;
		},
		generateNumericLabel({
			operator,
			value,
			attribute,
		}) {
			const {
				labelPrefix,
				unit,
				plural,
			} = this.attributeMap[attribute];
			return `${labelPrefix} ${operator} ${value} ${unit}${value > 1 ? plural : ''}`;
		},
		transformItems(items) {
			const newItems = [];

			items.forEach(({ refinements, refine/* , Custom Categoris skip: attribute */ }) => {
				refinements.forEach(refinement => {
					const { type, operator, value } = refinement;
					if (type === 'numeric') {
						if (operator === '>=' && value === -1) {
							return;
						}
						if (operator === '<=' && value === 1000) {
							return;
						}
					}
					/* Custom Categories Skip
					if (this.customCategoryAttributes.includes(attribute)) {
						return;
					}
					*/
					newItems.push({
						...refinement,
						label: this.generateLabel(refinement),
						refine,
					});
				});
			});
			this.runOnTransformItems();
			return newItems.concat(this.customCategoryItems);
		},
		runOnTransformItems() {
			setTimeout(() => { this.setCollapsibleState(); }, 0);
		},
		removeCustomCategory(customCategoryId) {
			this.setCollapsibleState();
			this.$emit('remove-custom-category', customCategoryId);
		},
		clearCustomCategories() {
			this.isCollapsed = true;
			this.$emit('clear-custom-categories');
		},
	},
	mounted() {
		this.setCollapsibleState();
		// TODO: Throttle this
		window.addEventListener('resize', this.setCollapsibleState);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.setCollapsibleState);
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.selected-refinements {
	$fixed-row-height: 38;

	margin-top: rem-calc(10);
	// Margin hack
	margin-left: -1.9375rem;

	.row {
		margin: 0;

		.columns {
			padding: 0;
		}

		.filter-summary-container {
			display: flex;
			padding-bottom: rem-calc(5);

			@include breakpoint(medium up) {
				padding-top: rem-calc(5);
			}
		}

		.accordion-container {
			overflow: hidden;
			transition: max-height 0.25s ease;

			&.collapsed {
				max-height: rem-calc($fixed-row-height);

				@include breakpoint(medium down) {
					max-height: rem-calc($fixed-row-height * 3);
				}
			}
		}
	}

	.show-toggle-container {
		color: $faded-blue;
		cursor: pointer;
		font-size: rem-calc(14);
		user-select: none;
		white-space: nowrap;
		width: 100%;

		div {
			@include breakpoint(medium up) {
				text-align: right;
			}

			display: inline-block;
		}
	}

	.hide-reset-toggle-container {
		@extend .show-toggle-container;

		height: rem-calc(20);
		margin-left: rem-calc(4);
		margin-top: rem-calc(5);

		.hide-filter {
			height: rem-calc(20);
			padding-right: rem-calc(5);
		}

		.clear-all {
			height: rem-calc(20);
			border-left: 1px solid $charcoal;
			padding-left: rem-calc(9);
		}
	}
}
</style>
