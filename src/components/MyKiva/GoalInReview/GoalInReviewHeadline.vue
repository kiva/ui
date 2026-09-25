<template>
	<section
		ref="sectionRef"
		class="tw-w-full tw-pb-2 md:tw-pb-0 tw-relative tw-isolate
			tw-bg-gray-50 tw-bg-no-repeat tw-bg-bottom goal-in-review-headline
			tw-flex tw-flex-col tw-gap-3 md:tw-gap-4"
		:class="{ 'goal-in-review-headline--in-progress': !isComplete }"
		data-testid="goal-in-review-headline"
	>
		<!-- Overlays sit behind content via tw-z-hide; section's tw-isolate contains that z-index. -->
		<!-- Positions are computed client-side in onMounted, so this is empty (and renders
			nothing) during SSR; filling it there would desync from the client and hydrate wrong. -->
		<div class="headline-stars tw-absolute tw-inset-0 tw-pointer-events-none tw-z-hide" aria-hidden="true">
			<StarIcon
				v-for="(position, index) in starPositions"
				:key="index"
				v-memo="[position.top, position.left, position.size, position.delay]"
				class="headline-star tw-absolute -tw-translate-x-1/2 -tw-translate-y-1/2 motion-reduce:tw-animate-none"
				:style="{
					top: position.top,
					left: position.left,
					width: position.size,
					height: position.size,
					animationDelay: position.delay,
				}"
				@animationiteration="respawn('star', index)"
			/>
		</div>

		<div class="headline-dots tw-absolute tw-inset-0 tw-pointer-events-none tw-z-hide" aria-hidden="true">
			<DotIcon
				v-for="(position, index) in dotPositions"
				:key="index"
				v-memo="[position.top, position.left, position.size, position.delay]"
				class="headline-dot tw-absolute -tw-translate-x-1/2 -tw-translate-y-1/2 motion-reduce:tw-animate-none"
				:style="{
					top: position.top,
					left: position.left,
					width: position.size,
					height: position.size,
					animationDelay: position.delay,
				}"
				@animationiteration="respawn('dot', index)"
			/>
		</div>

		<div class="tw-px-2 tw-pt-7.5 md:tw-pt-15 tw-mx-auto tw-max-w-3xl tw-text-center">
			<p
				ref="pillRef"
				class="tw-inline-block tw-rounded-full tw-bg-brand-650 md:tw-bg-brand tw-text-white
					md:tw-text-primary-inverse tw-text-label tw-py-0.5 tw-px-2 tw-mb-2
					kv-fade-up headline-eyebrow"
				data-testid="goal-in-review-headline-pill"
			>
				{{ pillText }}
			</p>

			<h1
				ref="titleRef"
				class="tw-text-display tw-text-eco-green-4 tw-mb-2 kv-fade-up headline-title"
			>
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

			<h3
				ref="subtextRef"
				class="tw-mx-auto tw-max-w-lg tw-text-base md:tw-text-subheadline kv-fade-up headline-subtext"
			>
				Because of your commitment, borrowers could count on Kiva to be there when it mattered.
			</h3>
		</div>

		<div class="tw-relative">
			<!-- Mountain art layer, painted here (rather than as the section background) so
				it can extend past the section's own bottom edge behind the next slide's
				header, with no seam between the two. It is anchored to this block's bottom on mobile and
				its top on desktop, so the flag stays beside the scroll prompt as the content above changes. -->
			<div
				class="headline-hill tw-absolute tw-pointer-events-none tw-z-hide tw-left-0 tw-w-full
					tw-top-full -tw-mt-7.5 md:tw-top-13.5 md:tw-mt-0"
				aria-hidden="true"
			>
				<div
					class="headline-hill-mountain tw-w-full tw-bg-gray-50 tw-bg-no-repeat tw-bg-top tw-bg-contain"
				></div>
				<!-- Mint that continues the hill behind the next slide's see-through top; the small
					negative margin covers the art's anti-aliased bottom edge so no hairline shows. -->
				<div class="tw-w-full tw-h-40 -tw-mt-0.5 tw-bg-brand-100"></div>

				<div
					class="headline-rays tw-absolute tw-pointer-events-none tw-top-0 tw-left-0 tw-w-full"
					aria-hidden="true"
				>
					<FlagRayIcon
						class="headline-ray headline-ray--1 tw-w-0.5 tw-h-auto
							tw-absolute motion-reduce:tw-animate-none"
					/>
					<FlagRayIcon
						class="headline-ray headline-ray--2 tw-w-0.5 tw-h-auto
							tw-absolute motion-reduce:tw-animate-none"
					/>
					<FlagRayIcon
						class="headline-ray headline-ray--3 tw-w-0.5 tw-h-auto
							tw-absolute motion-reduce:tw-animate-none"
					/>
					<FlagRayIcon
						class="headline-ray headline-ray--4 tw-w-0.5 tw-h-auto
							tw-absolute motion-reduce:tw-animate-none"
					/>
					<FlagRayIcon
						class="headline-ray headline-ray--5 tw-w-0.5 tw-h-auto
							tw-absolute motion-reduce:tw-animate-none"
					/>
					<FlagRayIcon
						class="headline-ray headline-ray--6 tw-w-0.5 tw-h-auto
							tw-absolute motion-reduce:tw-animate-none"
					/>
				</div>
			</div>

			<div class="tw-px-2 md:tw-px-4 lg:tw-px-8 tw-mx-auto tw-text-center md:tw-mt-0">
				<ul
					ref="statsRef"
					class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-0.5 md:tw-gap-1
						tw-list-none tw-p-0 tw-m-0"
					data-testid="goal-in-review-headline-stats"
				>
					<li
						v-for="stat in stats"
						:key="stat.key"
						class="tw-flex tw-flex-col-reverse
							md:tw-flex-col tw-items-center tw-justify-center tw-text-center tw-bg-white
							tw-rounded tw-border tw-border-gray-100 tw-py-2 tw-px-1 md:tw-p-2 tw-min-h-11
							kv-rebound-in headline-stat"
						:data-testid="`goal-in-review-headline-stat-${stat.key}`"
					>
						<span
							v-if="stat.label"
							class="tw-text-caption tw-text-secondary md:tw-pb-1"
						>
							<template v-if="stat.mobileLabel">
								<!-- Renders both labels always; the breakpoint-only display classes pick one,
									since the viewport isn't knowable during SSR to choose server-side. -->
								<span class="md:tw-hidden">{{ stat.mobileLabel }}</span>
								<span class="tw-hidden md:tw-inline">{{ stat.label }}</span>
							</template>
							<template v-else>{{ stat.label }}</template>
						</span>
						<span class="tw-text-button-link md:tw-text-title tw-text-primary">{{ stat.value }}</span>
					</li>
				</ul>

				<div class="tw-mt-4 md:tw-mt-7.5 md:tw-mb-2 tw-text-action">
					<p
						class="tw-text-label md:tw-text-button-link tw-mb-1 md:tw-mb-2
							kv-rebound-in headline-scroll-cue"
					>
						See what your goal says about you!
					</p>
					<button
						type="button"
						class="scroll-arrow tw-w-5 tw-h-5 tw-rounded-full tw-bg-white tw-shadow
							tw-flex tw-items-center tw-justify-center tw-mx-auto"
						aria-label="Scroll to the next section"
						@click="emit('scroll-next')"
					>
						<KvMaterialIcon :icon="mdiArrowDown" class="tw-text-action tw-w-3 tw-h-3" />
					</button>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import numeral from 'numeral';
