<template>
	<div
		class="tw-flex tw-justify-between tw-items-center tw-w-full tw-border-2 tw-border-gray-200 tw-rounded
			tw-p-2.5 tw-py-1 tw-cursor-pointer tw-relative tw-gap-2"
		:class="{
			'!tw-border-eco-green-3 tw-bg-eco-green-1': selected,
			'lg:tw-flex-col lg:!tw-px-1.5 lg:!tw-gap-1 lg:tw-py-1.5': customGoalAmountEnable,
		}"
	>
		<div
			v-if="highlightedText"
			class="tw-bg-marigold-2 tw-rounded-lg tw-text-small tw-drop-shadow-md tw-hidden lg:tw-block
				tw-absolute tw--top-1.5 tw-px-1.5 tw-left-1/2 tw--translate-x-1/2 tw-whitespace-nowrap"
		>
			{{ highlightedText }}
		</div>
		<div
			class="tw-flex lg:tw-flex-col tw-gap-1 lg:tw-gap-0 tw-items-baseline lg:tw-items-center
						tw-text-eco-green-3"
			:class="{'lg:!tw-flex-row lg:!tw-items-baseline lg:tw-gap-0.5': customGoalAmountEnable}"
		>
			<span
				class="tw-text-h1 tw-text-center"
				:class="{ '!tw-text-h2': isThreeDigitsNumber || customGoalAmountEnable }"
				style="line-height: 1;"
			>
				{{ loansNumber }}
			</span>
			<span class="tw-text-small tw-text-center">loans</span>
		</div>
		<div class="tw-flex tw-flex-col tw-gap-1">
			<div
				v-if="highlightedText"
				class="tw-bg-marigold-2 tw-rounded-lg tw-text-small tw-drop-shadow-md lg:tw-hidden tw-px-1.5"
			>
				{{ highlightedText }}
			</div>
			<div class="tw-text-primary !tw-font-medium tw-text-h5 tw-text-center">
				{{ optionText }}
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	selected: {
		type: Boolean,
		default: false,
	},
	highlightedText: {
		type: String,
		default: '',
	},
	loansNumber: {
		type: Number,
		default: 2,
	},
	optionText: {
		type: String,
		default: '',
	},
	/**
	 * Whether the custom goal amount feature is enabled (from experiment)
	 */
	customGoalAmountEnable: {
		type: Boolean,
		default: false,
	},
});

const isThreeDigitsNumber = computed(() => {
	const numString = Math.abs(props.loansNumber).toString();
	return numString.length >= 3;
});
</script>
