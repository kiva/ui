<template>
	<div class="selected-refinements">
		<ais-current-refinements :transform-items="transformItems">
			<div slot-scope="{ items }">
				<div class="row">
					<div class="small-12 large-10 columns">
						<div :class="[{ collapsed: isCollapsed }, 'accordion-container']">
							<div class="accordion-content" ref="accordionContent">
								<kv-chip
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
					<div class="small-12 large-2 columns">
						<div v-if="isCollapsible" class="filter-summary-container">
							<div class="show-all-container">
								<button
									class="show-all tw-text-small tw-text-link"
									v-if="isCollapsed"
									@click="handleClickShowMore"
								>
									Show all {{ items.length }} filters
								</button>
							</div>
						</div>
					</div>
				</div>
				<div v-if="!isCollapsed && isCollapsible" class="hide-reset-toggle-container">
					<button @click="handleClickShowFewer" class="hide-filter align-middle tw-text-small tw-text-link">
						Hide filters
					</button>

					<ais-clear-refinements class="clear-all align-middle tw-text-small tw-text-link">
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
import {
	AisCurrentRefinements,
	AisClearRefinements,
} from 'vue-instantsearch';
import algoliaCustomCategories from '@/plugins/algolia-custom-categories-mixin';
import KvChip from '@/components/Kv/KvChip';
import ClearAllRefinements from '@/pages/Lend/Filter/FilterComponents/ClearAllRefinements';

export default {
	name: 'SelectedRefinements',
	components: {
		AisCurrentRefinements,
		AisClearRefinements,
		KvChip,
		ClearAllRefinements,
	},
	props: {
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
			const accordionHeight = window.innerWidth <= 680
				? this.fixedRowHeight * this.fixedRowCount
				: this.fixedRowHeight;

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
			}
			switch (attribute) {
				case 'gender': {
					return this.genderMap[label];
				}
				case 'tags.name': {
					return label.replace(/#/g, '');
				}
				default: {
					return label;
				}
			}
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

	.show-all-container {
		width: 100%;

		@include breakpoint(large) {
			text-align: right;
		}
	}

	.hide-reset-toggle-container {
		height: rem-calc(20);
		margin-left: rem-calc(1);

		.hide-buttons {
			display: inline-block;
			height: rem-calc(20);
		}

		.hide-filter {
			@extend .hide-buttons;

			padding-right: rem-calc(5);
		}

		.clear-all {
			@extend .hide-buttons;

			border-left: 1px solid $charcoal;
			padding-left: rem-calc(9);
		}
	}
}
</style>
