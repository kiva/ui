<template>
	<div class="expandable-loan-card-expanded">
		<div
			class="expandable-loan-card-expanded-container column column-block"
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
		<div
			class="expandable-loan-card-expanded-tablet-overlay show-for-medium"
			v-if="hoverLoanId"
			@click="clearHoverLoan"
		>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import activeLoanClient from '@/graphql/query/activeLoanClient.graphql';
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
		rightArrowPosition: {
			type: Number,
			default: undefined,
		},
		leftArrowPosition: {
			type: Number,
			default: undefined,
		},
	},
	computed: {
		isUnderArrow() {
			return this.isUnderRightArrow || this.isUnderLeftArrow;
		},
		isUnderRightArrow() {
			return this.rightArrowPosition !== undefined && (this.hoverLoanXCoordinate + 254) > this.rightArrowPosition;
		},
		isUnderLeftArrow() {
			return this.leftArrowPosition !== undefined && this.hoverLoanXCoordinate < this.leftArrowPosition;
		},
		shouldNotExpandCard() {
			const isUnderArrowOnDesktop = this.arrowsVisible() && this.isUnderArrow;
			const isOffScreenOnTablet =
				document.documentElement.clientWidth > 480
				&& (this.hoverLoanXCoordinate + 254) > document.documentElement.clientWidth;
			return !this.hoverIsActive || isUnderArrowOnDesktop || isOffScreenOnTablet;
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
		collapseCardAndPauseHover(timeToPause) {
			this.clearHoverLoan();
			this.pauseHover(timeToPause);
		},
		activeLoanWillChange() {
			this.expanded = false;
			this.show = false;
		},
		activeLoanDidChange() {
			if (this.shouldNotExpandCard) {
				this.clearHoverLoan();
				return;
			}
			if (!this.$refs.expandedContainer) {
				return;
			}
			const xOffset = this.tracking.cardNumber === 1 ? -15 : -5;
			this.$refs.expandedContainer.style.top = `${this.hoverLoanYCoordinate}px`;
			this.$refs.expandedContainer.style.left = `${this.hoverLoanXCoordinate + xOffset}px`;
			this.expanded = false;
			this.show = true;
			this.lockScrollSmallOnly();
			setTimeout(() => { this.expanded = true; }, 0);
		},
		activeLoanWillClear() {},
		activeLoanDidClear() {
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
		arrowsVisible() {
			/*
			We are using the lack of CSS hover support to gate the visibility of the arrows. That doesn't sync with
			usingTouch unfortunately.
			*/
			if (typeof window === 'undefined' || typeof document === 'undefined') {
				return true;
			}
			const rightArrow = document.querySelector('.arrow.right-arrow');
			if (!rightArrow) {
				return true;
			}
			return window.getComputedStyle(rightArrow).display !== 'none';
		},
	},
	mounted() {
		this.apollo.watchQuery({ query: activeLoanClient }).subscribe({
			next: ({ data }) => {
				const activeLoanState = _get(data, 'activeLoan');
				if (activeLoanState.hoverLoanId) {
					this.activeLoanWillChange();
				} else {
					this.activeLoanWillClear();
				}
				this.activeLoan = Object.assign({}, this.activeLoan, {
					xCoordinate: activeLoanState.xCoordinate,
					yCoordinate: activeLoanState.yCoordinate,
					loan: activeLoanState.loan,
					hoverLoanId: activeLoanState.hoverLoanId,
					tracking: activeLoanState.tracking,
				});
				if (activeLoanState.hoverLoanId) {
					this.activeLoanDidChange();
				} else {
					this.activeLoanDidClear();
				}
			},
		});
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.expandable-loan-card-expanded {
	.expandable-loan-card-expanded-container {
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

	.expandable-loan-card-expanded-tablet-overlay {
		display: none;
		pointer-events: none;
	}

	@include breakpoint(medium) {
		@media (hover: none) {
			.expandable-loan-card-expanded-tablet-overlay {
				display: block;
				pointer-events: initial;
				position: fixed;
				z-index: 1000;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
			}
		}
	}
}
</style>
