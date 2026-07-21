<template>
	<section
		class="tw-w-full tw-bg-gray-50"
		data-testid="goal-in-review-slide-1"
	>
		<div class="tw-relative" data-testid="goal-in-review-slide-1-header">
			<ul class="tw-grid tw-grid-cols-3 md:tw-grid-cols-4 tw-list-none tw-p-0 tw-m-0">
				<li
					v-for="(image, index) in headerImages"
					:key="index"
					:class="{ 'tw-hidden md:tw-block': index === 2 }"
				>
					<img
						:src="image.src"
						alt=""
						class="header-image tw-block tw-w-full"
						:style="{ objectPosition: image.focus }"
					>
				</li>
			</ul>
			<img
				:src="slide1Bottom"
				alt=""
				class="tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-pointer-events-none"
			>
		</div>

		<div class="tw-px-2 tw-pt-3 tw-mx-auto tw-max-w-3xl tw-text-center">
			<p
				class="tw-inline-block tw-rounded-full tw-bg-brand-650 tw-text-white
					tw-text-label tw-py-0.5 tw-px-1.5 tw-mb-2"
				data-testid="goal-in-review-slide-1-pill"
			>
				{{ pillText }}
			</p>

			<h1 class="tw-text-display tw-text-eco-green-4 tw-mb-2">
				<template v-if="isComplete">
					<template v-if="firstName">
						You did it, <span class="tw-text-marigold">{{ firstName }}</span>
					</template>
					<template v-else>
						You did it!
					</template>
				</template>
				<template v-else>
					Your goal moved <span class="tw-text-marigold">lives forward</span>
				</template>
			</h1>

			<p class="tw-text-subhead tw-text-primary tw-mx-auto tw-mb-4 tw-max-w-lg">
				Because of your commitment, borrowers could count on Kiva to be there when it mattered.
			</p>
		</div>

		<div class="stats-hill">
			<div class="tw-px-2 md:tw-px-4.5 tw-mx-auto tw-text-center">
				<ul
					class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-2 tw-list-none tw-p-0 tw-m-0"
					data-testid="goal-in-review-slide-1-stats"
				>
					<li
						v-for="stat in stats"
						:key="stat.key"
						class="stat-card tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center
							tw-bg-white tw-rounded tw-border tw-border-gray-100 tw-py-2 tw-px-1.5"
						:data-testid="`goal-in-review-slide-1-stat-${stat.key}`"
					>
						<span class="tw-font-medium tw-text-primary">{{ stat.value }}</span>
						<span v-if="stat.label" class="tw-text-small tw-text-primary">{{ stat.label }}</span>
					</li>
				</ul>

				<div class="tw-mt-4 tw-text-action">
					<p class="tw-text-base tw-mb-1.5">
						Scroll to explore the stories behind your goal
					</p>
					<ScrollArrow class="scroll-arrow tw-block tw-mx-auto" aria-hidden="true" />
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { computed } from 'vue';
import numeral from 'numeral';
import ScrollArrow from '#src/assets/images/my-kiva/goal-in-review/scroll-arrow.svg';
import slide1Image1 from '#src/assets/images/my-kiva/goal-in-review/slide1-1.png';
import slide1Image2 from '#src/assets/images/my-kiva/goal-in-review/slide1-2.png';
import slide1Image3 from '#src/assets/images/my-kiva/goal-in-review/slide1-3.png';
import slide1Image4 from '#src/assets/images/my-kiva/goal-in-review/slide1-4.png';
import slide1Bottom from '#src/assets/images/my-kiva/goal-in-review/slide1-bottom.png';

const headerImages = [
	{ src: slide1Image1, focus: '85% 25%' },
	{ src: slide1Image2, focus: '60% 20%' },
	{ src: slide1Image3, focus: '50% 25%' },
	{ src: slide1Image4, focus: '10% 25%' },
];

const props = defineProps({
	goalStatus: {
		type: String,
		default: '',
	},
	firstName: {
		type: String,
		default: '',
	},
	year: {
		type: [Number, String],
		default: null,
	},
	amountLent: {
		type: [Number, String],
		default: null,
	},
	borrowerCount: {
		type: [Number, String],
		default: null,
	},
	category: {
		type: String,
		default: '',
	},
	percentComplete: {
		type: [Number, String],
		default: null,
	},
});

const MISSING = '—';

const isComplete = computed(() => props.goalStatus === 'completed');

const pillText = computed(() => (props.year
	? `Your ${props.year} impact goal recap`
	: 'Your impact goal recap'));

const amountLentDisplay = computed(() => (props.amountLent ? numeral(props.amountLent).format('$0,0') : MISSING));

const borrowerCountDisplay = computed(() => (props.borrowerCount
	? numeral(props.borrowerCount).format('0,0')
	: MISSING));

const categoryDisplay = computed(() => props.category || MISSING);

const percentCompleteDisplay = computed(() => (props.percentComplete
	? `${Math.round(Number(props.percentComplete))}%`
	: MISSING));

const borrowersLabel = computed(() => (Number(props.borrowerCount) === 1 ? 'Borrower' : 'Borrowers'));

const stats = computed(() => [
	{ key: 'total-lent', value: amountLentDisplay.value, label: 'Total lent' },
	{ key: 'borrowers', value: borrowerCountDisplay.value, label: borrowersLabel.value },
	{ key: 'category', value: categoryDisplay.value, label: null },
	{ key: 'complete', value: percentCompleteDisplay.value, label: 'Complete' },
]);
</script>

<style lang="postcss" scoped>
.header-image {
	height: 200px;

	@apply tw-object-cover md:tw-h-auto md:tw-object-fill;
}

.stat-card {
	min-height: 92px;
}

/* Hill background sits behind the stats, with the flagged hilltop peeking above them */
.stats-hill {
	padding-top: 80px;
	padding-bottom: 16px;
	background-image: url('/src/assets/images/my-kiva/goal-in-review/slide1-mobile-hill.png');
	background-repeat: no-repeat;
	background-position: top center;
	background-size: 100% 421px;
}

@screen md {
	.stats-hill {
		padding-top: 75px;
		background-image: url('/src/assets/images/my-kiva/goal-in-review/slide1-desktop-hill.png');
	}
}

.scroll-arrow {
	animation: scroll-arrow-hint 1.5s ease-in-out infinite;
}

@keyframes scroll-arrow-hint {
	0% {
		opacity: 0;
		transform: translateY(-4px);
	}

	50% {
		opacity: 1;
	}

	100% {
		opacity: 0;
		transform: translateY(6px);
	}
}

@media (prefers-reduced-motion: reduce) {
	.scroll-arrow {
		animation: none;
	}
}
</style>
