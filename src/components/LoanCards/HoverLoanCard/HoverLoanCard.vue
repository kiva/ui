<template>
	<div
		class="hover-loan-card"
		:class="{
			expanded,
			'row-has-detailed-loan': rowHasDetailedLoan,
			'is-detailed': isDetailed,
			'shift-left': shiftLeft,
			'shift-left-double': shiftLeftDouble,
			'shift-right': shiftRight,
			'shift-right-double': shiftRightDouble,
		}"
		@mouseenter="handleMouseEnter"
		@click="handleClick"
	>
		<div
			class="hover-loan-card-wrapper"
		>
			<hover-loan-card-small
				:amount-left="amountLeft"
				:is-funded="isFunded"
				:loan="loan"
				:percent-raised="percentRaised"
				:expanded="expanded"
			/>
			<hover-loan-card-large
				:amount-left="amountLeft"
				:is-funded="isFunded"
				:loan="loan"
				:percent-raised="percentRaised"
				:expanded="expanded"
				:expiring-soon-message="expiringSoonMessage"
				:is-visitor="isVisitor"
				:is-selected-by-another="isSelectedByAnother"
				:items-in-basket="itemsInBasket"
				@update-detailed-loan-index="updateDetailedLoanIndex"
			/>
			<div
				class="more-details-wrapper"
				:class="{expanded}"
				@click="updateDetailedLoanIndex"
			>
				<kv-icon class="more-details-arrow" name="medium-chevron" />
			</div>
		</div>
	</div>
</template>

<script>
import HoverLoanCardSmall from './HoverLoanCardSmall';
import HoverLoanCardLarge from './HoverLoanCardLarge';
import hoverLoanCardMixin from './hoverLoanCardMixin';
import KvIcon from '@/components/Kv/KvIcon';
import categoryRowArrowsVisibleMixin from '@/plugins/category-row-arrows-visible-mixin';

export default {
	components: {
		HoverLoanCardSmall,
		HoverLoanCardLarge,
		KvIcon,
	},
	props: {
		cardNumber: {
			type: Number,
			default: null,
		},
		expiringSoonMessage: {
			type: String,
			default: ''
		},
		isSelectedByAnother: {
			type: Boolean,
			default: false
		},
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		isVisitor: {
			type: Boolean,
			required: true,
		},
		detailedLoanIndex: {
			type: Number,
			default: null,
		},
		hoverLoanIndex: {
			type: Number,
			default: null,
		},
		shiftIncrement: {
			type: Number,
			default: 0,
		},
	},
	computed: {
		expanded() {
			return !this.rowHasDetailedLoan && this.hover;
		},
		hover() {
			return this.loanIndex === this.hoverLoanIndex;
		},
		isDetailed() {
			return this.loanIndex === this.detailedLoanIndex;
		},
		loanIndex() {
			return this.cardNumber - 1;
		},
		rowHasDetailedLoan() {
			return this.detailedLoanIndex !== null;
		},
		shiftLeft() {
			return !this.rowHasDetailedLoan && this.shiftIncrement === -1;
		},
		shiftLeftDouble() {
			return !this.rowHasDetailedLoan && this.shiftIncrement === -2;
		},
		shiftRight() {
			return !this.rowHasDetailedLoan && this.shiftIncrement === 1;
		},
		shiftRightDouble() {
			return !this.rowHasDetailedLoan && this.shiftIncrement === 2;
		},
	},
	mixins: [
		hoverLoanCardMixin,
		categoryRowArrowsVisibleMixin,
	],
	methods: {
		handleMouseEnter() {
			if (this.rowHasDetailedLoan && !this.isDetailed) {
				this.updateDetailedLoanIndex();
			} else if (this.hoverEffectActive()) {
				this.updateHoverLoanIndex();
			}
		},
		hoverEffectActive() {
			const windowWidth = document.documentElement.clientWidth;
			const arrowsVisible = this.categoryRowArrowsVisible();

			return (arrowsVisible && windowWidth >= 800) || (!arrowsVisible && windowWidth >= 768);
		},
		updateHoverLoanIndex() {
			this.$emit('update-hover-loan-index', this.loanIndex);
			this.trackInteraction({
				interactionType: 'hover-expand',
				interactionElement: 'hover-card'
			});
		},
		updateDetailedLoanIndex() {
			this.$emit('update-detailed-loan-index', this.loanIndex);
			this.trackInteraction({
				interactionType: 'hover-details-click',
				interactionElement: 'hover-card'
			});
		},
		handleClick() {
			if (!this.hoverEffectActive()) {
				this.$emit('update-detailed-loan-index', this.loanIndex);
			}
		},
		trackInteraction(args) {
			this.$emit('track-interaction', args);
		},
	},
};
</script>

<style lang="scss" scoped>
@import "settings";
@import "components/loan-cards/hover-loan-card";

.hover-loan-card {
	padding: rem-calc(87) rem-calc($hover-card-right-margin) rem-calc(109) rem-calc($hover-card-right-margin);

	$transition1: padding-bottom $card-expansion-duration $card-expansion-curve;
	$transition2: transform $card-expansion-duration $card-expansion-curve;

	transition: $transition1, $transition2;

	.hover-loan-card-wrapper {
		position: relative;
		transition: $hover-card-transition-opacity-out;

		.more-details-wrapper {
			position: absolute;
			bottom: rem-calc(-118);
			left: 50%;
			cursor: pointer;
			opacity: 0;
			transform: translate(-50%, rem-calc(-10));
			transition: opacity $chevron-animation-out, transform $chevron-animation-out;
			pointer-events: none;

			.more-details-arrow {
				stroke: $blue;
				width: rem-calc(30);
				height: rem-calc(12);
			}
		}
	}

	&.shift-left {
		transform: translateX(-$hover-card-width-difference / 2);
	}

	&.shift-left-double {
		transform: translateX(-$hover-card-width-difference);
	}

	&.shift-right {
		transform: translateX($hover-card-width-difference / 2);
	}

	&.shift-right-double {
		transform: translateX($hover-card-width-difference);
	}

	&.expanded {
		z-index: 1;

		.hover-loan-card-wrapper {
			.more-details-wrapper {
				opacity: 1;
				transform: translate(-50%, 0);
				pointer-events: initial;

				$transition1: opacity $chevron-animation-in;
				$transition2: transform $chevron-animation-in;

				transition: $transition1, $transition2;
			}
		}
	}

	&.row-has-detailed-loan {
		padding-bottom: rem-calc(9);

		.hover-loan-card-wrapper {
			opacity: 0.4;
		}

		&.is-detailed {
			.hover-loan-card-wrapper {
				opacity: 1;
			}
		}
	}

	&:first-of-type {
		padding-left: 0;
	}
}
</style>
