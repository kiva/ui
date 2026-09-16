<template>
	<section
		class="tw-w-full tw-pb-2 md:tw-pb-0 tw-relative tw-isolate
			tw-bg-gray-50 tw-bg-no-repeat tw-bg-bottom goal-in-review-headline
			tw-flex tw-flex-col md:tw-justify-between tw-gap-4 md:tw-gap-0"
		:class="{ 'goal-in-review-headline--in-progress': !isComplete }"
		data-testid="goal-in-review-headline"
	>
		<!-- Overlays sit behind content via tw-z-hide; section's tw-isolate contains that z-index. -->
		<div class="headline-stars tw-absolute tw-inset-0 tw-pointer-events-none tw-z-hide" aria-hidden="true">
			<StarIcon class="headline-star headline-star--1 tw-w-1.5 tw-h-1.5" />
			<StarIcon class="headline-star headline-star--2 tw-w-0.5 tw-h-0.5" />
			<StarIcon class="headline-star headline-star--3 tw-w-1 tw-h-1" />
			<StarIcon class="headline-star headline-star--4 tw-w-2 tw-h-2" />
			<StarIcon class="headline-star headline-star--5 tw-w-1 tw-h-1" />
		</div>

		<div class="headline-dots tw-absolute tw-inset-0 tw-pointer-events-none tw-z-hide" aria-hidden="true">
			<DotIcon class="headline-dot headline-dot--1 tw-w-0.5 tw-h-0.5" />
			<DotIcon class="headline-dot headline-dot--2 tw-w-0.5 tw-h-0.5" />
			<DotIcon class="headline-dot headline-dot--3 tw-w-0.5 tw-h-0.5" />
			<DotIcon class="headline-dot headline-dot--4 tw-w-0.5 tw-h-0.5" />
			<DotIcon class="headline-dot headline-dot--5 tw-w-0.5 tw-h-0.5" />
			<DotIcon class="headline-dot headline-dot--6 tw-w-0.5 tw-h-0.5" />
			<DotIcon class="headline-dot headline-dot--7 tw-w-0.5 tw-h-0.5" />
			<DotIcon class="headline-dot headline-dot--8 tw-w-0.5 tw-h-0.5" />
		</div>

		<div class="headline-rays tw-absolute tw-pointer-events-none tw-z-hide" aria-hidden="true">
			<FlagRayIcon class="headline-ray headline-ray--1 tw-w-0.5 tw-h-auto" />
			<FlagRayIcon class="headline-ray headline-ray--2 tw-w-0.5 tw-h-auto" />
			<FlagRayIcon class="headline-ray headline-ray--3 tw-w-0.5 tw-h-auto" />
			<FlagRayIcon class="headline-ray headline-ray--4 tw-w-0.5 tw-h-auto" />
			<FlagRayIcon class="headline-ray headline-ray--5 tw-w-0.5 tw-h-auto" />
			<FlagRayIcon class="headline-ray headline-ray--6 tw-w-0.5 tw-h-auto" />
		</div>

		<div class="tw-relative" data-testid="goal-in-review-headline-header">
			<ul class="tw-grid tw-grid-cols-3 md:tw-grid-cols-4 tw-list-none tw-p-0 tw-m-0">
				<li
					v-for="(image, index) in headerImages"
					:key="index"
					:class="{ 'tw-hidden md:tw-block': index === 2 }"
				>
					<img
						:src="image.src"
						:alt="image.alt"
						class="header-image tw-block tw-w-full"
						:style="{ objectPosition: image.focus }"
					>
				</li>
			</ul>
			<img
				:src="headlineBottom"
				alt=""
				class="tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-pointer-events-none"
			>
		</div>

		<div class="tw-px-2 tw-mx-auto tw-max-w-3xl tw-text-center">
			<p
				class="tw-inline-block tw-rounded-full tw-bg-brand-650 tw-text-white
					tw-text-label tw-py-0.5 tw-px-1.5 tw-mb-2 kv-fade-up headline-eyebrow"
				data-testid="goal-in-review-headline-pill"
			>
				{{ pillText }}
			</p>

			<h1 class="tw-text-display tw-text-eco-green-4 tw-mb-2 kv-fade-up headline-title">
				<template v-if="isComplete">
					<template v-if="firstName">
						You did it, <span class="tw-text-marigold data-hj-suppress">{{ firstName }}</span>
					</template>
					<template v-else>
						You did it!
					</template>
				</template>
				<template v-else>
					Your goal moved <br> <span class="tw-text-marigold">lives forward</span>
				</template>
			</h1>

			<h3 class="tw-mx-auto tw-max-w-lg kv-fade-up headline-subtext">
				Because of your commitment, borrowers could count on Kiva to be there when it mattered.
			</h3>
		</div>

		<div>
			<div class="tw-px-2 md:tw-px-4 lg:tw-px-8 tw-mx-auto tw-text-center">
				<ul
					class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-2 tw-list-none tw-p-0 tw-m-0"
					data-testid="goal-in-review-headline-stats"
				>
					<li
						v-for="stat in stats"
						:key="stat.key"
						class="tw-min-h-11.5 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center
							tw-bg-white tw-rounded tw-border tw-border-gray-100 tw-py-2 tw-px-1.5
							kv-rebound-in headline-stat"
						:data-testid="`goal-in-review-headline-stat-${stat.key}`"
					>
						<span
							v-if="stat.label"
							class="tw-text-caption tw-text-secondary tw-pb-0.5 md:tw-pb-1"
						>{{ stat.label }}</span>
						<span class="tw-text-button-link tw-text-primary">{{ stat.value }}</span>
					</li>
				</ul>

				<div class="tw-mt-4 md:tw-mt-2 lg:!tw-mt-7 lg:!tw-mb-2 tw-text-action">
					<p class="tw-text-base tw-mb-1.5 kv-rebound-in headline-scroll-cue">
						Scroll to explore the stories behind your goal
					</p>
					<KvMaterialIcon :icon="mdiArrowDown" class="scroll-arrow tw-block tw-mx-auto" />
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import numeral from 'numeral';
import { KvMaterialIcon } from '@kiva/kv-components';
import { mdiArrowDown } from '@mdi/js';
import headlineImage1 from '#src/assets/images/my-kiva/goal-in-review/headline-1.png';
import headlineImage2 from '#src/assets/images/my-kiva/goal-in-review/headline-2.png';
import headlineImage3 from '#src/assets/images/my-kiva/goal-in-review/headline-3.png';
import headlineImage4 from '#src/assets/images/my-kiva/goal-in-review/headline-4.png';
import headlineBottom from '#src/assets/images/my-kiva/goal-in-review/headline-bottom.png';
import StarIcon from '#src/assets/images/my-kiva/goal-in-review/star.svg';
import DotIcon from '#src/assets/images/my-kiva/goal-in-review/dot.svg';
import FlagRayIcon from '#src/assets/images/my-kiva/goal-in-review/flag-ray.svg';
import { capitalize } from '#src/util/stringParserUtils';
import { showConfetti } from '#src/util/animation/confettiUtils';

