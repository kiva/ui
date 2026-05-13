<template>
	<section
		class="tw-flex tw-flex-col tw-items-center tw-bg-white tw-py-3"
		:class="sectionClasses"
		:style="sectionStyle"
	>
		<h3 class="tw-mb-2 md:tw-mb-4 tw-text-action-highlight tw-text-center">
			{{ heading }}
		</h3>
		<div class="tw-mx-auto tw-w-full" style="max-width: 360px;">
			<KvCompactLoanCard
				ref="kvCompactLoanCard"
				v-bind="cardAttrs"
				:disabled="isAdding"
				variant="post-goal"
			/>
		</div>
	</section>
</template>

<script setup>
import {
	computed,
	useAttrs,
	ref,
	defineExpose,
} from 'vue';
import { KvCompactLoanCard } from '@kiva/kv-components';

defineOptions({
	name: 'RecommendLoanForGoalContent',
	inheritAttrs: false,
});

defineProps({
	heading: {
		type: String,
		default: 'Start your goal with this recommended loan',
	},
	/**
	 * Passed through to `KvCompactLoanCard` so the card is disabled while add runs (matches KvLendCta `isAdding`).
	 */
	isAdding: {
		type: Boolean,
		default: false,
	},
});

const kvCompactLoanCard = ref(null);
const attrs = useAttrs();

const sectionClasses = computed(() => attrs.class);

const sectionStyle = computed(() => attrs.style);

const cardAttrs = computed(() => {
	const { class: _c, style: _s, ...rest } = attrs;
	return rest;
});

const getSelectedAmount = () => {
	return kvCompactLoanCard.value?.selectedAmount;
};

defineExpose({
	getSelectedAmount,
});
</script>
