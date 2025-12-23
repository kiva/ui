<template>
	<div class="progress-card">
		<div class="tw-relative tw-z-docked">
			<KvProgressCircle
				class="progress-circle"
				:stroke-width="20"
				:value="goalProgressPercentage"
				:max="goalTarget"
				:rotate="180"
				:color="cardColor"
			/>
			<div
				class="progress-circle-content"
				:class="{'tw-mt-0.5' : goalCompleted && !isAnnualGoal}"
			>
				<h5 style="letter-spacing: -0.05rem;">
					{{ progress }}
				</h5>
				<p v-if="goalCompleted && !isAnnualGoal" class="tw-text-small">
					loans
				</p>
			</div>
		</div>
		<div class="tw-w-full">
			<div class="tw-flex tw-items-center tw-gap-0.5">
				<KvIcon
					class="tw-text-gray-400 tw-h-2 tw-w-2"
					:name="isAnnualGoal ? 'annual-goal-flag' : 'progress-checkmark'"
				/>
				<h5 class="tw-text-secondary">
					{{ tag }}
				</h5>
			</div>
			<p class="tw-font-medium">
				{{ title }}
			</p>
			<p class="tw-text-small">
				{{ description }}
			</p>
			<div class="tw-w-full tw-flex tw-justify-end tw-mt-1">
				<KvButton class="text-link tw-font-medium !tw-text-eco-green-3">
					{{ btnCta }}
				</KvButton>
			</div>
		</div>
		<img
			:class="['tw-absolute tw-z-2', 'card-texture', `card-texture--${cardColor}`]"
			alt="Card color decorative stain"
			:src="bgCardImages(`${cardColor}.png`)"
		>
	</div>
</template>

<script setup>
import KvProgressCircle from '#src/components/Kv/KvProgressCircle';
import { computed } from 'vue';
import KvIcon from '#src/components/Kv/KvIcon';
import KvButton from '#src/components/Kv/KvButton';
import {
	ID_WOMENS_EQUALITY, ID_BASIC_NEEDS, ID_CLIMATE_ACTION, ID_REFUGEE_EQUALITY
} from '#src/composables/useBadgeData';
import numeral from 'numeral';
import { metaGlobReader } from '#src/util/importHelpers';

const bgCardImgRequire = import.meta.glob('/src/assets/images/my-kiva/goal-progress-texture/*.*', { eager: true });
const bgCardImages = metaGlobReader(bgCardImgRequire, '/src/assets/images/my-kiva/goal-progress-texture/');

const COMPLETED_GOAL_THRESHOLD = 100;
const ONE_K_THRESHOLD = 1000;

const props = defineProps({
	goal: {
		type: Object,
		required: true,
	},
	goalProgress: {
		type: Number,
		required: true,
	},
	isAnnualGoal: {
		type: Boolean,
		default: false,
	},
});

const goalProgressPercentage = computed(() => {
	// Annual goals: progress based on overall target
	if (props.isAnnualGoal) {
		if (!props.goal?.target || props.goalProgress <= 0) return 0;
		return Math.min(
			Math.round((props.goalProgress / props.goal.target) * 100),
			COMPLETED_GOAL_THRESHOLD
		);
	}

	// Non-annual badge goals: ring percent based on current tier target
	const tierTarget = props.goal?.tierTarget || 0;
	const totalLoans = props.goal?.totalLoans ?? 0;
	if (!tierTarget || totalLoans <= 0) return 0;
	return Math.min(
		Math.round((totalLoans / tierTarget) * 100),
		COMPLETED_GOAL_THRESHOLD
	);
});

const goalTarget = computed(() => {
	if (props.goal?.nextAchievementAt > 0) {
		return props.goal?.tierTarget;
	}
	return props.goal?.target || 0;
});

const goalCompleted = computed(() => {
	return props.goalProgress >= goalTarget.value;
});

const goalRemainingLoans = computed(() => {
	const inProgress = props.goal?.totalLoans ?? props.goalProgress;
	return Math.max(goalTarget.value - inProgress, 0);
});

const title = computed(() => {
	if (props.isAnnualGoal) {
		return 'Your goal';
	}
	return props.goal.name;
});

const description = computed(() => {
	if (props.isAnnualGoal && goalCompleted.value) {
		return 'You’ve completed your goal!';
	}

	if (props.isAnnualGoal) {
		if (goalRemainingLoans.value === 1) {
			return `${goalRemainingLoans.value} loan to complete your goal.`;
		}
		return `${goalRemainingLoans.value} loans to complete your goal.`;
	}

	if (goalCompleted.value) {
		return 'All badges earned!';
	}

	// eslint-disable-next-line max-len
	return `${props.goal?.nextAchievementAt ?? 0} loan${props.goal?.nextAchievementAt !== 1 ? 's' : ''} to unlock next badge.`;
});

const progress = computed(() => {
	if (goalCompleted.value && props.isAnnualGoal) {
		return `${goalTarget.value} / ${goalTarget.value}`;
	}

	if (props.isAnnualGoal) {
		return `${props.goalProgress} / ${goalTarget.value}`;
	}

	if (!goalCompleted.value) {
		const currentProgress = props.goal?.totalLoans ?? props.goalProgress;
		return `${currentProgress} / ${goalTarget.value}`;
	}
	// eslint-disable-next-line max-len
	return props.goal?.totalLoans > ONE_K_THRESHOLD ? numeral(props.goal?.totalLoans ?? 0).format('0.0a') : props.goal?.totalLoans ?? 0;
});

const tag = computed(() => {
	return props.isAnnualGoal ? '2026 annual goal' : 'Lifetime achievement';
});

const btnCta = computed(() => {
	if (props.isAnnualGoal && goalCompleted.value) return '';
	return goalCompleted.value ? 'See details' : 'Continue';
});

const cardColor = computed(() => {
	if (props.isAnnualGoal) {
		return 'brand';
	}
	if (props.goal.category === ID_WOMENS_EQUALITY) {
		return 'marigold';
	}
	if (props.goal.category === ID_CLIMATE_ACTION) {
		return 'eco-green-3';
	}

	if (props.goal.category === ID_REFUGEE_EQUALITY) {
		return 'danger-highlight';
	}
	if (props.goal.category === ID_BASIC_NEEDS) {
		return 'stone-3';
	}
	return 'eco-green-2';
});

</script>

<style lang="postcss" scoped>
.progress-card {
	width: 336px;
	height: 112px;

	@apply tw-flex tw-bg-white tw-p-1 tw-shadow tw-rounded-md tw-gap-2.5;
}

.progress-circle, .progress-circle-content {
	width: 72px;
	height: 72px;
}

.progress-circle-content {
	@apply tw-absolute tw-flex tw-flex-col tw-items-center tw-justify-center tw-inset-0;
}

.card-texture {
	left: -0.3rem;

	@apply tw--bottom-6 tw-w-15;
}

.card-texture--brand {
	bottom: -1.25rem;
}
</style>
