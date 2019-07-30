<template>
	<kv-button
		class="checkout-now-button secondary"
		v-kv-track-event="['Lending', 'click-Read more', 'checkout-now-button-click', loanId, 'true']"
		to="/basket"
	>
		<kv-icon name="check-in-circle" v-if="!minimalCheckoutButton" />
		Checkout<span v-if="!minimalCheckoutButton"> now</span>
	</kv-button>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvIcon,
		KvButton,
	},
	props: {
		loanId: {
			type: Number,
			default: null
		},
		minimalCheckoutButton: {
			type: Boolean,
			default: false,
		},
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

a.secondary.button {
	padding: rem-calc(13) 0;

	.icon-check-in-circle {
		width: rem-calc(30);
		height: rem-calc(30);
		vertical-align: middle;
		position: relative;
		margin-top: rem-calc(-5);
		margin-right: rem-calc(5);
	}

	&:focus {
		color: $charcoal;
		border: 1px solid $charcoal;
		box-shadow: 0 rem-calc(2) $charcoal;

		svg.icon-check-in-circle {
			color: $charcoal;
		}
	}

	&:hover,
	&:active {
		color: $blue;
		border: 1px solid $blue;
		box-shadow: 0 rem-calc(2) $blue;

		svg.icon-check-in-circle {
			color: $blue;
		}
	}
}
</style>
