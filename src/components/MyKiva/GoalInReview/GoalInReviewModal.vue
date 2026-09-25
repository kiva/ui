<template>
	<KvLightbox
		class="goal-in-review-modal tw-p-14 max-md:tw-flex max-md:tw-items-end
			max-md:tw-overflow-y-hidden max-md:tw-p-0"
		:visible="show"
		title=""
		prevent-background-close
		:close-button-show-delay="3000"
		@lightbox-closed="handleClose"
	>
		<template #header>
			<h2 class="tw-sr-only">
				{{ data?.year }} goal in review
			</h2>
		</template>
		<div ref="slidesContainer" class="goal-in-review-slides tw-bg-secondary">
			<div data-slide-view="1">
				<GoalInReviewHeadline
					:goal-status="data?.goalSummary?.status"
					:first-name="data?.firstName"
					:year="data?.year"
					:amount-lent="data?.loanStats?.totalLent"
					:borrower-count="data?.loanStats?.borrowers"
					:category="data?.categoryName"
					:percent-complete="data?.loanStats?.percentComplete"
					@scroll-next="scrollToScreenTwo"
					@vue:mounted="revealSlidesInView"
				/>
			</div>
			<div data-slide-view="2" data-animate-on-view>
				<GoalInReviewBorrowers
					:loans="data?.goalLoans"
					:borrower-count="data?.loanStats?.borrowers"
					@vue:mounted="revealSlidesInView"
				/>
			</div>
			<!-- Slide 3 has two sections that each reveal independently. -->
			<div data-slide-view="3">
				<GoalInReviewGlobalReach
					:countries="data?.goalSummary?.countries"
					:sectors="data?.goalSummary?.sectors"
					@vue:mounted="revealSlidesInView"
				/>
			</div>
			<div data-slide-view="4" data-animate-on-view>
				<GoalInReviewGivingInsights
					:goal-summary="data?.goalSummary"
					:lifetime-percentile="data?.lifetimePercentile"
					:year="data?.year"
					:current-year="currentYear"
					@vue:mounted="revealSlidesInView"
				/>
			</div>
			<div data-slide-view="5" data-animate-on-view>
				<GoalInReviewCollectiveImpact @vue:mounted="revealSlidesInView" />
			</div>
			<div
				v-if="data?.goalSummary?.status === 'completed'"
				data-slide-view="6"
				data-animate-on-view
			>
				<GoalInReviewPersonalNote :year="data?.year" @vue:mounted="revealSlidesInView" />
			</div>
			<div data-slide-view="7" data-animate-on-view>
				<GoalInReviewThanksAndFeedback
					:goal-status="data?.goalSummary?.status"
					:loan-count="data?.loanStats?.borrowers"
					:year="data?.year"
					:current-year="currentYear"
					:feedback-submitted="feedbackSubmitted"
					@goal-recap-back-to-kiva="handleCta('goal-recap-back-to-kiva')"
					@finish-goal="handleCta('finish-goal')"
					@set-goal="handleCta('set-goal')"
					@feedback-submitted="handleFeedbackSubmitted"
					@vue:mounted="revealSlidesInView"
				/>
			</div>
		</div>
		<!-- Fades the tops of the screen-2 photos peeking below screen 1, to invite a
			scroll. Visible only while the scroll area is at the top. -->
		<div
			class="goal-in-review-scroll-fade tw-sticky tw-bottom-0 tw-h-5.5 -tw-mt-5.5 tw-z-1 tw-bg-brand-100
				tw-pointer-events-none tw-transition-opacity tw-duration-300 motion-reduce:tw-transition-none"
			:class="{ 'tw-opacity-0': !isAtTop }"
			aria-hidden="true"
			data-testid="goal-in-review-scroll-fade"
		></div>
	</KvLightbox>
</template>

<script setup>
import {
	defineAsyncComponent,
	inject,
	nextTick,
	onBeforeUnmount,
	ref,
	watch,
} from 'vue';
import { KvLightbox } from '@kiva/kv-components';
import { getGoalInReviewCurrentYear } from '#src/composables/useGoalInReview';
import {
	createIntersectionObserver, isInRevealArea, previousSiblingsLaidOut, reobserveNextFrame,
} from '#src/util/observerUtils';
import { prefersReducedMotion } from '#src/util/animation/motionUtils';
import '#src/assets/css/animations.css';

