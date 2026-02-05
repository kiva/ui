<template>
	<div class="tw-h-full tw-flex tw-flex-col tw-justify-between" :class="containerClass">
		<div :class="titleContainerClass">
			<h2 v-if="isModalVariant" class="tw-font-medium" :class="titleClass">
				{{ titleText }}
			</h2>
			<p v-else class="tw-font-medium" :class="titleClass">
				{{ titleText }}
			</p>
		</div>

		<div
			v-if="isModalVariant"
			class="tw-text-center tw-w-full tw-flex tw-justify-center tw-py-1"
		>
			<p
				v-if="hasProgress"
				class="modal-description-text tw-text-subhead !tw-font-medium" style="line-height: 1.5rem;"
			>
				You're already on your way to making
				<strong class="tw-text-brand">{{ goalLoans }} loans</strong> to
				<strong class="tw-text-brand">{{ categoryName?.toLowerCase() }}</strong> this year
			</p>
			<p
				v-else
				class="modal-description-text tw-text-subhead !tw-font-medium" style="line-height: 1.5rem;"
			>
				Your support to
				<strong class="tw-text-brand">{{ goalLoans }} loans</strong> for
				<strong class="tw-text-brand">{{ categoryName?.toLowerCase() }}</strong> for women begins here.
			</p>
		</div>

		<div class="tw-relative tw-z-docked tw-mx-auto tw-py-2.5">
			<KvProgressCircle
				class="tw-z-2 tw-py-0.5"
				:stroke-width="22"
				:value="goalProgressPercentage"
				:max="goalLoans"
				:rotate="180"
				style="height: 190px; width: 190px;"
			/>
			<div class="tw-absolute tw-flex tw-flex-col tw-items-center tw-justify-center tw-inset-0 tw--mt-1">
				<div class="tw-flex tw-items-baseline tw-justify-center tw-gap-0">
					<h1>{{ visibleGoalLoans }}</h1>
					<h2 class="tw-text-secondary">
						/{{ goalLoans }}
					</h2>
				</div>
				<p class="tw-text-secondary">
					{{ progressCircleDesc }}
				</p>
			</div>
		</div>

		<p
			v-if="!isModalVariant"
			v-html="descriptionText"
			class="tw-font-medium tw-py-1"
			style="line-height: 1.5rem;"
		>
		</p>

		<KvButton
			class="tw-w-full goal-set-button"
			v-kv-track-event="['portfolio', 'click', 'continue-towards-goal']"
			@click="handleButtonClick"
		>
			{{ buttonText }}
		</KvButton>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { KvButton } from '@kiva/kv-components';
import KvProgressCircle from '#src/components/Kv/KvProgressCircle';
import { COMPLETED_GOAL_THRESHOLD, HALF_GOAL_THRESHOLD } from '#src/composables/useGoalData';

const props = defineProps({
	/**
	 * Target number of loans for the goal
	 */
	goalLoans: {
		type: Number,
		required: true,
	},
	/**
	 * Current progress (number of loans made)
	 */
	goalProgress: {
		type: Number,
		default: 0,
	},
	/**
	 * Progress percentage (0-100)
	 */
	goalProgressPercentage: {
		type: Number,
		default: 0,
	},
	/**
	 * Category display name (e.g., "women", "basic needs")
	 */
	categoryName: {
		type: String,
		default: '',
	},
	/**
	 * Variant determines the text content and styling
	 * - 'card': Used in NextYearGoalCard (main page)
	 * - 'modal': Used in GoalSelector (success state after setting goal)
	 */
	variant: {
		type: String,
		default: 'card',
		validator: value => ['card', 'modal'].includes(value),
	},
});

const emit = defineEmits(['button-click']);

const yearToDate = new Date().getFullYear();

const visibleGoalLoans = computed(() => {
	return Math.min(props.goalProgress, props.goalLoans);
});

const progressCircleDesc = computed(() => {
	return `Loan${props.goalProgress > 1 || props.goalProgress === 0 ? 's' : ''}`;
});

// --- Variant-specific computed properties ---

const hasProgress = computed(() => props.goalProgress > 0);

const isModalVariant = computed(() => props.variant === 'modal');

const containerClass = computed(() => {
	return isModalVariant.value ? 'tw-text-center goal-modal-container' : 'tw-text-center';
});

const titleContainerClass = computed(() => {
	return isModalVariant.value ? 'tw-text-center' : 'tw-text-left';
});

const titleClass = computed(() => {
	return isModalVariant.value ? 'tw-text-center' : '';
});

const titleText = computed(() => {
	if (isModalVariant.value) {
		return 'Goal set!';
	}
	return `Your ${yearToDate} goal to ${props.categoryName?.toLowerCase() || ''}`;
});

// Card variant only
const descriptionText = computed(() => {
	if (props.goalProgressPercentage === 0) {
		return 'Get started by making a loan!';
	}
	if (props.goalProgressPercentage > 0 && props.goalProgressPercentage < HALF_GOAL_THRESHOLD) {
		return 'You\'ve started something powerful.<br>Let\'s keep it growing together.';
	}
	if (props.goalProgressPercentage === HALF_GOAL_THRESHOLD) {
		return 'Halfway to your goal!<br>Every loan fuels a dream.';
	}
	if (props.goalProgressPercentage < COMPLETED_GOAL_THRESHOLD) {
		return 'You\'ve brought so many dreams<br>within reach. Finish strong!';
	}
	return `Incredible! You reached your ${yearToDate} <br>goal and changed ${props.goalLoans} lives!`;
});

const buttonText = computed(() => {
	if (isModalVariant.value) {
		// Modal variant
		if (props.goalProgress > 0) {
			return 'Track my progress';
		}
		return 'Let\'s do this';
	}

	// Card variant
	if (props.goalProgressPercentage === COMPLETED_GOAL_THRESHOLD) {
		return 'View impact progress';
	}
	return 'Work towards your goal';
});

const handleButtonClick = () => {
	emit('button-click');
};
</script>

<style lang="postcss" scoped>
.goal-modal-container {
	.modal-description-text {
		line-height: 125%;

		@screen md {
			width: 60%;
		}
	}

	.goal-set-button {

		@apply tw-self-center tw-mt-2.5;

		@screen md {
			width: 78%;
		}
	}
}
</style>
