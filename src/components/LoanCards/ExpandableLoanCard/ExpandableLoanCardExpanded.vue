<template>
	<div
		class="expandable-loan-card-expanded column column-block"
		v-show="show"
		@mouseleave="clearHoverLoan"
		ref="expandedContainer"
	>
		<loan-card-controller
			loan-card-type="ExpandableLoanCard"
			:loan="hoverLoan"
			:items-in-basket="itemsInBasket"
			:category-id="tracking.categoryId"
			:category-set-id="tracking.categorySetId"
			:row-number="tracking.rowNumber"
			:card-number="tracking.cardNumber"
			:enable-tracking="true"
			:is-visitor="isVisitor"
			:expanded="expanded"
		/>
	</div>
</template>

<script>
import activeLoanMixin from '@/plugins/active-loan-mixin';
import LoanCardController from '@/components/LoanCards/LoanCardController';

export default {
	components: {
		LoanCardController,
	},
	mixins: [
		activeLoanMixin,
	],
	props: {
		isVisitor: {
			type: Boolean,
			required: true,
		},
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			expanded: false,
			show: false,
		};
	},
	methods: {
		onActiveLoanChange() {
			const xOffset = this.tracking.cardNumber === 1 ? -15 : -5;
			this.$refs.expandedContainer.style.top = `${this.hoverLoanYCoordinate}px`;
			this.$refs.expandedContainer.style.left = `${this.hoverLoanXCoordinate + xOffset}px`;
			this.expanded = false;
			this.show = true;
			setTimeout(() => { this.expanded = true; }, 0);
		},
		onActiveLoanClear() {
			this.expanded = false;
			this.show = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.expandable-loan-card-expanded {
	position: absolute;
	z-index: 1001;
}
</style>
