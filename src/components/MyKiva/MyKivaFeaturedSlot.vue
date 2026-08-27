<template>
	<section
		v-if="shouldRender"
		class="!tw-mt-1"
	>
		<KvLoadingPlaceholder
			v-if="cardLoading"
			class="!tw-h-3 tw-mb-2"
			:style="{ width: '15rem'}"
		/>
		<h2 v-else class="tw-mb-2 !tw-text-title">
			{{ slotTitle }}
		</h2>
		<FeaturedGoalCard
			:state="slotState"
			:loading="cardLoading"
			:goal-target="goalTarget"
			:goal-progress="goalProgressValue"
			:goal-progress-percentage="goalProgressPercentageValue"
			:category-name="categoryName"
			:user-name="userFirstName"
			:prev-year-loans="womenLoansLastYear"
			:suppress-completion-confetti="suppressCompletionConfetti"
			:show-recap-cta="showRecapCta"
			@set-goal-click="handleSetGoalClick"
			@cta-click="handleCtaClick"
			@edit-click="handleEditClick"
			@view-goal-recap="handleViewGoalRecap"
		/>
	</section>
</template>

<script setup>
import {
	computed, inject, ref, watch,
} from 'vue';
import { useRouter } from 'vue-router';
import FeaturedGoalCard from '#src/components/MyKiva/FeaturedGoalCard';
import useGoalData, {
	GOAL_STATUS,
	GOALS_CURRENT_YEAR,
	COMPLETED_GOAL_THRESHOLD,
} from '#src/composables/useGoalData';
import logReadQueryError from '#src/util/logReadQueryError';
import { getGoalYear, shouldHideGoalSignup, shouldShowRecapEntryPoint } from '#src/util/goalInReview';
import { getGoalInReviewCurrentYear, getGoalInReviewNow } from '#src/composables/useGoalInReview';
import { KvLoadingPlaceholder } from '@kiva/kv-components';

const STATE_NO_GOAL = 'no-goal';
const STATE_ACTIVE_GOAL = 'active-goal';

const SLOT_TITLES = {
	[STATE_NO_GOAL]: 'Start by setting an impact goal',
	inProgress: 'Continue making progress on your impact goal',
	completed: 'Goal Achieved!',
};

const props = defineProps({
	userFirstName: {
		type: String,
		default: '',
	},
	heroTieredAchievements: {
		type: Array,
		default: () => [],
	},
	goalInReviewEnable: {
		type: Boolean,
		default: false,
	},
	goalInReviewInProgressStart: {
		type: Date,
		default: null,
	},
});

const emit = defineEmits(['set-goal-click', 'cta-click', 'edit-click', 'view-goal-recap']);

const router = useRouter();
const goalData = inject('goalData');
const $kvTrackEvent = inject('$kvTrackEvent');
const { getCategoryLoansLastYear } = useGoalData();

// Goal state is hydrated from the Apollo cache during server render, so `cardLoading`
// is already false while SSR runs and the watchers below fire on the server too. Reads
// that decide what renders must run in both passes or the two disagree; the writes they
// guard — persisting a preference, sending analytics — are browser-only.
const isBrowser = typeof window !== 'undefined';

const cardLoading = computed(() => Boolean(goalData?.loading?.value));
const goalStatus = computed(() => goalData?.userGoal?.value?.status || null);
const goalTarget = computed(() => goalData?.userGoal?.value?.target || 0);
const goalProgressValue = computed(() => goalData?.goalProgress?.value || 0);
const goalProgressPercentageValue = computed(() => goalData?.goalProgressPercentage?.value || 0);
const womenLoansLastYear = computed(() => getCategoryLoansLastYear(props.heroTieredAchievements));

const categoryName = computed(() => {
	const target = goalData?.userGoal?.value?.target;
	const category = goalData?.userGoal?.value?.category;
	if (!target || !category || !goalData?.getGoalDisplayName) return '';
	return goalData.getGoalDisplayName(target, category);
});

// Snapshot of the viewedGoalComplete flag taken once when we first see a COMPLETED status.
// Sticky so the slot does not disappear mid-view after we persist the flag.
const alreadyViewedSnapshot = ref(null);

const hideGoalSignup = computed(() => shouldHideGoalSignup({
	recapStartDate: props.goalInReviewInProgressStart,
	now: getGoalInReviewNow(),
}));

const slotState = computed(() => {
	if (cardLoading.value) return STATE_NO_GOAL;
	if (goalStatus.value === GOAL_STATUS.COMPLETED) {
		if (alreadyViewedSnapshot.value === true) return null;
		return STATE_ACTIVE_GOAL;
	}
	if (goalStatus.value === GOAL_STATUS.IN_PROGRESS) return STATE_ACTIVE_GOAL;
	// null unrenders the section, heading included.
	if (hideGoalSignup.value) return null;
	return STATE_NO_GOAL;
});

