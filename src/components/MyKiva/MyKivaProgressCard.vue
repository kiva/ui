<template>
	<div class="progress-card">
		<div class="tw-relative tw-z-docked">
			<KvProgressCircle
				class="tw-z-2"
				:stroke-width="20"
				:value="goalProgressPercentage"
				:max="goalLoans"
				:rotate="180"
				style="height: 72px; width: 72px;"
				:color="cardColor"
			/>
			<div
				class="tw-absolute tw-flex tw-flex-col tw-items-center tw-justify-center tw-inset-0"
				:class="{'tw-mt-0.5' : goalCompleted && !isAnnualGoal}"
				style="height: 72px; width: 72px;"
			>
				<h5>
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
	if (!props.goal?.target || props.goalProgress <= 0) return 0;
	return Math.min(
		Math.round((props.goalProgress / props.goal.target) * 100),
		100
	);
});

const goalLoans = computed(() => {
	return props.goal?.target || 0;
});

const goalCompleted = computed(() => {
	return props.goalProgress >= goalLoans.value;
});

const goalRemainingLoans = computed(() => {
	return Math.max(goalLoans.value - props.goalProgress, 0);
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
		return `${goalRemainingLoans.value} loans to complete your goal.`;
	}

	if (goalCompleted.value) {
		return 'All badges earned!';
	}

	// eslint-disable-next-line max-len
	return `${props.goal?.nextAchievementAt ?? 0} loan${props.goal?.nextAchievementAt !== 1 ? 's' : ''} to unlock next badge.`;
});

const progress = computed(() => {
	if (props.isAnnualGoal || !goalCompleted.value) {
		return `${props.goalProgress} / ${goalLoans.value}`;
	}
	// eslint-disable-next-line max-len
	return props.goal?.totalLoans > 1000 ? numeral(props.goal?.totalLoans ?? 0).format('0.0a') : props.goal?.totalLoans ?? 0;
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

	@apply tw-flex tw-bg-white tw-p-1 tw-shadow tw-rounded-md tw-gap-2.5 tw-h-full;
}
</style>
