<template>
	<div class="tw-flex tw-flex-col tw-items-center tw-gap-1">
		<kv-button
			class="goal-footer-button"
			:to="primaryTo"
			:variant="primaryButtonVariant"
			@click="onPrimaryCtaClick"
		>
			{{ primaryLabel }}
		</kv-button>
		<kv-button
			v-if="!expressCheckoutEnabled"
			class="goal-footer-button"
			variant="ghost"
			:state="isAdding ? 'disabled' : ''"
			@click="onSecondaryCtaClick"
		>
			{{ secondaryLabel }}
		</kv-button>
		<div
			v-else
			class="tw-mb-3 tw-inline-flex tw-items-center tw-justify-center tw-gap-1 tw-self-center tw-text-small"
		>
			<ExpressCheckoutLines class="tw-shrink-0" aria-hidden="true" />
			<span class="tw-font-medium tw-text-secondary">{{ secondaryLabel }}</span>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { KvButton } from '@kiva/kv-components';
import ExpressCheckoutLines from '#src/assets/icons/inline/express-checkout-lines.svg';

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
});

const emit = defineEmits(['primary-cta-click', 'checkout-click', 'secondary-cta-click']);

const primaryLabel = computed(() => {
	if (props.isAdding) {
		return ADDING_LABEL;
	}
	if (props.isInBasket) {
		return CHECKOUT_LABEL;
	}
	return props.expressCheckoutEnabled
		? 'Support now'
		: 'Add to basket to get started';
});

const secondaryLabel = computed(() => {
	return props.expressCheckoutEnabled
		? 'Express checkout'
		: 'Explore more options';
});

const primaryTo = computed(() => (
	props.isInBasket ? CHECKOUT_TO : undefined
));

const primaryButtonVariant = computed(() => (
	props.isInBasket ? 'secondary' : 'primary'
));

const onPrimaryCtaClick = event => {
	if (props.isAdding) {
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

<style lang="scss" scoped>
.goal-footer-button {
	max-width: 330px;

	@apply tw-w-full !tw-rounded-full;
}
</style>
