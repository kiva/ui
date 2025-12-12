<template>
	<div
		ref="cardRef"
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
				<h2 class="tw-text-center tw-pb-1" v-html="title"></h2>
				<p class="tw-text-center">
					How many loans will you make this year?
				</p>
				<img
					:src="GoalCardSeedling"
					class="tw-my-2 md:tw-my-4 tw-w-9 tw-h-11.5"
				>
				<KvButton
					class="tw-w-full"
					v-kv-track-event="['portfolio', 'click', 'set-a-goal']"
					@click="$emit('open-goal-modal')"
				>
					Set {{ nextYearToDate }} goal
				</KvButton>
			</div>
			<div v-else class="tw-h-full tw-flex tw-flex-col tw-text-center tw-justify-between">
				<div class="tw-text-left">
					<p class="tw-font-medium">
						Your {{ yearToDate }} Goal
					</p>
					<p class="tw-text-secondary">
						{{ goalDescription }}
					</p>
				</div>
				<div class="tw-relative tw-z-docked tw-mx-auto">
					<KvProgressCircle
						class="tw-z-2"
						:stroke-width="20"
						:value="goalProgressPercentage"
						:max="goalLoans"
						:rotate="180"
						style="height: 170px; width: 170px;"
					/>
					<div class="tw-absolute tw-flex tw-flex-col tw-items-center tw-justify-center tw-inset-0 tw--mt-1">
						<h1>
							{{ visibleGoalLoans }}
						</h1>
						<p class="tw-text-secondary">
							{{ progressCircleDesc }}
						</p>
					</div>
				</div>
				<p v-html="progressDescription" class="tw-font-medium tw-py-1" style="line-height: 1.5rem;">
				</p>
				<KvButton
					class="tw-w-full"
					@click="handleContinueClick"
				>
					{{ btnCta }}
				</KvButton>
			</div>
		</template>
	</div>
</template>

<script setup>

import {
	computed, watch, inject, ref
} from 'vue';
import {
	KvButton, KvLoadingPlaceholder
} from '@kiva/kv-components';
import useBadgeData from '#src/composables/useBadgeData';
import useGoalData from '#src/composables/useGoalData';
import { useRouter } from 'vue-router';
import KvProgressCircle from '#src/components/Kv/KvProgressCircle';
import confetti from 'canvas-confetti';
import GoalCardSeedling from '#src/assets/images/my-kiva/goal-card-seedling.png';

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
		default: false,
	}
});

defineEmits(['open-goal-modal']);

const $kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();

const cardRef = ref(null);

const { getLoanFindingUrl } = useBadgeData();
const { getGoalDisplayName } = useGoalData({});
const COMPLETED_GOAL_THRESHOLD = 100;
const HALF_GOAL_THRESHOLD = 50;

const userHasGoal = computed(() => !!props.userGoal && Object.keys(props.userGoal).length > 0);

const yearToDate = computed(() => {
	const currentYear = new Date().getFullYear();
	return currentYear;
});

const nextYearToDate = computed(() => {
	return yearToDate.value + 1;
});

const goalLoans = computed(() => {
	return props.userGoal?.target || 0;
});

const visibleGoalLoans = computed(() => {
	return Math.min(props.goalProgress, goalLoans.value);
});

const title = computed(() => {
	if (props.prevYearLoans === 1) {
		// eslint-disable-next-line max-len
		return `Last year, you helped<br><span class="tw-text-action"> ${props.prevYearLoans} woman</span><br>shape their futures!`;
	}
	if (props.prevYearLoans > 1) {
		// eslint-disable-next-line max-len
		return `Last year, you helped<br><span class="tw-text-action"> ${props.prevYearLoans} women</span><br>shape their futures!`;
	}
	return 'Lenders like you help <span class="tw-text-action"> 3 women</span> a year';
});

