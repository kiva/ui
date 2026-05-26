<template>
	<div class="tw-h-full tw-flex tw-flex-col tw-justify-between" :class="containerClass">
		<div :class="titleContainerClass">
			<kv-material-icon
				v-if="isGoalTileExperimentEnabled && !isLarge && isModalVariant && !isUpdatingGoal"
				class="tw-w-3.5 tw-h-3.5 tw-text-brand tw-mx-auto tw-mb-2"
				:icon="mdiCheckCircle"
			/>
			<h2 v-if="isModalVariant" class="tw-font-medium" :class="titleClass">
				{{ titleText }}
			</h2>
			<p v-else class="tw-font-medium" :class="titleClass">
				{{ titleText }}
			</p>

			<button
				class="tw-flex tw-gap-0.5 tw-items-center tw-text-h5 hover:tw-underline tw-text-action tw-pt-0.5"
				v-if="!isModalVariant"
				@click="handleEditGoal"
			>
				Edit
				<KvMaterialIcon
					:icon="mdiPencilOutline"
					class="tw-text-action tw-w-1.5 tw-h-1.5"
				/>
			</button>
		</div>

		<div
			v-if="isModalVariant"
			class="tw-text-center tw-w-full tw-flex tw-justify-center tw-py-1"
		>
			<p
				v-html="modalVariantDescriptionText"
				class="modal-description-text tw-text-subhead !tw-font-medium" style="line-height: 1.5rem;"
			></p>
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
				<div
					class="tw-max-w-30 tw-flex tw-items-center tw-justify-center tw-gap-0"
					:class="useStackedProgressValue
						? 'tw-flex-col tw-pt-2'
						: 'tw-flex-row tw-items-baseline'"
				>
					<component :is="progressValueHeadingTag" class="tw-leading-none">
						{{ visibleGoalLoans }}
					</component>
					<component :is="goalTargetHeadingTag" class="tw-text-secondary tw-leading-tight">
						/{{ goalLoans }}
					</component>
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
			class="tw-w-full goal-button"
			v-kv-track-event="['portfolio', 'click', 'continue-towards-goal']"
			@click="handleButtonClick"
		>
			{{ buttonText }}
		</KvButton>
		<KvButton
			v-if="showEditGoalButton"
			variant="ghost"
			class="goal-button edit-goal-button tw-w-full"
			@click="handleEditGoalFromSettings"
		>
			Edit goal
			<KvMaterialIcon
				:icon="mdiPencilOutline"
				class="tw-ml-0.5 tw-w-2.5"
			/>
		</KvButton>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { mdiPencilOutline, mdiCheckCircle } from '@mdi/js';
import { useRouter } from 'vue-router';

import { KvButton, KvProgressCircle, KvMaterialIcon } from '@kiva/kv-components';
import { COMPLETED_GOAL_THRESHOLD, HALF_GOAL_THRESHOLD } from '#src/composables/useGoalData';
import goalCopy from '#src/util/goalCopy';
import {
	ID_SUPPORT_ALL,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_BASIC_NEEDS,
	ID_US_ECONOMIC_EQUALITY,
} from '#src/composables/useBadgeData';
import useBreakpoints from '#src/composables/useBreakpoints';

const STACKED_PROGRESS_DIGIT_THRESHOLD = 3;
const SMALL_HEADING_DIGIT_THRESHOLD = 5;

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
	 * Category ID (e.g., 'womens-equality', 'climate-action')
	 */
	categoryId: {
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
	/**
	 * URL to navigate to after button click
	 */
	goToUrl: {
		type: String,
		default: '',
	},
	/**
	 *  Loading state for goal data (used in GoalSelector after loading goal)
	 */
	loadingCurrentYear: {
		type: Boolean,
		default: false,
	},
	/**
	 * Flag to indicate if user is editing an existing goal
	 */
	isUpdatingGoal: {
		type: Boolean,
		default: false,
	},
	/**
	 * Flag to indicate if the goal has been completed
	 */
	isGoalCompleted: {
		type: Boolean,
		default: false,
	},
	/**
	 * Experiment flag to enable new goal tile design
	 */
	isGoalTileExperimentEnabled: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['button-click', 'edit-button-click', 'edit-goal-from-settings']);
