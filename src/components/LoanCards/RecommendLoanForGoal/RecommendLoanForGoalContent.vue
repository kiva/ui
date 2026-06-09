<template>
	<section
		class="recommended-goal-card-content tw-flex tw-flex-col tw-items-center
			tw-bg-white tw-pt-3 md:tw-pt-2 tw-pb-4 md:tw-pb-3"
		:class="sectionClasses"
		:style="sectionStyle"
	>
		<h3 class="tw-text-title tw-mb-1 md:tw-mb-1.5 tw-text-action-highlight tw-text-center">
			{{ heading }}
		</h3>
		<div class="recommended-goal-card-container tw-max-w-full tw-px-2.5 md:!tw-px-0 md:!tw-mx-auto">
			<KvCompactLoanCard
				ref="kvCompactLoanCard"
				v-bind="cardAttrs"
				:disabled="isAdding"
				variant="post-goal"
				:enable-multi-matching="enableMultiMatching"
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
import useMultiMatching from '#src/composables/useMultiMatching';

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

const { enableMultiMatching } = useMultiMatching();
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

<style lang="postcss" scoped>
.recommended-goal-card-container {
	@screen md {
		max-width: 360px;
	}
}
</style>