const GoalInReviewHeadline = defineAsyncComponent(
	() => import('#src/components/MyKiva/GoalInReview/GoalInReviewHeadline')
);
const GoalInReviewBorrowers = defineAsyncComponent(
	() => import('#src/components/MyKiva/GoalInReview/GoalInReviewBorrowers')
);
const GoalInReviewGlobalReach = defineAsyncComponent(
	() => import('#src/components/MyKiva/GoalInReview/GoalInReviewGlobalReach')
);
const GoalInReviewGivingInsights = defineAsyncComponent(
	() => import('#src/components/MyKiva/GoalInReview/GoalInReviewGivingInsights')
);
const GoalInReviewCollectiveImpact = defineAsyncComponent(
	() => import('#src/components/MyKiva/GoalInReview/GoalInReviewCollectiveImpact')
);
const GoalInReviewPersonalNote = defineAsyncComponent(
	() => import('#src/components/MyKiva/GoalInReview/GoalInReviewPersonalNote')
);
const GoalInReviewThanksAndFeedback = defineAsyncComponent(
	() => import('#src/components/MyKiva/GoalInReview/GoalInReviewThanksAndFeedback')
);

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
	data: {
		type: Object,
		default: null,
	},
	feedbackSubmitted: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['close', 'goal-recap-back-to-kiva', 'finish-goal', 'set-goal', 'feedback-submitted']);
const $kvTrackEvent = inject('$kvTrackEvent', () => {});

// Single source of truth for "now". Add ?recapDate=YYYY-MM-DD to the url for QA specific dates
const currentYear = getGoalInReviewCurrentYear();

// KvLightbox emits `lightbox-closed` again when it unmounts (the parent v-if
// tears it down while `visible` is still true), so a single close would track
// twice. Guard to once per open; reset when the modal reopens (see show watcher).
let closeTracked = false;

const handleClose = () => {
	if (!closeTracked) {
		closeTracked = true;
		$kvTrackEvent('portfolio', 'click', 'goal-in-review-close');
	}
	emit('close');
};

const handleCta = event => {
	// A CTA reports its own event, so claim the guard: the teardown adds no close event.
	closeTracked = true;
	if (event === 'set-goal') {
		// Reuse the existing set-a-goal event, tagged with where it came from.
		$kvTrackEvent('portfolio', 'click', 'set-a-goal', 'from-goal-recap');
	} else if (event === 'finish-goal') {
		$kvTrackEvent('portfolio', 'click', `goal-recap-finish-my-${props.data?.year}-goal`);
	} else {
		$kvTrackEvent('portfolio', 'click', 'goal-recap-back-to-kiva');
	}
	emit(event);
};

const handleFeedbackSubmitted = () => {
	$kvTrackEvent('portfolio', 'submit', 'goal-recap-submit-feedback');
	emit('feedback-submitted');
};

// Per-section view tracking. The recap is one continuous scroll, so we observe a
// wrapper div around each slide (they exist immediately, unlike the async slide
// components) and fire a view event the first time each scrolls past the midpoint.
// The measurement plan calls each recap section a "screen", so the property is
// emitted as `screen-${n}` even though the components are named Slide 1..7. Screen 1
// counts on open; screens 2..7 only start counting once the recap has been scrolled,
// so peeking at the next screen's photos below screen 1 is never mistaken for a view.
const slidesContainer = ref(null);
const viewedSlides = new Set();
let slideObserver = null;
let revealObserver = null;
let scrollRoot = null;
let slideTargets = [];

// Screen 1 is always the opening view; screens 2..7 are observed on scroll.
const OPENING_SCREEN = '1';

// Analytics counts a screen "viewed" once its top passes the modal's midpoint.
const VIEW_ROOT_MARGIN = '0px 0px -50% 0px';
// Entrance animations reveal earlier, as a section clears the modal's bottom edge,
// so motion plays while it rises into view instead of once it is halfway up.
// revealSlidesInView reads the same inset, so the two stay in sync.
const REVEAL_BOTTOM_INSET = 0.1;
const REVEAL_ROOT_MARGIN = `0px 0px -${REVEAL_BOTTOM_INSET * 100}% 0px`;

const markScreenViewed = slide => {
	if (!slide || viewedSlides.has(slide)) {
		return;
	}
	viewedSlides.add(slide);
	$kvTrackEvent('portfolio', 'view', 'goal-in-review', `screen-${slide}`);
};

// The fade teaser at the bottom of the scroll area shows until the recap is scrolled.
const isAtTop = ref(true);

const handleScrollPosition = () => {
	isAtTop.value = (scrollRoot?.scrollTop ?? 0) < 8;
};

