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
				<h4 v-if="prevYearLoans > 0">
					LAST YEAR
				</h4>
				<h3 class="tw-text-center" v-html="title"></h3>
				<div class="tw-text-center">
					<p>
						How many loans will you make this year?
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
					Set 2026 goal
				</KvButton>
			</div>
			<div v-else class="tw-h-full tw-flex tw-flex-col tw-text-center tw-justify-between">
				<div class="tw-text-left">
					<p class="tw-font-medium">
						Your 2026 Goal
					</p>
					<p class="tw-text-secondary">
						{{ goalDescription }}
					</p>
				</div>
				<div class="tw-relative tw-z-docked tw-mx-auto">
					<KvProgressCircle
						class="tw-z-2 tw-py-0.5"
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
					v-kv-track-event="['portfolio', 'click', 'continue-towards-goal']"
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
	computed,
	inject,
	watch,
} from 'vue';
import {
	KvButton, KvLoadingPlaceholder
} from '@kiva/kv-components';
import useBadgeData from '#src/composables/useBadgeData';
import useGoalData, { COMPLETED_GOAL_THRESHOLD, HALF_GOAL_THRESHOLD } from '#src/composables/useGoalData';
import { useRouter } from 'vue-router';
import KvProgressCircle from '#src/components/Kv/KvProgressCircle';
import confetti from 'canvas-confetti';
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
		default: false,
	}
});

defineEmits(['open-goal-modal']);

const $kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();

const {
	getLoanFindingUrl,
	ID_BASIC_NEEDS,
	ID_CLIMATE_ACTION,
	ID_SUPPORT_ALL
} = useBadgeData();
const {
	getGoalDisplayName,
	setHideGoalCardPreference,
} = useGoalData();

const userHasGoal = computed(() => !!props.userGoal && Object.keys(props.userGoal).length > 0);

const goalLoans = computed(() => {
	return props.userGoal?.target || 0;
});

const visibleGoalLoans = computed(() => {
	return Math.min(props.goalProgress, goalLoans.value);
});

const title = computed(() => {
	if (props.prevYearLoans === 1) {
		return `You helped <span class="tw-text-action"> ${props.prevYearLoans} woman</span><br>shape her future!`;
	}
	if (props.prevYearLoans > 1) {
		return `You helped <span class="tw-text-action"> ${props.prevYearLoans} women</span><br>shape their futures!`;
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
	return `Incredible! You reached your 2026<br>goal and changed ${goalLoans.value} lives!`;
});

const btnCta = computed(() => {
	if (goalProgressPercentage.value === COMPLETED_GOAL_THRESHOLD) {
		return 'View impact progress';
	}
	return 'Work towards your goal';
});

const categoryName = computed(() => {
	return getGoalDisplayName(props.userGoal?.target, props.userGoal?.category);
});

const goalDescription = computed(() => {
	switch (props.userGoal?.category) {
		case ID_BASIC_NEEDS:
		case ID_CLIMATE_ACTION:
		case ID_SUPPORT_ALL:
			return `${goalLoans.value} ${categoryName.value}`;
		default:
			return `${goalLoans.value} loans to ${categoryName.value}`;
	}
});

const ctaHref = computed(() => {
	const categoryHeader = categoryName.value;
	const string = `Your goal: Support ${props.userGoal?.target} ${categoryHeader}`;
	const encodedHeader = encodeURIComponent(string);
	const loanFindingUrl = getLoanFindingUrl(props.userGoal?.category, router.currentRoute.value);
	return `${loanFindingUrl}?header=${encodedHeader}`;
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
	if (goalProgressPercentage.value === COMPLETED_GOAL_THRESHOLD) {
		$kvTrackEvent('portfolio', 'click', 'goal-completed-cta');
		const element = document.querySelector('#mykiva-achievements');
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}

		return;
	}
	router.push(ctaHref.value);
};

const progressCircleDesc = computed(() => `loan${props.goalProgress > 1 || props.goalProgress === 0 ? 's' : ''} made`);

watch(() => props.loading, newVal => {
	if (!newVal) {
		if (goalProgressPercentage.value === COMPLETED_GOAL_THRESHOLD) {
			showConfetti();
			setHideGoalCardPreference();
		}
		if (!userHasGoal.value) {
			$kvTrackEvent(
				'portfolio',
				'view',
				'set-annual-goal'
			);
		} else if (userHasGoal.value && goalProgressPercentage.value !== COMPLETED_GOAL_THRESHOLD) {
			$kvTrackEvent('portfolio', 'show', 'goal-set', props.userGoal.category, props.userGoal.target);
		}
	}
});
</script>

<style lang="postcss" scoped>
.card-container {
	@apply tw-w-full tw-h-full tw-relative tw-rounded tw-shadow tw-p-1 md:tw-p-2 tw-flex tw-flex-col
		tw-overflow-hidden tw-bg-white tw-shrink-0;
}
</style>