const router = useRouter();
const { isLarge } = useBreakpoints();

const getDigitCount = value => String(value ?? 0).length;

const visibleGoalLoans = computed(() => {
	return Math.min(props.goalProgress, props.goalLoans);
});

const visibleGoalLoanDigits = computed(() => getDigitCount(visibleGoalLoans.value));
const goalTargetDigits = computed(() => getDigitCount(props.goalLoans));

const useStackedProgressValue = computed(() => {
	return visibleGoalLoanDigits.value >= STACKED_PROGRESS_DIGIT_THRESHOLD;
});

const progressValueHeadingTag = computed(() => (
	visibleGoalLoanDigits.value < SMALL_HEADING_DIGIT_THRESHOLD ? 'h1' : 'h2'
));

const goalTargetHeadingTag = computed(() => (
	goalTargetDigits.value < SMALL_HEADING_DIGIT_THRESHOLD ? 'h2' : 'h3'
));

const progressCircleDesc = computed(() => {
	if (props.goalLoans === 1) {
		return 'Loan';
	}
	return 'Loans';
});

// --- Variant-specific computed properties ---

const isModalVariant = computed(() => props.variant === 'modal');

const containerClass = computed(() => {
	return isModalVariant.value ? 'tw-text-center goal-modal-container' : 'tw-text-center';
});

const titleContainerClass = computed(() => {
	return isModalVariant.value ? 'tw-text-center' : 'tw-text-left tw-flex tw-justify-between tw-items-start tw-gap-1';
});

const titleClass = computed(() => {
	return isModalVariant.value ? 'tw-text-center' : '';
});

const modalVariantDescriptionText = computed(() => {
	const brandClass = 'class="tw-text-brand"';
	const loans = props.goalLoans;
	const loansTag = `<span ${brandClass}>${loans}</span>`;

	if (props.isGoalCompleted) {
		const suffix = 'and turning your commitment into impact.';
		if (props.categoryId === ID_SUPPORT_ALL) {
			return `Thank you for supporting ${loansTag} <span ${brandClass}>borrowers</span> ${suffix}`;
		}
		if (props.categoryId === ID_CLIMATE_ACTION) {
			return `Thank you for supporting ${loansTag} <span ${brandClass}>eco-friendly loans</span> ${suffix}`;
		}
		if (props.categoryId === ID_REFUGEE_EQUALITY) {
			return `Thank you for supporting ${loansTag} <span ${brandClass}>refugees</span> ${suffix}`;
		}
		if (props.categoryId === ID_BASIC_NEEDS) {
			return `Thank you for supporting ${loansTag} <span ${brandClass}>basic needs loans</span> ${suffix}`;
		}
		if (props.categoryId === ID_US_ECONOMIC_EQUALITY) {
			return `Thank you for supporting ${loansTag} <span ${brandClass}>U.S. entrepreneurs</span> ${suffix}`;
		}
		return `Thank you for supporting ${loansTag} <span ${brandClass}>women</span> ${suffix}`;
	}

	if (props.goalProgress > 0) {
		const strongTag = `<strong ${brandClass}>${loans} loans</strong>`;
		const prefix = 'You’re already on your way to making';
		if (props.categoryId === ID_SUPPORT_ALL) {
			return `${prefix} ${strongTag} this year.`;
		}
		if (props.categoryId === ID_CLIMATE_ACTION) {
			return `${prefix} <strong ${brandClass}>${loans} eco-friendly loans</strong> this year.`;
		}
		if (props.categoryId === ID_REFUGEE_EQUALITY) {
			return `${prefix} ${strongTag} to <strong ${brandClass}>refugees</strong> this year.`;
		}
		if (props.categoryId === ID_BASIC_NEEDS) {
			return `${prefix} ${strongTag} to <strong ${brandClass}>basic needs</strong> this year.`;
		}
		if (props.categoryId === ID_US_ECONOMIC_EQUALITY) {
			return `${prefix} ${strongTag} to <strong ${brandClass}>U.S. entrepreneurs</strong> this year.`;
		}
		return `${prefix} ${strongTag} to <strong ${brandClass}>women</strong> this year.`;
	}

	if (props.categoryId === ID_SUPPORT_ALL) {
		return `Your support to <span ${brandClass}>${loans} loans</span> begins here.`;
	}
	const formattedCategory = props.categoryId === ID_US_ECONOMIC_EQUALITY
		? props.categoryName
		: props.categoryName?.toLowerCase() || '';
	// eslint-disable-next-line max-len
	return `Your support to <span ${brandClass}>${loans} loans</span> for <span ${brandClass}>${formattedCategory}</span> begins here.`;
});

