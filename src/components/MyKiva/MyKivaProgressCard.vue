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
				<p
					class="progress-value tw-text-center tw-text-label"
					:class="shouldWrapProgressValues ? 'tw-flex tw-flex-col' : 'tw-whitespace-nowrap'"
				>
					<span>{{ currentProgress }}</span>
					<span
						v-if="target !== null"
						:class="shouldWrapProgressValues ? '' : 'tw-inline'"
					>
						{{ shouldWrapProgressValues ? `/${target}` : ` / ${target}` }}
					</span>
				</p>
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
				<p class="tw-text-secondary tw-text-label">
					{{ tag }}
				</p>
			</div>
			<button>
				<strong>
					{{ title }}
				</strong>
			</button>
			<p v-if="description" class="tw-text-caption">
				{{ description }}
			</p>
			<div v-if="btnCta" class="tw-w-full tw-flex tw-justify-end tw-mt-1">
				<KvButton class="text-link !tw-text-eco-green-3">
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
import { KvProgressCircle } from '@kiva/kv-components';
import { computed } from 'vue';
import KvIcon from '#src/components/Kv/KvIcon';
import KvButton from '#src/components/Kv/KvButton';
import {
	ID_WOMENS_EQUALITY, ID_BASIC_NEEDS, ID_CLIMATE_ACTION, ID_REFUGEE_EQUALITY, MAX_TIERED_BADGE_LOANS
} from '#src/composables/useBadgeData';
import { GOALS_CURRENT_YEAR } from '#src/composables/useGoalData';
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
	// Year shown in the annual-goal tag; historical tiles override this.
	year: {
		type: Number,
		default: () => GOALS_CURRENT_YEAR,
	},
	isHistoricalGoal: {
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
		return `Your ${props.year} goal`;
	}
	return props.goal.name;
});

const description = computed(() => {
	if (props.isHistoricalGoal) {
		const progress = props.goalProgress ?? 0;
		const total = goalTarget.value;
		const noun = total === 1 ? 'loan' : 'loans';
		return `Completed ${progress} of ${total} ${noun}`;
	}

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

const currentProgress = computed(() => {
	if (goalCompleted.value && props.isAnnualGoal) {
		return goalTarget.value;
	}

	if (props.isAnnualGoal) {
		return props.goalProgress;
	}

	if (!goalCompleted.value) {
		return props.goal?.totalLoans ?? props.goalProgress;
	}

	// Cap completed tiered badge display at max 100 (matching max loans needed for all tiers)
	const totalLoans = Math.min(props.goal?.totalLoans ?? 0, MAX_TIERED_BADGE_LOANS);
	return totalLoans > ONE_K_THRESHOLD ? numeral(totalLoans).format('0.0a') : totalLoans;
});

const target = computed(() => {
	if (goalCompleted.value && props.isAnnualGoal) {
		return goalTarget.value;
	}

	if (props.isAnnualGoal) {
		return goalTarget.value;
	}

	if (!goalCompleted.value) {
		return goalTarget.value;
	}

	return null;
});

// Space threshold in the ring
const hasMoreThanThreeDigits = value => Number(value) > 999;

const shouldWrapProgressValues = computed(() => {
	const targetHasMoreThanThreeDigits = target.value !== null && hasMoreThanThreeDigits(target.value);
	return hasMoreThanThreeDigits(currentProgress.value) || targetHasMoreThanThreeDigits;
});

const tag = computed(() => {
	return props.isAnnualGoal ? 'Annual goal' : 'Lifetime achievement';
});

const btnCta = computed(() => {
	if (props.isAnnualGoal && goalCompleted.value) return '';
	if (props.isHistoricalGoal) return '';
	const completedProgress = props.isAnnualGoal
		? (props.goalProgress ?? 0)
		: (props.goal?.totalLoans ?? props.goalProgress ?? 0);
	if (!goalCompleted.value && completedProgress <= 0) return 'Get started';
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
	width: 100%;
    max-width: 336px;
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

.progress-value {
	max-width: 55px;
}

.card-texture {
	left: -0.3rem;

	@apply tw--bottom-6 tw-w-15;
}

.card-texture--brand {
	bottom: -1.25rem;
}
</style>
