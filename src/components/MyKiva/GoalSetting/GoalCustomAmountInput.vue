<template>
	<div class="tw-relative">
		<input
			type="number"
			v-model="customAmount"
			name="customGoalAmount"
			class="tw-rounded-sm tw-border-2 tw-border-gray-400 tw-pl-1.5 tw-py-0.5 tw-pr-4 tw-w-full
                tw-ring-inset focus:tw-outline-none focus:tw-ring-0 focus:tw-border-gray-400 custom-input"
			:class="{
				'!tw-border-brand-400': validCustomAmount,
				'!tw-border-desert-rose': validCustomAmount === false,
				'tw-min-h-5': isMobile,
			}"
			placeholder="Add number"
			@input="validateCustomAmount"
			autofocus
			inputmode="numeric"
		>
		<KvMaterialIcon
			v-if="validCustomAmount !== null"
			:icon="validCustomAmount ? mdiCheckCircle : mdiAlertCircle"
			class="tw-w-2 tw-h-2 tw-absolute tw-top-1/2 tw-right-1.5 tw--translate-y-1/2"
			:class="{
				'!tw-text-brand-650': validCustomAmount,
				'!tw-text-desert-rose': validCustomAmount === false,
			}"
		/>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { mdiCheckCircle, mdiAlertCircle } from '@mdi/js';
import { KvMaterialIcon } from '@kiva/kv-components';

const emit = defineEmits([
	'validate-custom-amount',
]);

defineProps({
	validCustomAmount: {
		type: Boolean,
		required: null
	},
	isMobile: {
		type: Boolean,
		required: false
	}
});

const customAmount = ref('');

const validateCustomAmount = event => {
	customAmount.value = event.target.value.replace(/[^0-9]/g, '');
	emit('validate-custom-amount', customAmount.value);
};
</script>

<style lang="postcss" scoped>
/* Chrome, Safari, Edge, Opera */
.custom-input::-webkit-outer-spin-button,
.custom-input::-webkit-inner-spin-button {
    @apply tw-appearance-none tw-m-0
}

/* Firefox */
.custom-input[type=number] {
  appearance: textfield;
}
</style>