// Unpause the section's entrance animations (see the reveal-on-scroll gate in
// css/animations.css). Slides gated with [data-animate-on-view] stay hidden
// until this runs, so their motion plays when the user reaches them, not on
// mount. Slide 1 has no gate and animates on mount, so this is a no-op for it.
const revealSlide = target => target?.classList.add('is-in-view');

// A slide that loads before the slides above it looks in view while they're still empty,
// and would play its entrance off-screen. Checked at the slide level, so the sections
// inside slide 3 wait on the slides above slide 3.
const slidesAboveLaidOut = target => previousSiblingsLaidOut(target.closest('[data-slide-view]'));

const trackSlideViews = entries => {
	entries.forEach(entry => {
		const slide = entry.target.dataset.slideView;
		if (!entry.isIntersecting || !slide || viewedSlides.has(slide)) {
			return;
		}
		// The slides are async components, so right after opening a wrapper can still
		// be briefly 0-height. Wait for a laid-out height so a screen only counts once
		// it has actually scrolled into view.
		if (entry.boundingClientRect.height === 0) {
			reobserveNextFrame(() => slideObserver, entry.target);
			return;
		}
		markScreenViewed(slide);
		slideObserver?.unobserve(entry.target);
	});
};

// Reveal runs on its own, earlier-triggering observer so entrance animations start
// as a section enters from the bottom, independent of the view-tracking threshold.
// A wrapper whose position isn't final yet is checked again once it may be.
const revealSlides = entries => {
	entries.forEach(entry => {
		if (!entry.isIntersecting) {
			return;
		}
		if (entry.boundingClientRect.height === 0 || !slidesAboveLaidOut(entry.target)) {
			reobserveNextFrame(() => revealObserver, entry.target);
			return;
		}
		revealSlide(entry.target);
		revealObserver?.unobserve(entry.target);
	});
};

// Fallback for a slide that renders already inside the reveal area and that the observer
// misses, for example when a paused animation frame skips the re-observe. Reveals
// every gated wrapper whose current position overlaps the reveal area.
const revealSlidesInView = () => {
	if (!scrollRoot || !slidesContainer.value) {
		return;
	}
	const rootRect = scrollRoot.getBoundingClientRect();
	slidesContainer.value.querySelectorAll('[data-animate-on-view]:not(.is-in-view)').forEach(wrapper => {
		if (isInRevealArea(wrapper.getBoundingClientRect(), rootRect, REVEAL_BOTTOM_INSET)
			&& slidesAboveLaidOut(wrapper)) {
			revealSlide(wrapper);
			revealObserver?.unobserve(wrapper);
		}
	});
};

// Arms view tracking the first time the recap scrolls, then removes itself.
// IntersectionObserver reports each target's current state as soon as it starts
// observing, so a screen already past the midpoint by the time this runs still
// counts. Only a peek with no scroll at all is excluded.
const armSlideTracking = () => {
	slideObserver = createIntersectionObserver({
		targets: slideTargets,
		callback: trackSlideViews,
		options: { root: scrollRoot, rootMargin: VIEW_ROOT_MARGIN, threshold: 0 },
	});
};

const teardownObservers = () => {
	slideObserver?.disconnect();
	slideObserver = null;
	revealObserver?.disconnect();
	revealObserver = null;
	scrollRoot?.removeEventListener('scroll', handleScrollPosition);
	scrollRoot?.removeEventListener('scroll', armSlideTracking);
	scrollRoot = null;
	slideTargets = [];
};

const setupObservers = async () => {
	teardownObservers();
	viewedSlides.clear();
	isAtTop.value = true;
	// Fire the opening screen now: the async slides aren't laid out yet, so the
	// observer can't reliably detect screen 1 on open without a scroll.
	markScreenViewed(OPENING_SCREEN);
	await nextTick();
	const container = slidesContainer.value;
	const targets = container ? [...container.querySelectorAll('[data-slide-view]')] : [];
	if (!targets.length) {
		return;
	}
	// Re-hide the scroll-revealed sections so a reopen replays their entrance.
	targets.forEach(target => target.classList.remove('is-in-view'));
	const root = container.closest('#kvLightboxBody');
	revealObserver = createIntersectionObserver({
		targets,
		callback: revealSlides,
		options: { root, rootMargin: REVEAL_ROOT_MARGIN, threshold: 0 },
	});
	// No observer means no scroll callback will fire, so reveal every gated
	// section up front rather than leaving its content paused and hidden.
	if (!revealObserver) {
		targets.forEach(revealSlide);
	}
	if (!root) {
		return;
	}
	scrollRoot = root;
	slideTargets = targets;
	scrollRoot.addEventListener('scroll', handleScrollPosition, { passive: true });
	scrollRoot.addEventListener('scroll', armSlideTracking, { passive: true, once: true });
	// Covers slides that mounted (and called revealSlidesInView) before scrollRoot existed.
	revealSlidesInView();
};