import { KvMaterialIcon } from '@kiva/kv-components';
import { mdiArrowDown } from '@mdi/js';
import StarIcon from '#src/assets/images/my-kiva/goal-in-review/star.svg';
import DotIcon from '#src/assets/images/my-kiva/goal-in-review/dot.svg';
import FlagRayIcon from '#src/assets/images/my-kiva/goal-in-review/flag-ray.svg';
import { capitalize } from '#src/util/stringParserUtils';
import { showConfetti } from '#src/util/animation/confettiUtils';
import {
	randomDecorationPositions, getExclusionRects, respawnDecoration,
} from '#src/util/animation/decorationUtils';
import useBreakpoints from '#src/composables/useBreakpoints';

// Stars and dots appear anywhere in the upper half of the slide, avoiding the text
// (via exclusions computed from the live layout) and the close button corner.
// The 2%/98% inset keeps the translated items from being clipped at the edges.
const DECORATION_ZONES = [
	{ left: [2, 98], top: [4, 50] },
];

const DECORATION_COUNTS = {
	mobile: { stars: 3, dots: 4 },
	desktop: { stars: 5, dots: 8 },
};

const DECORATION_MIN_GAP = 6;

// Padding kept clear around each exclusion (the pill/title/subtext block and the stat
// card grid), and the size of the close button's corner, both in whole pixels before
// being converted to percent of the slide.
const EXCLUSION_PADDING_PX = 12;
const CLOSE_BUTTON_SIZE_PX = 72;

// Whole-pixel size bounds. Each star and dot gets its own random size within them, so
// the twinkles vary.
const STAR_SIZE_RANGE = [4, 16];
const DOT_SIZE_RANGE = [3, 6];

const emit = defineEmits(['scroll-next']);

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

// Called before this component's onMounted so that useBreakpoints' onMounted, which sets
// isMedium from window.innerWidth, runs first.
const { isMedium } = useBreakpoints();

const MISSING = '—';

// Left empty until onMounted measures and fills them; safe to appear later since these
// render as absolute, pointer-events-none overlays that don't shift surrounding layout.
const starPositions = ref([]);
const dotPositions = ref([]);

// Elements measured to keep decorations off the text and the stat cards.
const sectionRef = ref(null);
const pillRef = ref(null);
const titleRef = ref(null);
const subtextRef = ref(null);
const statsRef = ref(null);

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
const borrowersMobileLabel = computed(() => (Number(props.borrowerCount) === 1 ? 'Borrower' : 'Borrowers'));

