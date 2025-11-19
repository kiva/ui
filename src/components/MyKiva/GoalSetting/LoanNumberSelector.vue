<template>
	<div
		class="tw-flex tw-justify-between tw-items-center tw-w-full tw-border-2 tw-border-gray-200 tw-rounded
			tw-p-2.5 tw-py-1 tw-cursor-pointer tw-relative tw-gap-1"
		:class="{ 'tw-border-eco-green-3 tw-bg-eco-green-1': selected }"
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
		>
			<span
				class="tw-text-h1 tw-text-center"
				:class="{ '!tw-text-h2': isThreeDigitsNumber }"
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
			<div class="tw-text-primary tw-font-medium tw-text-h5">
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
});

const isThreeDigitsNumber = computed(() => {
	const numString = Math.abs(props.loansNumber).toString();
	return numString.length >= 3;
});
</script>
