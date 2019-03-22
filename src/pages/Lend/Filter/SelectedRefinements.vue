<template>
	<div class="selected-refinements">
		<ais-current-refinements
			:transform-items="transformRefinementList"
		>
			<div slot-scope="{ items, createURL }">
				<div class="filter-summary-container">
					<div>{{ items.length }} Filters Applied</div>
					<div v-if="isCollapsible" class="show-toggle-container">
						<div v-if="isCollapsed" @click="handleClickShowMore">Show</div>
						<div v-else @click="handleClickShowFewer">Hide</div>
					</div>
				</div>
				<div class="accordion-container" :class="{collapsed: isCollapsed}">
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
						<ais-clear-refinements class="clear-all-container">
							<div
								class="clear-all"
								slot-scope="{ canRefine, refine }"
								@click.prevent="refine"
								v-if="canRefine && isCollapsible"
							>
								Clear all
							</div>
						</ais-clear-refinements>
					</div>
				</div>
			</div>
		</ais-current-refinements>
	</div>
</template>

<script>
import _forEach from 'lodash/forEach';
import {
	AisCurrentRefinements,
	AisClearRefinements,
} from 'vue-instantsearch';
import FilterChip from '@/pages/Lend/Filter/FilterChip';

export default {
	components: {
		AisCurrentRefinements,
		AisClearRefinements,
		FilterChip,
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
			fixedRowHeight: 40,
			isCollapsible: false,
			isCollapsed: true,
			customCategoryAttributes: ['sector.name', 'themeData.loanThemeTypeName', 'tags.name'],
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
			this.isCollapsible = this.$refs.accordionContent
				? this.$refs.accordionContent.clientHeight > this.fixedRowHeight
				: false;
		},
		getCustomCategoryLabel(customCategoryId) {
			return this.customCategories[customCategoryId].name;
		},
		generateLabel(item) {
			const {
				label,
				type,
			} = item;
			return type === 'numeric' ? this.generateNumericLabel(item) : label;
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
		transformRefinementList(items) {
			const newItems = [];

			items.forEach(({ refinements, refine, attribute }) => {
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
					if (this.customCategoryAttributes.includes(attribute)) {
						return;
					}
					newItems.push({
						...refinement,
						label: this.generateLabel(refinement),
						refine,
					});
				});
			});
			_forEach(
				this.selectedCustomCategories,
				(customCategoryEnabled, selectedCustomCategoryId) => {
					if (!customCategoryEnabled) {
						return;
					}
					newItems.push({
						attribute: selectedCustomCategoryId,
						label: this.getCustomCategoryLabel(selectedCustomCategoryId),
						refine: () => {
							this.removeCustomCategory(selectedCustomCategoryId);
						},
						type: 'CustomCategory',
					});
				},
			);
			setTimeout(() => { this.setCollapsibleState(); }, 0);
			return newItems;
		},
		removeCustomCategory(customCategoryId) {
			this.$emit('remove-custom-category', customCategoryId);
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
	$fixed-row-height: 40;

	margin: 1rem 0;

	.link {
		color: $blue;
		user-select: none;
		cursor: pointer;
	}

	.filter-summary-container {
		display: flex;

		.show-toggle-container {
			@extend .link;

			margin-left: rem-calc(4);
		}
	}

	.accordion-container {
		overflow: hidden;
		max-height: 15rem;
		transition: max-height 0.25s ease;

		.clear-all-container {
			display: inline;

			.clear-all {
				@extend .link;

				display: inline;
			}
		}

		&.collapsed {
			max-height: rem-calc($fixed-row-height);
		}
	}
}
</style>