// The arrow on screen 1 scrolls straight to screen 2.
const scrollToScreenTwo = () => {
	const target = slidesContainer.value?.querySelector('[data-slide-view="2"]');
	if (!target) {
		return;
	}
	target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
};

watch(() => props.show, isShown => {
	if (isShown) {
		closeTracked = false;
		setupObservers();
	} else {
		teardownObservers();
	}
}, { immediate: true });

onBeforeUnmount(teardownObservers);
</script>

<style lang="postcss">
.goal-in-review-modal {
	--recap-page-height: calc(90vh - 3.5rem);
	--recap-next-screen-peek: 197px;

	/* Screen 1 fills the modal except for a strip that previews the top of screen 2, to invite a scroll. */
	.goal-in-review-slides > :first-child > * {
		@screen md {
			min-height: calc(var(--recap-page-height) - var(--recap-next-screen-peek));
		}
	}

	[data-test=kv-lightbox] {
		max-height: 90vh !important;
		animation: goal-in-review-modal-enter 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;

		@apply !tw-w-screen !tw-mt-auto !tw-mb-0 !tw-rounded-t !tw-rounded-b-none
			tw-bg-eco-green-4 tw-overflow-hidden tw-relative motion-reduce:tw-animate-none;
	}

	[data-test=kv-lightbox] > div:first-child {
		@apply tw-absolute tw-top-3 tw-right-3 tw-z-1 !tw-p-0 tw-text-secondary;
	}

	[data-test=kv-lightbox] > div:first-child button,
	[data-test=kv-lightbox] > div:first-child button:hover,
	[data-test=kv-lightbox] > div:first-child button:focus-visible {
		@apply !tw-bg-transparent !tw-text-secondary;
	}

	[data-test=kv-lightbox] > div:first-child button svg,
	[data-test=kv-lightbox] > div:first-child button svg * {
		fill: currentcolor !important;
		opacity: 1 !important;
		stroke: currentcolor !important;
	}

	#kvLightboxBody {
		max-height: var(--recap-page-height);
		scrollbar-width: thin;

		/* #e0e0e0 matches the gray-200 token used for the webkit scrollbar thumb below;
		this plain CSS property can't take a token or utility class. */
		scrollbar-color: #e0e0e0 transparent;

		@apply !tw-p-0 tw-overflow-y-auto;
	}

	/* Mint wash over the peeking top of screen 2, strengthening toward the bottom.
	brand-100 comes from the tw-bg-brand-100 token class on the element; a mask
	reproduces the angled alpha ramp, fading the flat color from transparent to
	80% opacity without opacity-modifier utilities. */
	.goal-in-review-scroll-fade {
		mask-image: linear-gradient(
			178.45deg,
			transparent 18.5%,
			rgb(0 0 0 / 80%) 79%
		);
	}
}

@screen md {
	.goal-in-review-modal {
		--recap-page-height: min(630px, calc(100vh - 4rem));
	}

	.goal-in-review-modal [data-test=kv-lightbox] {
		max-width: min(calc(100vw - 4rem), 1020px) !important;
		height: var(--recap-page-height);
		max-height: var(--recap-page-height) !important;

		@apply !tw-m-auto !tw-rounded;
	}
}

@screen lg {
	.goal-in-review-modal {
		--recap-page-height: min(760px, calc(100vh - 2rem));
	}
}

.goal-in-review-modal #kvLightboxBody::-webkit-scrollbar {
	@apply tw-w-1;
}

.goal-in-review-modal #kvLightboxBody::-webkit-scrollbar-track {
	@apply tw-bg-transparent;
}

.goal-in-review-modal #kvLightboxBody::-webkit-scrollbar-thumb {
	@apply tw-bg-gray-200 tw-rounded-sm;
}

@keyframes goal-in-review-modal-enter {
	from {
		opacity: 0;
		transform: scale(0.96) translateY(18px);
	}

	to {
		opacity: 1;
		transform: scale(1) translateY(0);
	}
}
</style>
