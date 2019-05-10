<template>
	<div
		class="expandable-loan-card-expanded column column-block"
		v-show="show"
		@mouseleave="clearHoverLoan"
		ref="expandedContainer"
	>
		<loan-card-controller
			class="loan-card-controller-component"
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
import lockScrollUtils from '@/plugins/lock-scroll';
import LoanCardController from '@/components/LoanCards/LoanCardController';

export default {
	components: {
		LoanCardController,
	},
	mixins: [
		activeLoanMixin,
		lockScrollUtils,
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
		usingTouch: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		return {
			expanded: false,
			show: false,
			hoverIsActive: true,
		};
	},
	methods: {
		collapseCard() {
			this.clearHoverLoan();
			this.pauseHover(500);
		},
		onActiveLoanChange() {
			if (!this.hoverIsActive) {
				this.clearHoverLoan();
				return;
			}
			const xOffset = (this.tracking.cardNumber === 1 && !this.usingTouch) ? -15 : -5;
			this.$refs.expandedContainer.style.top = `${this.hoverLoanYCoordinate}px`;
			this.$refs.expandedContainer.style.left = `${this.hoverLoanXCoordinate + xOffset}px`;
			this.expanded = false;
			this.show = true;
			this.lockScrollSmallOnly();
			this.$nextTick(() => { this.expanded = true; });
		},
		onActiveLoanClear() {
			this.expanded = false;
			this.show = false;
			this.unlockScrollSmallOnly();
		},
		pauseHover(timeUntilResume) {
			this.hoverIsActive = false;
			if (timeUntilResume) {
				setTimeout(this.resumeHover, timeUntilResume);
			}
		},
		resumeHover() {
			this.hoverIsActive = true;
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.expandable-loan-card-expanded {
	z-index: 1001;

	@include breakpoint(small only) {
		position: fixed;
		background: $ghost;

		/* !important is required since positioning for desktop is set in JS */
		top: 0 !important;
		left: 0 !important;
		bottom: 0;
		right: 0;
		margin: 0;
		padding: 0;

		.loan-card-controller-component {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
		}
	}

	@include breakpoint(medium) {
		position: absolute;
	}
}
</style>
