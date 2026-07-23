<template>
	<section
		class="tw-w-full tw-bg-eco-green-4 tw-px-2 tw-py-4 tw-text-center"
		data-testid="goal-in-review-slide-7"
	>
		<div class="tw-mx-auto tw-max-w-lg">
			<img
				:src="leafHeart"
				alt=""
				class="tw-w-8.5 tw-h-8.5  tw-mx-auto tw-mb-3"
			>

			<h1 class="tw-text-display tw-text-white tw-mb-3">
				Thank you!
			</h1>

			<div class="tw-flex tw-flex-col tw-gap-2 tw-text-base tw-text-eco-green-1 tw-mb-3">
				<p>
					Behind every number is a name. Behind every loan is a dream.
					Thank you for helping make <strong>{{ dreamsCopy }}</strong> more possible {{ timeframe }}.
				</p>
				<p v-if="isPastGoalYear">
					Imagine what another year of lending could make possible.
				</p>
			</div>

			<div class="tw-flex tw-flex-col tw-items-center tw-gap-2">
				<KvButton
					class="tw-w-full cta-button"
					data-testid="goal-in-review-slide-7-primary-cta"
					@click="emit(primaryCta.event)"
				>
					{{ primaryCta.label }}
				</KvButton>

				<template v-if="showFeedback">
					<button
						type="button"
						class="tw-inline-flex tw-items-center tw-gap-0.5 tw-text-brand-300 tw-font-medium"
						data-testid="goal-in-review-slide-7-feedback-toggle"
						@click="feedbackOpen = !feedbackOpen"
					>
						Share your feedback
						<KvMaterialIcon
							:icon="mdiChevronDown"
							class="tw-transition-transform"
							:class="{ 'tw-rotate-180': feedbackOpen }"
						/>
					</button>

					<!-- TODO(MP-3062): replace this placeholder with the real feedback survey -->
					<div
						v-if="feedbackOpen"
						class="tw-w-full tw-rounded tw-border tw-border-brand-400 tw-border-dashed
							tw-text-eco-green-1 tw-text-small tw-py-3 tw-px-2"
						data-testid="goal-in-review-slide-7-feedback-placeholder"
					>
						Feedback form coming soon (MP-3062)
					</div>
				</template>
			</div>
		</div>
	</section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { KvButton, KvMaterialIcon } from '@kiva/kv-components';
import { mdiChevronDown } from '@mdi/js';
import leafHeart from '#src/assets/images/leaf_heart.svg?url';

const props = defineProps({
	goalStatus: {
		type: String,
		default: '',
	},
	loanCount: {
		type: [Number, String],
		default: null,
	},
	year: {
		type: [Number, String],
		default: null,
	},
});

const emit = defineEmits(['back-to-kiva', 'finish-goal', 'set-goal']);

const feedbackOpen = ref(false);

const isComplete = computed(() => props.goalStatus === 'completed');

// After Jan 1 of the year following the goal year, the recap points forward to next year's goal.
const isPastGoalYear = computed(() => Boolean(props.year) && new Date().getFullYear() > Number(props.year));

const dreamsCopy = computed(() => (props.loanCount ? `${props.loanCount} dreams` : 'more dreams'));

const timeframe = computed(() => (isPastGoalYear.value ? 'last year' : 'this year'));

const primaryCta = computed(() => {
	if (isPastGoalYear.value) {
		return { label: `Set my ${Number(props.year) + 1} goal`, event: 'set-goal' };
	}
	if (isComplete.value) {
		return { label: 'Back to Kiva', event: 'back-to-kiva' };
	}
	return { label: `Finish my ${props.year} goal`, event: 'finish-goal' };
});

const showFeedback = computed(() => !isPastGoalYear.value);
</script>

<style lang="postcss" scoped>
:deep(.cta-button > span) {
	@apply tw-bg-eco-green-2 !tw-text-gray-800;
}
</style>
