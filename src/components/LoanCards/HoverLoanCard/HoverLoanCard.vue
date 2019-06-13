<template>
	<div
		class="hover-loan-card"
		:class="{
			'row-has-detailed-loan-cache-id': rowHasDetailedLoanCacheId,
			'is-detailed': isDetailed,
		}"
		@mouseenter="handleMouseEnter"
		@mouseleave="handleMouseLeave"
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
				@click="updateDetailedLoanCacheId"
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
		detailedLoanCacheId: {
			type: String,
			default: null,
		},
		hoverLoanCacheId: {
			type: String,
			default: null,
		},
	},
	computed: {
		expanded() {
			return !this.rowHasDetailedLoanCacheId && this.hover;
		},
		hover() {
			return this.loanCacheId === this.hoverLoanCacheId;
		},
		isDetailed() {
			return this.loanCacheId === this.detailedLoanCacheId;
		},
		loanCacheId() {
			// eslint-disable-next-line no-underscore-dangle
			return `${this.loan.__typename}:${this.loan.id}`;
		},
		rowHasDetailedLoanCacheId() {
			return this.detailedLoanCacheId !== null;
		},
	},
	mixins: [
		hoverLoanCardMixin,
	],
	methods: {
		handleMouseEnter() {
			if (this.rowHasDetailedLoanCacheId && !this.isDetailed) {
				this.updateDetailedLoanCacheId();
			}
			this.updateHoverLoanCacheId(true);
		},
		handleMouseLeave() {
			this.updateHoverLoanCacheId(false);
		},
		updateHoverLoanCacheId(hover) {
			this.$emit('update-hover-loan-cache-id', hover ? this.loanCacheId : null);
		},
		updateDetailedLoanCacheId() {
			this.$emit('update-detailed-loan-cache-id', this.loanCacheId);
		},
	},
};
</script>

<style lang="scss" scoped>
@import "settings";

.hover-loan-card {
	$chevron-animation-duration: 0.2s;
	$card-expansion-duration: 0.2s;

	padding: rem-calc(25) rem-calc(10) rem-calc(41) rem-calc(10);
	transition: padding-bottom $card-expansion-duration linear;

	.hover-loan-card-wrapper {
		position: relative;
		transition: opacity $card-expansion-duration ease-out;

		.more-details-wrapper {
			$chevron-animation-out: $chevron-animation-duration linear;
			$chevron-animation-in: $chevron-animation-out $card-expansion-duration;

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

			&.expanded {
				opacity: 1;
				transform: translate(-50%, 0);
				pointer-events: initial;
				transition:
					opacity $chevron-animation-in,
					transform $chevron-animation-in,
					pointer-events 0 linear $card-expansion-duration;
			}
		}
	}

	&.row-has-detailed-loan-cache-id {
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