const shouldRender = computed(() => slotState.value !== null);

const slotTitle = computed(() => {
	if (slotState.value === STATE_NO_GOAL) return SLOT_TITLES[STATE_NO_GOAL];
	if (goalStatus.value === GOAL_STATUS.COMPLETED) return SLOT_TITLES.completed;
	return SLOT_TITLES.inProgress;
});

const suppressCompletionConfetti = computed(() => alreadyViewedSnapshot.value === true);

const goalYear = computed(() => getGoalYear(goalData?.userGoal?.value));

const showRecapCta = computed(() => shouldShowRecapEntryPoint({
	enabled: props.goalInReviewEnable,
	goalStatus: goalStatus.value,
	goalYear: goalYear.value,
	currentYear: getGoalInReviewCurrentYear(),
	loansTowardGoal: goalProgressValue.value,
	activeGoalYear: goalYear.value,
	now: getGoalInReviewNow(),
}));

// The snapshot decides whether a completed goal still renders, so it has to be taken on
// the server as well — reading it only in the browser would server-render the slot for a
// lender who had already seen it and then unrender it on hydration. Persisting the flag
// is a mutation and stays client-side.
watch(
	() => [cardLoading.value, goalStatus.value],
	() => {
		if (alreadyViewedSnapshot.value !== null) return;
		if (cardLoading.value) return;
		if (goalStatus.value !== GOAL_STATUS.COMPLETED) return;
		const viewed = Boolean(goalData?.hasViewedCompletedGoalForYear?.(GOALS_CURRENT_YEAR));
		alreadyViewedSnapshot.value = viewed;
		if (!viewed && isBrowser) {
			goalData.setViewedGoalCompletePreference(GOALS_CURRENT_YEAR).catch(error => {
				logReadQueryError(error, 'MyKivaFeaturedSlot setViewedGoalComplete');
			});
		}
	},
	{ immediate: true }
);

// Mirror the carousel goal-tile's view / show tracking events (see
// NextYearGoalCard) so analytics from the control surface carry
// over to the featured slot. Fires once, as soon as the slot has
// loaded data and is actually rendering. Immediate because a cache
// hydration resolves `cardLoading` before this watcher is created,
// leaving no loading->loaded transition to ride on.
const hasFiredImpressionEvent = ref(false);
watch(
	() => [cardLoading.value, shouldRender.value],
	([nowLoading]) => {
		if (!isBrowser) return;
		if (hasFiredImpressionEvent.value) return;
		if (nowLoading) return;
		if (!shouldRender.value) return;
		if (!goalStatus.value) {
			$kvTrackEvent?.('portfolio', 'view', 'set-annual-goal');
			hasFiredImpressionEvent.value = true;
			return;
		}
		if (
			goalStatus.value === GOAL_STATUS.IN_PROGRESS
			&& goalProgressPercentageValue.value !== COMPLETED_GOAL_THRESHOLD
		) {
			const goal = goalData?.userGoal?.value;
			$kvTrackEvent?.(
				'portfolio',
				'show',
				'goal-set',
				goal?.category,
				goal?.target,
			);
			hasFiredImpressionEvent.value = true;
		}
	},
	{ immediate: true }
);

const handleSetGoalClick = () => {
	emit('set-goal-click');
};

const ACHIEVEMENTS_ANCHOR = '#mykiva-achievements';
const MYKIVA_PATH = '/mykiva';

const handleCtaClick = () => {
	emit('cta-click');
	if (goalProgressPercentageValue.value >= COMPLETED_GOAL_THRESHOLD) {
		const onMyKivaHome = router?.currentRoute?.value?.path === MYKIVA_PATH;
		const el = onMyKivaHome && typeof document !== 'undefined'
			? document.querySelector(ACHIEVEMENTS_ANCHOR)
			: null;
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		} else if (typeof window !== 'undefined') {
			window.location.href = `${MYKIVA_PATH}${ACHIEVEMENTS_ANCHOR}`;
		}
		return;
	}
	const href = goalData?.getCtaHref?.(
		goalData?.userGoal?.value?.target,
		goalData?.userGoal?.value?.category,
		router,
		goalProgressValue.value,
	);
	if (href && typeof window !== 'undefined') {
		window.location.href = href;
	}
};

const handleEditClick = () => {
	emit('edit-click');
};

const handleViewGoalRecap = () => {
	emit('view-goal-recap', goalYear.value);
};
</script>