const titleText = computed(() => {
	if (props.isGoalCompleted && isModalVariant.value) {
		return goalCopy.RING_TITLE_GOAL_COMPLETED;
	}
	if (props.isUpdatingGoal) {
		return goalCopy.RING_TITLE_GOAL_UPDATED;
	}
	if (isModalVariant.value) {
		return goalCopy.RING_TITLE_GOAL_SET;
	}
	if (props.categoryId === ID_SUPPORT_ALL) {
		return goalCopy.RING_TITLE_SUPPORT_ALL_CARD;
	}
	if (props.categoryId === ID_US_ECONOMIC_EQUALITY) {
		return goalCopy.RING_TITLE_US_ENTREPRENEURS_CARD;
	}
	return goalCopy.ringTitleCategoryCard(props.categoryName?.toLowerCase() || '');
});

// Card variant only
const descriptionText = computed(() => {
	if (props.goalProgressPercentage === 0) {
		return goalCopy.RING_DESC_NOT_STARTED;
	}
	if (props.goalProgressPercentage > 0 && props.goalProgressPercentage < HALF_GOAL_THRESHOLD) {
		return goalCopy.RING_DESC_PROGRESS_BEGUN;
	}
	if (props.goalProgressPercentage === HALF_GOAL_THRESHOLD) {
		return goalCopy.RING_DESC_PROGRESS_HALFWAY;
	}
	if (props.goalProgressPercentage < COMPLETED_GOAL_THRESHOLD) {
		return goalCopy.RING_DESC_PROGRESS_ALMOST_DONE;
	}
	return goalCopy.ringDescProgressCompleted(props.goalLoans);
});

const buttonText = computed(() => {
	if (isModalVariant.value) {
		if (props.isGoalCompleted) {
			return goalCopy.RING_BUTTON_GOAL_COMPLETED;
		}
		// MyKiva modal: user already has progress, show tracking CTA
		if (props.goToUrl === '/mykiva' && props.goalProgress > 0) {
			return goalCopy.RING_BUTTON_HAS_PROGRESS_ON_MYKIVA;
		}
		return goalCopy.RING_BUTTON_NEW_GOAL;
	}

	// Card variant
	if (props.goalProgressPercentage === COMPLETED_GOAL_THRESHOLD) {
		return goalCopy.RING_BUTTON_CARD_GOAL_COMPLETED;
	}
	return goalCopy.RING_BUTTON_CARD_IN_PROGRESS;
});

const handleButtonClick = () => {
	emit('button-click');
};

const handleEditGoalFromSettings = () => {
	emit('edit-goal-from-settings');
};

const handleEditGoal = () => {
	emit('edit-button-click');
};

const showEditGoalButton = computed(() => {
	return !props.isGoalCompleted
		&& router?.currentRoute.value?.path?.includes('/goal-setting');
});

</script>

<style lang="postcss" scoped>
.goal-modal-container {
	.modal-description-text {
		line-height: 125%;

		@screen md {
			width: 80%;
		}
	}

	.goal-button {

		@apply tw-self-center tw-mt-2.5;

		@screen md {
			width: 78%;
		}
	}
}

.edit-goal-button :deep(span) {
	@apply tw-flex tw-items-center tw-justify-center;
}
</style>
