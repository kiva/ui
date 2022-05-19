<template>
	<kv-button
		class="tw-w-full tw-align-middle"
		:to="disableRedirects ? null : '/basket'"
		variant="secondary"
		v-kv-track-event="['Lending', 'click-Read more', 'checkout-now-button-click', loanId, loanId]"
		@click="checkoutBtnAction"
	>
		<kv-material-icon
			v-if="!minimalCheckoutButton"
			class="tw-w-3 tw-mr-0.5 tw-align-middle"
			:icon="mdiCheckboxMarkedCircleOutline"
		/>
		Checkout<span v-if="!minimalCheckoutButton"> now</span>
	</kv-button>
</template>

<script>
import { mdiCheckboxMarkedCircleOutline } from '@mdi/js';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	components: {
		KvButton,
		KvMaterialIcon
	},
	data() {
		return {
			mdiCheckboxMarkedCircleOutline
		};
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
