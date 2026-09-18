<template>
	<div class="tw-flex tw-flex-col tw-items-center tw-gap-1">
		<kv-button
			class="goal-footer-button"
			:to="primaryTo"
			:variant="primaryButtonVariant"
			:state="primaryButtonState"
			@click="onPrimaryCtaClick"
		>
			{{ primaryLabel }}
			<kv-loading-spinner
				v-if="showRedirectingLoading"
				size="small"
				class="tw-mr-1"
			/>
		</kv-button>
		<kv-button
			class="goal-footer-button md:tw-pb-1"
			variant="ghost"
			:state="isAdding ? 'disabled' : ''"
			@click="onSecondaryCtaClick"
		>
			{{ secondaryLabel }}
		</kv-button>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { KvButton, KvLoadingSpinner } from '@kiva/kv-components';

defineOptions({ name: 'RecommendLoanForGoalFooter' });

const ADDING_LABEL = 'Adding to basket';
const CHECKOUT_LABEL = 'Checkout now';
const CHECKOUT_TO = '/basket';

const props = defineProps({
	/**
	 * True while the parent’s add-to-basket request is in flight (matches KvLendCta add button).
	 */
	isAdding: {
		type: Boolean,
		default: false,
	},
	/**
	 * True when this loan is already in the basket (matches KvLendCta `isInBasket`); primary shows checkout button.
	 */
	isInBasket: {
		type: Boolean,
		default: false,
	},
	/**
	 * When true, shows “Support now” by default and shows express checkout text.
	 */
	expressCheckoutEnabled: {
		type: Boolean,
		default: false,
	},
	/**
	 * Resolved by the parent container: true when express checkout is enabled and the
	 * page is about to redirect to /basket (basket already has other items).
	 */
	showRedirectingLoading: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['primary-cta-click', 'checkout-click', 'secondary-cta-click']);

const primaryButtonState = computed(() => (
	props.showRedirectingLoading ? 'disabled' : ''
));

const primaryLabel = computed(() => {
	if (props.showRedirectingLoading) {
		return '';
	}
	if (props.isAdding) {
		return ADDING_LABEL;
	}
	if (props.isInBasket) {
		return CHECKOUT_LABEL;
	}
	return props.expressCheckoutEnabled
		? 'Add to basket'
		: 'Add to basket to get started';
});

const primaryTo = computed(() => (
	props.isInBasket && !props.expressCheckoutEnabled ? CHECKOUT_TO : undefined
));

const primaryButtonVariant = computed(() => (
	props.isInBasket && !props.isAdding ? 'secondary' : 'primary'
));

const onPrimaryCtaClick = event => {
	if (props.isAdding || props.showRedirectingLoading) {
		return;
	}
	if (props.isInBasket) {
		emit('checkout-click', event);
		return;
	}
	emit('primary-cta-click', event);
};

const onSecondaryCtaClick = event => {
	if (props.isAdding) {
		return;
	}
	emit('secondary-cta-click', event);
};
</script>

<style lang="postcss" scoped>
.goal-footer-button {
	max-width: 330px;

	@apply tw-w-full !tw-rounded-full;
}
</style>