const headerImages = [
	{ src: headlineImage1, focus: '85% 25%', alt: 'A woman smiling while doing an activity' },
	{ src: headlineImage2, focus: '60% 20%', alt: 'A man smiling at the camera' },
	{ src: headlineImage3, focus: '50% 25%', alt: 'A woman smiling and looking to the left' },
	{ src: headlineImage4, focus: '10% 25%', alt: 'A woman smiling at the camera' },
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

const categoryDisplay = computed(() => (props.category
	? capitalize(props.category)
	: MISSING));

const percentCompleteDisplay = computed(() => (props.percentComplete
	? `${Math.round(Number(props.percentComplete))}%`
	: MISSING));

const borrowersLabel = computed(() => (Number(props.borrowerCount) === 1 ? 'Borrower helped' : 'Borrowers helped'));

const stats = computed(() => [
	{ key: 'total-lent', value: amountLentDisplay.value, label: 'Total lent' },
	{ key: 'borrowers', value: borrowerCountDisplay.value, label: borrowersLabel.value },
	{ key: 'category', value: categoryDisplay.value, label: 'Category' },
	{ key: 'complete', value: percentCompleteDisplay.value, label: 'Progress' },
]);

onMounted(() => {
	showConfetti();
});
</script>

<style lang="postcss" scoped>
.header-image {
	height: 200px;

	@apply tw-object-cover md:tw-h-auto md:tw-object-fill;
}

.goal-in-review-headline {
	background-image: url('/src/assets/images/my-kiva/goal-in-review/headline-mobile-mountain-bg-and-flag.svg');
	background-size: 100%;
	background-position: bottom left;
}

@screen md {
	.goal-in-review-headline {
		background-image: url('/src/assets/images/my-kiva/goal-in-review/headline-desktop-mountain-bg-and-flag.svg');
	}
}

/* Title stack entrance — shares the global .kv-fade-up effect; this slide sets
   each line's travel distance (--kv-fade-up-distance, the value baked inside the
   keyframe) and its delay, so eyebrow -> headline -> subtitle rise in sequence. */
.headline-eyebrow {
	--kv-fade-up-distance: 16px;

	animation-delay: 0.3s;
}

.headline-title {
	--kv-fade-up-distance: 30px;

	animation-delay: 0.55s;
}

.headline-subtext {
	--kv-fade-up-distance: 20px;

	animation-delay: 0.9s;
}

/* Stat cards use the shared rebound (.kv-rebound-in, see css/animations.css);
   this slide only owns the per-item stagger so the four cards cascade "1...N"
   once the title stack has settled. */
.headline-stat:nth-child(1) {
	animation-delay: 1.1s;
}

.headline-stat:nth-child(2) {
	animation-delay: 1.2s;
}

.headline-stat:nth-child(3) {
	animation-delay: 1.3s;
}

.headline-stat:nth-child(4) {
	animation-delay: 1.4s;
}

.headline-scroll-cue {
	animation-delay: 1.4s;
}

/* Down arrow: fades and rises in with the scroll cue. */
.scroll-arrow {
	--kv-fade-up-distance: 8px;

	animation:
		kv-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.5s both,
		scroll-arrow-bounce 1.8s ease-in-out 2.1s infinite;

	@apply motion-reduce:tw-animate-none;
}

@keyframes scroll-arrow-bounce {
	0% {
		opacity: 1;
		transform: translateY(0);
	}

	50% {
		opacity: 0.6;
		transform: translateY(8px);
	}

	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

.headline-star {
	position: absolute;
	transform: translate(-50%, -50%);
	animation: headline-dissolve 3s ease-in-out infinite;
}

.headline-star--1 {
	top: 52.7%;
	left: 74.5%;
}

.headline-star--2 {
	top: 51.5%;
	left: 72.8%;
	animation-delay: 0.6s;
}

.headline-star--3 {
	top: 43%;
	left: 76.5%;
	animation-delay: 1.2s;
}

.headline-star--4 {
	top: 30.5%;
    left: 16.1%;
	animation-delay: 1.8s;

	@screen md {
		top: 43.5%;
		left: 24.1%;
	}
}

.headline-star--5 {
	top: 36.5%;
    left: 13.7%;
	animation-delay: 2.4s;

	@screen md {
		top: 46.5%;
		left: 22.7%;
	}
}

@keyframes headline-dissolve {
	0%,
	100% {
		opacity: 1;
	}

	50% {
		opacity: 0;
	}
}

.headline-dot {
	position: absolute;
	transform: translate(-50%, -50%);
	animation: headline-dissolve 4s ease-in-out infinite;
}

.headline-dot--1 {
	top: 71%;
	left: 74.6%;

	@screen md {
		top: 72.6%;
	}
}

.headline-dot--2 {
	top: 36.3%;
    left: 69.7%;
	animation-delay: 0.5s;

	@screen md {
		top: 41.3%;
	}
}

.headline-dot--3 {
	top: 55.8%;
    left: 32.5%;
	animation-delay: 1s;

	@screen md {
		top: 68%;
		left: 28.5%;
	}
}

.headline-dot--4 {
	top: 52.7%;
	left: 18.3%;
	animation-delay: 1.5s;
}

.headline-dot--5 {
	top: 44.2%;
	left: 26.7%;
	animation-delay: 2s;

	@screen md {
		top: 46.2%;
	}
}

.headline-dot--6 {
	top: 53.8%;
	left: 79.9%;
	animation-delay: 2.5s;
}

.headline-dot--7 {
	top: 31.7%;
	left: 36.6%;
	animation-delay: 3s;

	@screen md {
		top: 40.7%;
	}
}

.headline-dot--8 {
	top: 57.8%;
	left: 47.2%;
	animation-delay: 3.5s;

	@screen md {
		top: 65.8%;
	}
}

.headline-rays {
	bottom: 0;
	left: 0;
	width: 100%;
	aspect-ratio: 394 / 352;
}

@screen md {
	.headline-rays {
		aspect-ratio: 1019 / 314;
	}
}

.headline-ray {
	position: absolute;
	transform: translate(-50%, -50%);
	animation: headline-dissolve 2.2s ease-in-out infinite;
}

.headline-ray--1 {
	top: 5.8%;
	left: 3.8%;

	@screen md {
		top: -1.6%;
		left: 7.4%;
	}
}

.headline-ray--2 {
	top: 5.8%;
	left: 5.4%;
	transform: translate(-50%, -50%) rotate(32.03deg);
	animation-delay: 0.22s;

	@screen md {
		top: -1.6%;
		left: 8.2%;
	}
}

.headline-ray--3 {
	top: 7.1%;
	left: 10.6%;
	transform: translate(-50%, -50%) rotate(72.25deg);
	animation-delay: 0.44s;

	@screen md {
		top: 0.3%;
		left: 10.9%;
	}
}

.headline-ray--4 {
	top: 8.4%;
	left: 10.9%;
	transform: translate(-50%, -50%) rotate(130.06deg);
	animation-delay: 0.66s;

	@screen md {
		top: 2.4%;
		left: 11.1%;
	}
}

.headline-ray--5 {
	top: 6.8%;
	left: 9.7%;
	transform: translate(-50%, -50%) rotate(35.98deg);
	animation-delay: 0.88s;

	@screen md {
		top: 0;
		left: 10.4%;
	}
}

.headline-ray--6 {
	top: 7.6%;
	left: 3.3%;
	transform: translate(-50%, -50%) rotate(-49.34deg);
	animation-delay: 1.1s;

	@screen md {
		top: 1.2%;
		left: 7.2%;
	}
}

@media (prefers-reduced-motion: reduce) {
	.headline-star,
	.headline-dot,
	.headline-ray {
		animation: none;
	}
}
</style>
