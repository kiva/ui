<template>
	<kv-button
		class="checkout-now-button secondary"
		v-kv-track-event="['Lending', 'click-Read more', 'checkout-now-button-click', loanId, loanId]"
		:to="disableRedirects ? null : '/basket'"
		@click.native="checkoutBtnAction"
	>
		<kv-icon class="icon" name="checkmark" v-if="!minimalCheckoutButton" />
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
		disableRedirects: {
			type: Boolean,
			default: false,
		},
		loanId: {
			type: Number,
			default: null
		},
		minimalCheckoutButton: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		checkoutBtnAction() {
			this.$emit(
				'add-to-basket',
				{
					eventSource: 'checkoutBtnClick'
				}
			);
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

a.secondary.button {
	padding: rem-calc(13) 0;

	.icon {
		width: rem-calc(30);
		height: rem-calc(30);
		vertical-align: middle;
		position: relative;
		margin-top: rem-calc(-5);
		margin-right: rem-calc(5);
		padding: 0.35rem;
		border: 1px solid $charcoal;
		border-radius: 50%;
	}

	&:focus {
		color: $charcoal;
		border: 1px solid $charcoal;
		box-shadow: 0 rem-calc(2) $charcoal;

		.icon {
			color: $charcoal;
		}
	}

	&:hover,
	&:active {
		color: $blue;
		border: 1px solid $blue;
		box-shadow: 0 rem-calc(2) $blue;

		.icon {
			border-color: $blue;
			fill: $blue;
		}
	}
}
</style>
