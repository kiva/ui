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
			return this.shiftIncrement === -1;
		},
		shiftLeftDouble() {
			return this.shiftIncrement === -2;
		},
		shiftRight() {
			return this.shiftIncrement === 1;
		},
		shiftRightDouble() {
			return this.shiftIncrement === 2;
		},
	},
	mixins: [
		hoverLoanCardMixin,
	],
	methods: {
		handleMouseEnter() {
			if (this.rowHasDetailedLoan && !this.isDetailed) {
				this.updateDetailedLoanIndex();
			}
			this.updateHoverLoanIndex();
		},
		updateHoverLoanIndex() {
			this.$emit('update-hover-loan-index', this.loanIndex);
		},
		updateDetailedLoanIndex() {
			this.$emit('update-detailed-loan-index', this.loanIndex);
		},
	},
};
</script>

<style lang="scss" scoped>
@import "settings";

.hover-loan-card {
	$chevron-animation-duration: 0.2s;
	$card-expansion-duration: 0.15s;
	$card-expansion-curve: linear;
	$chevron-animation-out: $chevron-animation-duration linear;
	$chevron-animation-in: $chevron-animation-out $card-expansion-duration;

	padding: rem-calc(25) rem-calc(10) rem-calc(41) rem-calc(10);

	/*
		Using variables due to:
		1) Limitations disabling max-len in eslint in SASS
		2) Incorrect SASS transpilation when using multi-line
	*/
	$transition1: padding-bottom $card-expansion-duration $card-expansion-curve;
	$transition2: transform $card-expansion-duration $card-expansion-curve;

	transition: $transition1, $transition2;

	.hover-loan-card-wrapper {
		position: relative;
		transition: opacity $card-expansion-duration ease-out;

		.more-details-wrapper {
			position: absolute;
			bottom: rem-calc(-50);
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
		transform: translateX(-200px);
	}

	&.shift-left-double {
		transform: translateX(-400px);
	}

	&.shift-right {
		transform: translateX(200px);
	}

	&.shift-right-double {
		transform: translateX(400px);
	}

	&.expanded {
		z-index: 1;

		.hover-loan-card-wrapper {
			.more-details-wrapper {
				opacity: 1;
				transform: translate(-50%, 0);
				pointer-events: initial;

				/*
					Using variables due to:
					1) Limitations disabling max-len in eslint in SASS
					2) Incorrect SASS transpilation when using multi-line
				*/
				$transition1: opacity $chevron-animation-in;
				$transition2: transform $chevron-animation-in;
				$transition3: pointer-events 0s linear $card-expansion-duration;

				transition: $transition1, $transition2, $transition3;
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
