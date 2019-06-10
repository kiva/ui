<template>
	<div
		class="hover-loan-card"
		@mouseenter="handleMouseEnter"
		@mouseleave="handleMouseLeave"
	>
		<hover-loan-card-small
			:amount-left="amountLeft"
			:is-funded="isFunded"
			:loan="loan"
			:percent-raised="percentRaised"
			:hover="hover"
		/>
		<hover-loan-card-large
			:amount-left="amountLeft"
			:is-funded="isFunded"
			:loan="loan"
			:percent-raised="percentRaised"
			:hover="hover"
			:expiring-soon-message="expiringSoonMessage"
			:is-visitor="isVisitor"
			:is-selected-by-another="isSelectedByAnother"
			:items-in-basket="itemsInBasket"
		/>
	</div>
</template>

<script>
import HoverLoanCardSmall from './HoverLoanCardSmall';
import HoverLoanCardLarge from './HoverLoanCardLarge';
import hoverLoanCardMixin from './hoverLoanCardMixin';

export default {
	components: {
		HoverLoanCardSmall,
		HoverLoanCardLarge,
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
	},
	data() {
		return {
			hover: false,
		};
	},
	mixins: [
		hoverLoanCardMixin,
	],
	methods: {
		handleMouseEnter() {
			this.hover = true;
		},
		handleMouseLeave() {
			this.hover = false;
		},
	},
};
</script>

<style lang="scss" scoped>
@import "settings";

.hover-loan-card {
	position: relative;
	margin: rem-calc(25) rem-calc(10);
}
</style>
