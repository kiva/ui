<template>
	<div
		class="card-container"
		:class="{'tw-gap-3': !!userHasGoal}"
	>
		<div v-if="!userHasGoal" class="tw-flex tw-flex-col tw-gap-1.5 tw-items-center">
			<h4>LAST YEAR</h4>
			<h2>
				You helped <span
					class="tw-text-action"
				> {{ prevYearLoans }} women</span><br>shape their futures!
			</h2>
			<p>How many loans will you make this year?</p>
			<NextYearGoalImg class="tw-my-4" />
			<KvButton
				class="tw-w-full"
				v-kv-track-event="['portfolio', 'click', 'set-a-goal']"
				@click="$emit('open-goal-modal')"
			>
				Set 2026 goal
			</KvButton>
		</div>
		<div v-else class="tw-flex tw-flex-col tw-gap-2.5 tw-text-center">
			<div class="tw-text-left">
				<p class="tw-font-medium">
					Your 2026 Goal
				</p>
				<p class="tw-text-secondary">
					{{ goalLoans }} loans to women
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
				<div class="tw-absolute tw-flex tw-flex-col tw-items-center tw-justify-center tw-inset-0 tw--mt-2">
					<h1>
						{{ goalProgress }}
					</h1>
					<p class="tw-text-secondary">
						loans made
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
	</div>
</template>

<script setup>

import {
	computed, watch, inject, onMounted
} from 'vue';
import {
	KvButton
} from '@kiva/kv-components';
import useBadgeData from '#src/composables/useBadgeData';
import useGoalData from '#src/composables/useGoalData';
import { useRouter } from 'vue-router';
import NextYearGoalImg from '#src/assets/images/my-kiva/goal-setting/next-year-goal.svg';
import KvProgressCircle from '#src/components/Kv/KvProgressCircle';
import confetti from 'canvas-confetti';

const props = defineProps({
	userGoal: {
		type: Object,
		default: undefined,
	},
	goalProgress: {
		type: Number,
		default: 0,
	},
	prevYearLoans: {
		type: Number,
		default: 0,
	}
});

defineEmits(['open-goal-modal']);

const $kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();

const { getLoanFindingUrl } = useBadgeData();
const { getGoalDisplayName } = useGoalData({});

const userHasGoal = computed(() => !!props.userGoal);

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

const ctaHref = computed(() => {
	const categoryHeader = getGoalDisplayName(props.userGoal?.target, props.userGoal?.category);
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

watch(() => props.userGoal, (newVal, oldVal) => {
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
