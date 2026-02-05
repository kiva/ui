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
					Set {{ yearToDate }} goal
				</KvButton>
			</div>
			<GoalProgressRing
				v-else
				variant="card"
				:goal-loans="goalLoans"
				:goal-progress="goalProgress"
				:goal-progress-percentage="goalProgressPercentage"
				:category-name="categoryName"
				@button-click="handleContinueClick"
			/>
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
import { COMPLETED_GOAL_THRESHOLD } from '#src/composables/useGoalData';
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
	}
});

defineEmits(['open-goal-modal']);

const $kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();
const goalData = inject('goalData');

const {
	getCtaHref,
	getGoalDisplayName,
	goalProgressPercentage,
	setHideGoalCardPreference,
} = goalData;

const userHasGoal = computed(() => !!props.userGoal && Object.keys(props.userGoal).length > 0);

const goalLoans = computed(() => {
	return props.userGoal?.target || 0;
});

const yearToDate = new Date().getFullYear();

const title = computed(() => {
	if (props.prevYearLoans === 1) {
		return `You helped <span class="tw-text-action"> ${props.prevYearLoans} woman</span><br>shape her future!`;
	}
	if (props.prevYearLoans > 1) {
		return `You helped <span class="tw-text-action"> ${props.prevYearLoans} women</span><br>shape their futures!`;
	}
	return 'Lenders like you help <span class="tw-text-action"> 3 women</span> a year';
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
	router.push(ctaHref.value);
};

watch(() => [props.loading, props.hideGoalCard], ([newLoading, newHideGoalCard], [oldLoading]) => {
	if (!newLoading && oldLoading && !newHideGoalCard) {
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
