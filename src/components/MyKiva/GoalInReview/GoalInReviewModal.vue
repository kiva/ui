<template>
	<KvLightbox
		class="goal-in-review-modal tw-p-14 max-md:tw-flex max-md:tw-items-end
			max-md:tw-overflow-y-hidden max-md:tw-p-0"
		:visible="show"
		title=""
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
				/>
			</div>
			<div data-slide-view="2" data-animate-on-view>
				<GoalInReviewBorrowers
					:loans="data?.goalLoans"
					:borrower-count="data?.loanStats?.borrowers"
				/>
			</div>
			<!-- Slide 3 has two sections that each reveal independently. -->
			<div data-slide-view="3">
				<GoalInReviewGlobalReach
					:countries="data?.goalSummary?.countries"
					:sectors="data?.goalSummary?.sectors"
				/>
			</div>
			<div data-slide-view="4" data-animate-on-view>
				<GoalInReviewGivingInsights
					:goal-summary="data?.goalSummary"
					:lifetime-percentile="data?.lifetimePercentile"
				/>
			</div>
			<div data-slide-view="5" data-animate-on-view>
				<GoalInReviewCollectiveImpact />
			</div>
			<div
				v-if="data?.goalSummary?.status === 'completed'"
				data-slide-view="6"
				data-animate-on-view
			>
				<GoalInReviewPersonalNote :year="data?.year" />
			</div>
			<div data-slide-view="7" data-animate-on-view>
				<GoalInReviewThanksAndFeedback
					:goal-status="data?.goalSummary?.status"
					:loan-count="data?.loanStats?.borrowers"
					:year="data?.year"
					:current-year="currentYear"
					:feedback-submitted="feedbackSubmitted"
					@back-to-kiva="handleCta('back-to-kiva')"
					@finish-goal="handleCta('finish-goal')"
					@set-goal="handleCta('set-goal')"
					@feedback-submitted="handleFeedbackSubmitted"
				/>
			</div>
		</div>
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
import { createIntersectionObserver } from '#src/util/observerUtils';

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

const emit = defineEmits(['close', 'back-to-kiva', 'finish-goal', 'set-goal', 'feedback-submitted']);
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
// emitted as `screen-${n}` even though the components are named Slide 1..7.
const slidesContainer = ref(null);
const viewedSlides = new Set();
let slideObserver = null;

// Screen 1 is always the opening view; screens 2..7 are observed on scroll.
const OPENING_SCREEN = '1';

const markScreenViewed = slide => {
	if (!slide || viewedSlides.has(slide)) {
		return;
	}
	viewedSlides.add(slide);
	$kvTrackEvent('portfolio', 'view', 'goal-in-review', `screen-${slide}`);
};

const teardownSlideObserver = () => {
	slideObserver?.disconnect();
	slideObserver = null;
};

// Unpause the section's entrance animations (see the reveal-on-scroll gate in
// css/global/animations.css). Slides gated with [data-animate-on-view] stay hidden
// until this runs, so their motion plays when the user reaches them, not on
// mount. Slide 1 has no gate and animates on mount, so this is a no-op for it.
const revealSlide = target => target?.classList.add('is-in-view');

const trackSlideViews = entries => {
	entries.forEach(entry => {
		const slide = entry.target.dataset.slideView;
		if (!entry.isIntersecting || !slide || viewedSlides.has(slide)) {
			return;
		}
		// The slides are async components, so on open every wrapper is briefly
		// 0-height and stacked at the top — which would fire (and unobserve) all of
		// them at once. Wait for a laid-out height so each screen counts only when
		// it actually scrolls into view.
		if (entry.boundingClientRect.height === 0) {
			return;
		}
		markScreenViewed(slide);
		revealSlide(entry.target);
		slideObserver?.unobserve(entry.target);
	});
};

const setupSlideObserver = async () => {
	teardownSlideObserver();
	viewedSlides.clear();
	// Fire the opening screen now — the async slides aren't laid out yet, so the
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
	slideObserver = createIntersectionObserver({
		targets,
		callback: trackSlideViews,
		// Trigger when a section's top passes the scroll container's midpoint.
		options: { root: container.closest('#kvLightboxBody'), rootMargin: '0px 0px -50% 0px', threshold: 0 },
	});
	// No observer means no scroll callback will fire, so reveal every gated
	// section up front rather than leaving its content paused and hidden.
	if (!slideObserver) {
		targets.forEach(revealSlide);
	}
};

watch(() => props.show, isShown => {
	if (isShown) {
		closeTracked = false;
		setupSlideObserver();
	} else {
		teardownSlideObserver();
	}
}, { immediate: true });

onBeforeUnmount(teardownSlideObserver);
</script>

<style lang="postcss">
.goal-in-review-modal {
	--recap-page-height: calc(90vh - 3.5rem);

	.goal-in-review-slides > :first-child > * {
		min-height: var(--recap-page-height);
	}

	[data-test=kv-lightbox] {
		max-height: 90vh !important;

		@apply !tw-w-screen !tw-mt-auto !tw-mb-0 !tw-rounded-t !tw-rounded-b-none
			tw-bg-eco-green-4 tw-overflow-hidden tw-relative;
	}

	[data-test=kv-lightbox] > div:first-child {
		@apply tw-absolute tw-top-1.5 tw-right-1.5 tw-z-1 !tw-p-0 tw-text-white;
	}

	[data-test=kv-lightbox] > div:first-child button,
	[data-test=kv-lightbox] > div:first-child button:hover,
	[data-test=kv-lightbox] > div:first-child button:focus-visible {
		opacity: 1 !important;
		filter: drop-shadow(0 1px 2px rgb(0 0 0 / 80%));

		@apply !tw-bg-transparent !tw-text-white;
	}

	[data-test=kv-lightbox] > div:first-child button svg,
	[data-test=kv-lightbox] > div:first-child button svg * {
		fill: currentcolor !important;
		opacity: 1 !important;
		stroke: currentcolor !important;
	}

	#kvLightboxBody {
		max-height: var(--recap-page-height);
		scrollbar-width: none;
		-ms-overflow-style: none;

		@apply !tw-p-0 tw-overflow-y-auto;
	}
}

@screen md {
	.goal-in-review-modal {
		--recap-page-height: min(710px, calc(100vh - 4rem));
	}

	.goal-in-review-modal [data-test=kv-lightbox] {
		max-width: min(calc(100vw - 4rem), 1020px) !important;
		height: var(--recap-page-height);
		max-height: var(--recap-page-height) !important;

		@apply !tw-m-auto !tw-rounded;
	}
}

.goal-in-review-modal #kvLightboxBody::-webkit-scrollbar {
	display: none;
}
</style>
