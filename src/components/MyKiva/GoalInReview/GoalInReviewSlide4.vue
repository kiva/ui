<template>
	<section
		class="tw-w-full tw-bg-gray-50 tw-px-2.5 tw-py-4 md:tw-px-4 md:tw-py-7.5"
		data-testid="goal-in-review-slide-4"
	>
		<p class="tw-text-base tw-text-eco-green-3 tw-mb-1">
			Giving insights
		</p>

		<h1 class="tw-text-display tw-text-eco-green-4 tw-mb-4">
			What your goal says
			<span class="tw-block tw-text-marigold">about you</span>
		</h1>

		<ul
			class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-2
				tw-list-none tw-p-0 tw-m-0"
			data-testid="goal-in-review-slide-4-cards"
		>
			<li
				class="tw-rounded tw-shadow-lg tw-p-2.5 tw-bg-marigold-1"
				data-testid="goal-in-review-slide-4-card-origin-story"
			>
				<div class="tw-mb-2">
					<CloudSun
						class="tw-h-5.5 tw-w-5.5"
						viewBox="0 0 50 50"
						aria-hidden="true"
					/>
				</div>

				<p class="tw-text-base tw-text-marigold-3 tw-mb-0.5">
					Your origin story
				</p>
				<h2 class="!tw-text-headline tw-text-eco-green-4 tw-mb-0.5">
					{{ originStory.title }}
				</h2>
				<p class="tw-text-base tw-text-eco-green-4 tw-m-0">
					{{ originStory.content }}
				</p>
			</li>

			<li
				class="tw-rounded tw-shadow-lg tw-p-2.5 tw-bg-desert-rose-1"
				data-testid="goal-in-review-slide-4-card-impact-identity"
			>
				<div class="tw-mb-2">
					<DoubleHandsAndHeart
						class="tw-h-5.5 tw-w-5.5"
						viewBox="0 0 36 40"
						aria-hidden="true"
					/>
				</div>

				<p class="tw-text-base tw-text-desert-rose tw-mb-0.5">
					Your impact identity
				</p>
				<h2 class="!tw-text-headline tw-text-eco-green-4 tw-mb-0.5">
					{{ impactIdentity.title }}
				</h2>
				<p class="tw-text-base tw-text-eco-green-4 tw-m-0">
					{{ impactIdentity.content }}
				</p>
			</li>

			<li
				class="tw-rounded tw-shadow-lg tw-p-2.5 tw-bg-eco-green-1"
				data-testid="goal-in-review-slide-4-card-impact-habit"
			>
				<div class="tw-mb-2">
					<GreenPuzzle
						class="tw-h-5.5 tw-w-5.5"
						viewBox="0 0 42 40"
						aria-hidden="true"
					/>
				</div>

				<p class="tw-text-base tw-text-eco-green-3 tw-mb-0.5">
					Your impact habit
				</p>
				<h2 class="!tw-text-headline tw-text-eco-green-4 tw-mb-0.5">
					{{ impactHabit.title }}
				</h2>
				<p class="tw-text-base tw-text-eco-green-4 tw-m-0">
					{{ impactHabit.content }}
				</p>
			</li>
		</ul>
	</section>
</template>

<script setup>
import { computed } from 'vue';
import goalInReviewCopy from '#src/util/goalInReviewCopy';
import CloudSun from '#src/assets/images/my-kiva/goal-in-review/cloud-sun.svg';
import DoubleHandsAndHeart from '#src/assets/images/my-kiva/goal-in-review/double-hands-and-heart.svg';
import GreenPuzzle from '#src/assets/images/my-kiva/goal-in-review/green-puzzle.svg';

const props = defineProps({
	goalSummary: {
		type: Object,
		default: null,
	},
});

const originStory = computed(() => goalInReviewCopy.getOriginStory(props.goalSummary?.dateStarted));
const impactIdentity = computed(() => goalInReviewCopy.getImpactIdentity(props.goalSummary?.category));
const impactHabit = computed(() => goalInReviewCopy.getImpactHabit(props.goalSummary?.transactionSessionCount));
</script>
