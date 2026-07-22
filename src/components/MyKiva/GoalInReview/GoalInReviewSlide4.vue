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
					Spark starter
				</h2>
				<p class="tw-text-base tw-text-eco-green-4 tw-m-0">
					You began in <strong class="tw-font-medium">January</strong>, when
					possibilities feel endless. Optimistic and action-oriented, you
					believe big change starts with a single decision.
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
					Barrier breaker
				</h2>
				<p class="tw-text-base tw-text-eco-green-4 tw-m-0">
					You chose to support <strong class="tw-font-medium">women entrepreneurs</strong>
					this year, helping expand access to opportunity, independence, and
					economic growth.
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
					Kiva champion
				</h2>
				<p class="tw-text-base tw-text-eco-green-4 tw-m-0">
					You showed up <strong class="tw-font-medium">6 times</strong> this
					year, turning your commitment to impact into a lasting habit.
				</p>
			</li>
		</ul>
	</section>
</template>

<script setup>
import CloudSun from '#src/assets/images/my-kiva/goal-in-review/cloud-sun.svg';
import DoubleHandsAndHeart from '#src/assets/images/my-kiva/goal-in-review/double-hands-and-heart.svg';
import GreenPuzzle from '#src/assets/images/my-kiva/goal-in-review/green-puzzle.svg';

defineProps({
	geography: {
		type: Object,
		default: null,
	},
});
</script>
