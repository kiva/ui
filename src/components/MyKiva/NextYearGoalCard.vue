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
				<h4>LAST YEAR</h4>
				<h3 class="tw-text-center" v-if="prevYearLoans">
					You helped <span
						class="tw-text-action"
					> {{ prevYearLoans }} women</span><br>shape their futures!
				</h3>
				<h3 class="tw-text-center" v-else>
					Lenders helped <span
						class="tw-text-action"
					> 2 women</span> shape their futures!
				</h3>
				<p>How many loans will you make this year?</p>
				<img
					:src="HandsPlant"
					class=" tw-my-4 tw-w-14"
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
						class="tw-z-2"
						:stroke-width="20"
						:value="goalProgressPercentage"
						:max="goalLoans"
						:rotate="180"
						style="height: 170px; width: 170px;"
					/>
					<div class="tw-absolute tw-flex tw-flex-col tw-items-center tw-justify-center tw-inset-0 tw--mt-1">
						<h1>
							{{ goalProgress }}
						</h1>
						<p class="tw-text-secondary">
							{{ progressCircleDesc }}
						</p>
					</div>
				</div>
				<p v-html="progressDescription" class="tw-font-medium">
				</p>
				<KvButton
					class="tw-w-full"
					v-kv-track-event="['portfolio', 'click', 'continue-towards-goal']"
					@click="handleContinueClick"
				>
					Work towards your goal
				</KvButton>
			</div>
		</template>
	</div>
</template>

<script setup>

import {
	computed, watch, inject, onMounted
} from 'vue';
import {
	KvButton, KvLoadingPlaceholder
} from '@kiva/kv-components';
import useBadgeData from '#src/composables/useBadgeData';
import useGoalData from '#src/composables/useGoalData';
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

const { getLoanFindingUrl } = useBadgeData();
const { getGoalDisplayName } = useGoalData({});

const userHasGoal = computed(() => !!props.userGoal && Object.keys(props.userGoal).length > 0);

const goalLoans = computed(() => {
	return props.userGoal?.target || 0;
});

const goalProgressPercentage = computed(() => {
	if (!props.userGoal?.target || props.goalProgress <= 0) return 0;
	return Math.min(
		Math.round((props.goalProgress / props.userGoal.target) * 100),
		100
	);
});

const progressDescription = computed(() => {
	if (goalProgressPercentage.value === 0) {
		return 'Get started by making a loan!';
	} if (goalProgressPercentage.value > 0 && goalProgressPercentage.value < 50) {
		return 'You’ve started something powerful.<br>Let’s keep it growing together.';
	} if (goalProgressPercentage.value === 50) {
		return 'Halfway to your goal!<br>Every loan fuels a dream.';
	} if (goalProgressPercentage.value < 100) {
		return 'You’ve brought so many dreams<br>within reach. Finish strong!';
	}
	return `Incredible! You reached your 2026<br>goal and changed ${goalLoans.value} lives!`;
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

onMounted(() => {
	if (goalProgressPercentage.value === 100) {
		showConfetti();
	}
});
</script>

<style lang="postcss" scoped>
.card-container {
	@apply tw-w-full tw-h-full tw-relative tw-rounded tw-shadow tw-p-1 md:tw-p-2 tw-flex tw-flex-col
		tw-overflow-hidden tw-bg-white tw-shrink-0;
}
</style>