const goalProgressPercentage = computed(() => {
	if (!props.userGoal?.target || props.goalProgress <= 0) return 0;
	return Math.min(
		Math.round((props.goalProgress / props.userGoal.target) * 100),
		COMPLETED_GOAL_THRESHOLD
	);
});

const progressDescription = computed(() => {
	if (goalProgressPercentage.value === 0) {
		return 'Get started by making a loan!';
	} if (goalProgressPercentage.value > 0 && goalProgressPercentage.value < HALF_GOAL_THRESHOLD) {
		return 'You’ve started something powerful.<br>Let’s keep it growing together.';
	} if (goalProgressPercentage.value === HALF_GOAL_THRESHOLD) {
		return 'Halfway to your goal!<br>Every loan fuels a dream.';
	} if (goalProgressPercentage.value < COMPLETED_GOAL_THRESHOLD) {
		return 'You’ve brought so many dreams<br>within reach. Finish strong!';
	}
	return `Incredible! You reached your ${yearToDate.value}<br>goal and changed ${goalLoans.value} lives!`;
});

const btnCta = computed(() => {
	if (goalProgressPercentage.value === COMPLETED_GOAL_THRESHOLD) {
		return 'View lifetime goals';
	}
	return 'Work towards your goal';
});

const categoryName = computed(() => {
	return getGoalDisplayName(props.userGoal?.target, props.userGoal?.category);
});

const goalDescription = computed(() => {
	const description = `${goalLoans.value} loans`;

	if (categoryName.value !== 'loans') {
		return `${description} to ${categoryName.value}`;
	}
	return description;
});

const ctaHref = computed(() => {
	const categoryHeader = categoryName.value;
	const string = `Your goal: Support ${props.userGoal?.target} ${categoryHeader}`;
	const encodedHeader = encodeURIComponent(string);
	const loanFindingUrl = getLoanFindingUrl(props.userGoal?.category, router.currentRoute.value);
	return `${loanFindingUrl}?header=${encodedHeader}`;
});

const showConfetti = () => {
	let origin = { x: 0.5, y: 0.2 };

	if (cardRef.value) {
		const rect = cardRef.value.getBoundingClientRect();
		const centerX = rect.left + (rect.width / 2);
		const topY = rect.top;

		origin = {
			x: centerX / window.innerWidth,
			y: topY / window.innerHeight,
		};
	}

	confetti({
		origin,
		particleCount: 150,
		spread: 200,
		colors: ['#6AC395', '#223829', '#95D4B3'],
		disableForReducedMotion: true,
	});
};

const handleContinueClick = () => {
	if (goalProgressPercentage.value === COMPLETED_GOAL_THRESHOLD) {
		$kvTrackEvent('portfolio', 'click', 'goal-completed-cta');
		router.push({ path: '/mykiva', hash: '#my-achievements' });
		return;
	}
	$kvTrackEvent('portfolio', 'click', 'continue-towards-goal');
	router.push(ctaHref.value);
};

const progressCircleDesc = computed(() => `loan${props.goalProgress > 1 ? 's' : ''} made`);

watch(() => props.userGoal, (newVal, oldVal) => {
	// Only track when no user goal
	if (!newVal?.category && !oldVal?.category) {
		$kvTrackEvent('portfolio', 'view', 'set-annual-goal');
	}

	// Only track when a new goal is created (oldVal had no category, newVal has one)
	if (newVal?.target && newVal?.category && !oldVal?.category) {
		$kvTrackEvent('portfolio', 'show', 'goal-set', newVal.category, newVal.target);
	}
});

watch(
	goalProgressPercentage,
	newVal => {
		if (newVal === COMPLETED_GOAL_THRESHOLD) {
			showConfetti();
		}
	},
	{ immediate: true }
);
</script>

<style lang="postcss" scoped>
.card-container {
	@apply tw-w-full tw-h-full tw-relative tw-rounded tw-shadow tw-p-1 md:tw-p-2 tw-flex tw-flex-col
		tw-overflow-hidden tw-bg-white tw-shrink-0;
}
</style>
