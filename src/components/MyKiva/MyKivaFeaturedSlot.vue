<template>
	<section
		v-if="shouldRender"
		class="!tw-mt-1"
	>
		<KvLoadingPlaceholder
			v-if="cardLoading"
			class="!tw-h-5 tw-mb-2"
			:style="{ width: '15rem'}"
		/>
		<h3 v-else class="tw-text-title tw-mb-2">
			{{ slotTitle }}
		</h3>
		<FeaturedGoalCard
			:state="slotState"
			:loading="cardLoading"
			:goal-target="goalTarget"
			:goal-progress="goalProgressValue"
			:goal-progress-percentage="goalProgressPercentageValue"
			:category-name="categoryName"
			:user-name="userFirstName"
			:suppress-completion-confetti="suppressCompletionConfetti"
			@set-goal-click="handleSetGoalClick"
			@cta-click="handleCtaClick"
			@edit-click="handleEditClick"
		/>
	</section>
</template>

<script setup>
import {
	computed, inject, ref, watch,
} from 'vue';
import { useRouter } from 'vue-router';
import FeaturedGoalCard from '#src/components/MyKiva/FeaturedGoalCard';
import {
	GOAL_STATUS,
	GOALS_CURRENT_YEAR,
	COMPLETED_GOAL_THRESHOLD,
} from '#src/composables/useGoalData';
import logReadQueryError from '#src/util/logReadQueryError';
import { KvLoadingPlaceholder } from '@kiva/kv-components';

const STATE_NO_GOAL = 'no-goal';
const STATE_ACTIVE_GOAL = 'active-goal';

const SLOT_TITLES = {
	[STATE_NO_GOAL]: 'Start by setting an impact goal',
	inProgress: 'Continue making progress on your impact goal',
	completed: 'Goal Achieved!',
};

defineProps({
	userFirstName: {
		type: String,
		default: '',
	},
});

const emit = defineEmits(['set-goal-click', 'cta-click', 'edit-click']);

const router = useRouter();
const goalData = inject('goalData');

const cardLoading = computed(() => Boolean(goalData?.loading?.value));
const goalStatus = computed(() => goalData?.userGoal?.value?.status || null);
const goalTarget = computed(() => goalData?.userGoal?.value?.target || 0);
const goalProgressValue = computed(() => goalData?.goalProgress?.value || 0);
const goalProgressPercentageValue = computed(() => goalData?.goalProgressPercentage?.value || 0);

const categoryName = computed(() => {
	const target = goalData?.userGoal?.value?.target;
	const category = goalData?.userGoal?.value?.category;
	if (!target || !category || !goalData?.getGoalDisplayName) return '';
	return goalData.getGoalDisplayName(target, category);
});

// Snapshot of the viewedGoalComplete flag taken once when we first see a COMPLETED status.
// Sticky so the slot does not disappear mid-view after we persist the flag.
const alreadyViewedSnapshot = ref(null);

const slotState = computed(() => {
	if (cardLoading.value) return STATE_NO_GOAL;
	if (goalStatus.value === GOAL_STATUS.COMPLETED) {
		if (alreadyViewedSnapshot.value === true) return null;
		return STATE_ACTIVE_GOAL;
	}
	if (goalStatus.value === GOAL_STATUS.IN_PROGRESS) return STATE_ACTIVE_GOAL;
	return STATE_NO_GOAL;
});

const shouldRender = computed(() => slotState.value !== null);

const slotTitle = computed(() => {
	if (slotState.value === STATE_NO_GOAL) return SLOT_TITLES[STATE_NO_GOAL];
	if (goalStatus.value === GOAL_STATUS.COMPLETED) return SLOT_TITLES.completed;
	return SLOT_TITLES.inProgress;
});

const suppressCompletionConfetti = computed(() => alreadyViewedSnapshot.value === true);

watch(
	() => [cardLoading.value, goalStatus.value],
	() => {
		if (alreadyViewedSnapshot.value !== null) return;
		if (cardLoading.value) return;
		if (goalStatus.value !== GOAL_STATUS.COMPLETED) return;
		const viewed = Boolean(goalData?.hasViewedCompletedGoalForYear?.(GOALS_CURRENT_YEAR));
		alreadyViewedSnapshot.value = viewed;
		if (!viewed) {
			goalData.setViewedGoalCompletePreference(GOALS_CURRENT_YEAR).catch(error => {
				logReadQueryError(error, 'MyKivaFeaturedSlot setViewedGoalComplete');
			});
		}
	},
	{ immediate: true }
);

const handleSetGoalClick = () => {
	// Parent (MyKivaPageContent) opens the existing GoalSettingModal mounted in LendingStats.
	emit('set-goal-click');
};

const handleCtaClick = () => {
	emit('cta-click');
	if (goalProgressPercentageValue.value >= COMPLETED_GOAL_THRESHOLD) {
		const el = typeof document !== 'undefined'
			? document.querySelector('#mykiva-achievements')
			: null;
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
	// Parent (MyKivaPageContent) opens the existing GoalSettingModal in edit mode.
	emit('edit-click');
};
</script>
