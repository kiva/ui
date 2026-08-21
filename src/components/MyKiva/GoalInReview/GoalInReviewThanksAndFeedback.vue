<template>
	<section
		class="tw-w-full tw-bg-eco-green-4 tw-px-2 tw-pt-4 tw-pb-6.5 tw-text-center"
		data-testid="goal-in-review-thanks-and-feedback"
	>
		<div class="tw-mx-auto tw-max-w-lg">
			<img
				:src="leafHeart"
				alt="Leaf heart"
				class="tw-w-8.5 tw-h-8.5  tw-mx-auto tw-mb-3 kv-fade-up thanks-and-feedback-heart"
			>

			<h1 class="tw-text-display tw-text-white tw-mb-3 kv-fade-up thanks-and-feedback-headline">
				Thank you!
			</h1>

			<div
				class="tw-flex tw-flex-col tw-gap-2 tw-text-base tw-text-eco-green-1 tw-mb-3
					kv-fade-up thanks-and-feedback-copy"
			>
				<p>
					Behind every number is a name. Behind every loan is a dream.
					{{ contributionLead }} <strong>{{ dreamsCopy }}</strong> more possible {{ timeframe }}.
				</p>
				<p v-if="isPastGoalYear">
					Imagine what another year of lending could make possible.
				</p>
			</div>

			<div class="tw-flex tw-flex-col tw-items-center tw-gap-2 kv-fade-up thanks-and-feedback-cta">
				<KvButton
					class="tw-w-full cta-button"
					data-testid="goal-in-review-thanks-and-feedback-primary-cta"
					@click="emit(primaryCta.event)"
				>
					{{ primaryCta.label }}
				</KvButton>

				<template v-if="showFeedback">
					<button
						type="button"
						class="tw-inline-flex tw-items-center tw-gap-0.5 tw-text-brand-300 tw-font-medium"
						data-testid="goal-in-review-thanks-and-feedback-feedback-toggle"
						@click="toggleFeedback"
					>
						Share your feedback
						<KvMaterialIcon
							:icon="mdiChevronDown"
							class="tw-transition-transform"
							:class="{ 'tw-rotate-180': feedbackOpen }"
						/>
					</button>

					<!--
						v-show (not v-if) keeps the survey mounted so re-toggling the CTA
						doesn't remount and reload the Form Assembly iframe.
					-->
					<div
						v-show="feedbackOpen"
						class="tw-w-full tw-text-eco-green-1"
						data-testid="goal-in-review-thanks-and-feedback-feedback-placeholder"
					>
						<GoalInReviewFeedbackForm @submitted="handleFeedbackSubmitted" />
					</div>
				</template>
			</div>
		</div>
	</section>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { KvButton, KvMaterialIcon } from '@kiva/kv-components';
import { mdiChevronDown } from '@mdi/js';
import GoalInReviewFeedbackForm from '#src/components/MyKiva/GoalInReview/GoalInReviewFeedbackForm';
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
	currentYear: {
		type: [Number, String],
		default: null,
	},
	feedbackSubmitted: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['goal-recap-back-to-kiva', 'finish-goal', 'set-goal', 'feedback-submitted']);

const $kvTrackEvent = inject('$kvTrackEvent', () => {});

const feedbackOpen = ref(false);
// Set once the survey is submitted this session so the toggle disappears and can't
// re-fire the share-feedback event.
const feedbackSubmittedLocally = ref(false);

const toggleFeedback = () => {
	feedbackOpen.value = !feedbackOpen.value;
	if (feedbackOpen.value) {
		$kvTrackEvent('portfolio', 'click', 'goal-in-review-share-feedback');
	}
};

const handleFeedbackSubmitted = () => {
	feedbackSubmittedLocally.value = true;
	feedbackOpen.value = false;
	emit('feedback-submitted');
};

const isComplete = computed(() => props.goalStatus === 'completed');

// After Jan 1 of the year following the goal year, the recap points forward to next year's goal.
// currentYear is passed down from the container; falls back to false (current-year state) when absent.
const isPastGoalYear = computed(() => {
	if (!props.year || props.currentYear == null) return false;
	return Number(props.currentYear) > Number(props.year);
});

const dreamsCopy = computed(() => (props.loanCount ? `${props.loanCount} dreams` : 'more dreams'));

const timeframe = computed(() => (isPastGoalYear.value ? 'last year' : 'this year'));

// In-progress goals in the current year get an "already helped" lead; everything else is a thank-you.
const contributionLead = computed(() => (!isComplete.value && !isPastGoalYear.value
	? "You've already helped make"
	: 'Thank you for helping make'));

const primaryCta = computed(() => {
	if (isPastGoalYear.value) {
		return { label: `Set my ${Number(props.year) + 1} goal`, event: 'set-goal' };
	}
	if (isComplete.value) {
		return { label: 'Back to Kiva', event: 'goal-recap-back-to-kiva' };
	}
	return { label: `Finish my ${props.year} goal`, event: 'finish-goal' };
});

const showFeedback = computed(() => !isPastGoalYear.value
	&& !props.feedbackSubmitted
	&& !feedbackSubmittedLocally.value);
</script>

<style lang="postcss" scoped>
:deep(.cta-button > span) {
	@apply tw-bg-eco-green-2 !tw-text-gray-800;
}

/* Entrance — shared .kv-fade-up (see css/animations.css); the closing beats
   build top-down: heart, then "Thank you!", the message, and the CTA. Gated on
   view by the modal wrapper. */
.thanks-and-feedback-heart,
.thanks-and-feedback-headline,
.thanks-and-feedback-copy,
.thanks-and-feedback-cta {
	--kv-fade-up-distance: 34px;
}

.thanks-and-feedback-headline {
	animation-delay: 0.1s;
}

.thanks-and-feedback-copy {
	animation-delay: 0.2s;
}

.thanks-and-feedback-cta {
	animation-delay: 0.3s;
}
</style>