const stats = computed(() => [
	{
		key: 'total-lent', value: amountLentDisplay.value, label: 'Total lent',
	},
	{
		key: 'borrowers',
		value: borrowerCountDisplay.value,
		label: borrowersLabel.value,
		mobileLabel: borrowersMobileLabel.value,
	},
	{
		key: 'category', value: categoryDisplay.value, label: 'Category', mobileLabel: 'Your cause',
	},
	{
		key: 'complete', value: percentCompleteDisplay.value, label: 'Progress', mobileLabel: 'Complete',
	},
]);

// Placement options shared by every star and dot. Exclusions (the pill/title/subtext
// block, the stat card grid, and the close button corner) are measured on every call so
// they stay correct after a resize.
const getPlacement = () => ({
	zones: DECORATION_ZONES,
	minGap: DECORATION_MIN_GAP,
	exclusions: getExclusionRects({
		container: sectionRef.value,
		elements: [pillRef, titleRef, subtextRef, statsRef].map(elRef => elRef.value),
		padding: EXCLUSION_PADDING_PX,
		cornerSize: CLOSE_BUTTON_SIZE_PX,
	}),
});

// Moves one star or dot each time its animation loops. It keeps its delay and stays
// clear of every other star and dot on screen.
const respawn = (kind, index) => {
	const isStar = kind === 'star';
	const positions = isStar ? starPositions.value : dotPositions.value;
	positions[index] = respawnDecoration({
		...getPlacement(),
		groups: [starPositions.value, dotPositions.value],
		groupIndex: isStar ? 0 : 1,
		index,
		sizeRange: isStar ? STAR_SIZE_RANGE : DOT_SIZE_RANGE,
	});
};

onMounted(() => {
	showConfetti();

	// Picked once as the slide opens; the modal re-mounts this component fresh on every
	// open, so a live resize listener isn't needed to keep the count current.
	const { stars: starCount, dots: dotCount } = isMedium.value
		? DECORATION_COUNTS.desktop
		: DECORATION_COUNTS.mobile;

	const placement = getPlacement();
	starPositions.value = randomDecorationPositions({ ...placement, count: starCount, sizeRange: STAR_SIZE_RANGE });
	dotPositions.value = randomDecorationPositions({ ...placement, count: dotCount, sizeRange: DOT_SIZE_RANGE });
});
</script>

<style lang="postcss" scoped>
/* Title stack entrance. It shares the global .kv-fade-up effect; this slide sets
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
	animation: headline-twinkle 3s ease-in-out infinite;
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

/* Starts invisible, the reverse of headline-dissolve, so the animationiteration handler
   can move the star or dot to a new spot while nothing is on screen to show the jump. */
@keyframes headline-twinkle {
	0%,
	100% {
		opacity: 0;
	}

	50% {
		opacity: 1;
	}
}

.headline-dot {
	animation: headline-twinkle 4s ease-in-out infinite;
}

.headline-hill-mountain,
.headline-rays {
	aspect-ratio: 394 / 173;
}

.headline-hill-mountain {
	background-image: url('/src/assets/images/my-kiva/goal-in-review/headline-mobile-mountain-bg-and-flag.svg');
}

@screen md {
	.headline-hill-mountain,
	.headline-rays {
		aspect-ratio: 1019 / 212;
	}

	.headline-hill-mountain {
		background-image: url('/src/assets/images/my-kiva/goal-in-review/headline-desktop-mountain-bg-and-flag.svg');
	}
}

.headline-ray {
	transform: translate(-50%, -50%);
	animation: headline-dissolve 2.2s ease-in-out infinite;
}

.headline-ray--1 {
	top: 11.8%;
	left: 3.8%;

	@screen md {
		top: -2.4%;
		left: 3.7%;
	}
}

.headline-ray--2 {
	top: 11.8%;
	left: 5.4%;
	transform: translate(-50%, -50%) rotate(32.03deg);
	animation-delay: 0.22s;

	@screen md {
		top: -2.4%;
		left: 4.5%;
	}
}

.headline-ray--3 {
	top: 14.4%;
	left: 10.6%;
	transform: translate(-50%, -50%) rotate(72.25deg);
	animation-delay: 0.44s;

	@screen md {
		top: 0.4%;
		left: 7.2%;
	}
}

.headline-ray--4 {
	top: 17.1%;
	left: 10.9%;
	transform: translate(-50%, -50%) rotate(130.06deg);
	animation-delay: 0.66s;

	@screen md {
		top: 3.6%;
		left: 7.4%;
	}
}

.headline-ray--5 {
	top: 13.8%;
	left: 9.7%;
	transform: translate(-50%, -50%) rotate(35.98deg);
	animation-delay: 0.88s;

	@screen md {
		top: 0;
		left: 6.7%;
	}
}

.headline-ray--6 {
	top: 15.5%;
	left: 3.3%;
	transform: translate(-50%, -50%) rotate(-49.34deg);
	animation-delay: 1.1s;

	@screen md {
		top: 1.8%;
		left: 3.5%;
	}
}
</style>
