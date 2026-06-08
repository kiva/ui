<template>
	<div
		class="card-container"
		:class="{'tw-gap-3': !!userHasGoal}"
	>
		<div v-if="loading" class="tw-flex tw-flex-col tw-justify-between tw-h-full">
			<kv-loading-placeholder class="!tw-h-4 tw-w-full tw-max-w-16 tw-my-1" />
			<kv-loading-placeholder class="tw-mb-2" />
			<kv-loading-placeholder class="!tw-h-3 tw-w-full tw-mb-1 tw-max-w-sm" />
			<kv-loading-placeholder class="!tw-h-6 tw-mb-1" />
		</div>
		<template v-else>
			<div v-if="!userHasGoal" class="tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-between">
				<h3 class="tw-text-title tw-text-center" v-html="title"></h3>
				<div class="tw-text-center">
					<p
						v-if="isGoalTileExperimentEnabled"
						v-html="goalCopy.CARD_HABIT_PROMPT_EXPERIMENT"
					></p>
					<p v-else>
						{{ goalCopy.TITLE_HOW_MANY_LOANS_GENERIC }}
					</p>
				</div>
				<img
					:src="HandsPlant"
					class="tw-my-2 md:tw-my-4 tw-w-14"
				>
				<KvButton
					class="tw-w-full"
					v-kv-track-event="['portfolio', 'click', 'set-a-goal']"
					@click="$emit('open-goal-modal')"
				>
					{{ goalCopy.BUTTON_SET_GOAL }}
				</KvButton>
			</div>
			<GoalProgressRing
				v-else
				variant="card"
				:goal-loans="goalLoans"
				:goal-progress="goalProgress"
				:goal-progress-percentage="goalProgressPercentage"
				:category-name="categoryName"
				:category-id="userGoal?.category"
				@button-click="handleContinueClick"
				@edit-button-click="handleEditClick"
			/>
		</template>
	</div>
</template>

<script setup>

import {
	computed,
	inject,
	watch,
	ref,
} from 'vue';
import {
	KvButton, KvLoadingPlaceholder
} from '@kiva/kv-components';
import { COMPLETED_GOAL_THRESHOLD } from '#src/composables/useGoalData';
import goalCopy, { GOAL_SIGNUP_COPY_NO_GOAL_YET } from '#src/util/goalCopy';
import { useRouter } from 'vue-router';
import confetti from 'canvas-confetti';
import GoalProgressRing from '#src/components/MyKiva/GoalProgressRing';
import HandsPlant from '#src/assets/images/thanks-page/hands-plant.gif';

const props = defineProps({
	userGoal: {
		type: Object,
		default: () => ({}),
	},
	goalProgress: {
		type: Number,
		default: 0,
	},
	prevYearLoans: {
		type: Number,
		default: 0,
	},
	loading: {
		type: Boolean,
		default: true,
	},
	hideGoalCard: {
		type: Boolean,
		default: false,
	},
	isGoalTileExperimentEnabled: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['open-goal-modal']);

const $kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();
const goalData = inject('goalData');

const {
	getCtaHref,
	getGoalDisplayName,
	goalProgressPercentage,
} = goalData;

const isUpdatingGoal = ref(false);
const hasHandledGoalCompletion = ref(false);

const userHasGoal = computed(() => !!props.userGoal && Object.keys(props.userGoal).length > 0);

const goalLoans = computed(() => {
	return props.userGoal?.target || 0;
});

const title = computed(() => {
	if (goalCopy.getGoalSignupCopyVariant() === GOAL_SIGNUP_COPY_NO_GOAL_YET) {
		return goalCopy.CARD_NO_GOAL_YET_EXPERIMENT;
	}
	if (props.prevYearLoans === 1) {
		return goalCopy.titleLastYearSingleWoman(props.prevYearLoans, 'tw-text-action');
	}
	if (props.prevYearLoans > 1) {
		return goalCopy.titleLastYearMultiplePeople(props.prevYearLoans, 'women', 'tw-text-action');
	}
	return goalCopy.titleNoHistoryWomensDefault('tw-text-action');
});

const categoryName = computed(() => {
	return getGoalDisplayName(props.userGoal?.target, props.userGoal?.category);
});

const ctaHref = computed(() => {
	return getCtaHref(props.userGoal?.target, props.userGoal?.category, router, props.goalProgress);
});

const showConfetti = () => {
	confetti({
		origin: {
			y: 0.2,
		},
		particleCount: 150,
		spread: 200,
		colors: ['#6AC395', '#223829', '#95D4B3'],
		disableForReducedMotion: true,
	});
};

const handleContinueClick = () => {
	$kvTrackEvent('portfolio', 'click', 'continue-towards-goal');
	if (goalProgressPercentage.value === COMPLETED_GOAL_THRESHOLD) {
		$kvTrackEvent('portfolio', 'click', 'goal-completed-cta');
		const element = document.querySelector('#mykiva-achievements');
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}

		return;
	}
	window.location.href = ctaHref.value;
};

const handleEditClick = () => {
	$kvTrackEvent('portfolio', 'click', 'edit-goal');
	isUpdatingGoal.value = true;
	emit('open-goal-modal', { updating: true });
};

const showCompletedGoalConfetti = () => {
	if (
		hasHandledGoalCompletion.value
		|| props.loading
		|| props.hideGoalCard
		|| !userHasGoal.value
		|| goalProgressPercentage.value !== COMPLETED_GOAL_THRESHOLD
	) {
		return;
	}

	hasHandledGoalCompletion.value = true;
	showConfetti();
};

watch(
	() => [props.loading, props.hideGoalCard, goalProgressPercentage.value, userHasGoal.value],
	showCompletedGoalConfetti,
	{ immediate: true }
);

watch(() => [props.loading, props.hideGoalCard], ([newLoading, newHideGoalCard], [oldLoading]) => {
	if (!newLoading && oldLoading && !newHideGoalCard) {
		if (!userHasGoal.value) {
			$kvTrackEvent(
				'portfolio',
				'view',
				'set-annual-goal'
			);
		} else if (
			!isUpdatingGoal.value
			&& userHasGoal.value
			&& goalProgressPercentage.value !== COMPLETED_GOAL_THRESHOLD) {
			$kvTrackEvent('portfolio', 'show', 'goal-set', props.userGoal.category, props.userGoal.target);
		}
	}
});
</script>

<style lang="postcss" scoped>
.card-container {
	min-height: 300px;

	@apply tw-w-full tw-h-full tw-relative tw-rounded tw-shadow tw-p-1 tw-py-2 md:tw-p-2 tw-flex tw-flex-col
		tw-overflow-hidden tw-bg-white tw-shrink-0;
}
</style>
