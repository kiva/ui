<template>
	<KvLoadingPlaceholder
		v-if="loading"
		class="featured-goal-card__loading !tw-rounded-lg tw-w-full"
		aria-busy="true"
	/>
	<div
		v-else
		class="tw-bg-white tw-rounded-lg tw-shadow tw-transition-shadow tw-duration-200 tw-p-1
			hover:tw-shadow focus-within:tw-shadow"
	>
		<section
			class="featured-goal-card tw-relative tw-w-full tw-rounded-md tw-overflow-hidden
				tw-px-1 md:tw-px-3 tw-pt-1 tw-pb-4.5 md:!tw-py-2.5
				tw-bg-no-repeat tw-bg-cover"
			:class="[
				`featured-goal-card--${resolvedState}`,
				{ '!tw-py-3 md:!tw-py-4 md:!tw-px-2': resolvedState === STATE_NO_GOAL,
					'tw-bg-bottom' : resolvedState === STATE_NO_GOAL,
					'tw-bg-right': resolvedState === STATE_ACTIVE_GOAL
				},
			]"
		>
			<!-- No goal -->
			<div
				v-if="resolvedState === STATE_NO_GOAL"
				class="featured-goal-card__content--no-goal tw-flex tw-flex-col"
			>
				<div class="tw-flex tw-flex-col md:tw-w-full">
					<h3 class="tw-text-title tw-pb-1" v-html="noGoalTitle"></h3>
					<p
						class="tw-text-small md:tw-text-base tw-pb-3 md:tw-pb-2"
						v-html="noGoalSubtitle"
					>
					</p>
					<KvButton
						class="featured-goal-card__cta featured-goal-card__cta--set-goal tw-w-full"
						variant="primary"
						v-kv-track-event="['portfolio', 'click', 'set-a-goal']"
						@click="$emit('set-goal-click')"
					>
						Set {{ GOALS_CURRENT_YEAR }} goal
					</KvButton>
				</div>
			</div>

			<!-- Active goal -->
			<div v-else-if="resolvedState === STATE_ACTIVE_GOAL">
				<div
					class="tw-flex tw-items-center tw-justify-between tw-gap-1 tw-pb-1
						tw-absolute tw-right-0 tw-px-1.5 tw-w-full md:tw-w-fit"
				>
					<div class="tw-flex tw-items-baseline tw-gap-0.5 md:!tw-hidden">
						<KvIcon
							class="tw-w-2 tw-h-2 tw-text-gray-400"
							name="annual-goal-flag"
						/>
						<h5 class="tw-text-label tw-text-secondary">
							Your {{ GOALS_CURRENT_YEAR }} goal to support {{ categoryName }}
						</h5>
					</div>
					<KvUtilityMenu
						v-if="!goalCompleted"
						menu-position="right-aligned"
						button-size="small"
						menu-border-class="tw-border tw-border-tertiary tw-rounded-md"
						class="tw-top-0 tw-right-0 md:tw--mt-1.5"
					>
						<ul class="tw-m-0 tw-p-0">
							<li
								v-for="action in menuActions"
								:key="action.label"
								class="tw-list-none"
							>
								<button
									class="tw-w-full tw-px-2 tw-py-2 tw-rounded-md
										hover:tw-bg-secondary tw-font-medium tw-text-left"
									@click.prevent="onSelect(action)"
								>
									{{ action.label }}
								</button>
							</li>
						</ul>
					</KvUtilityMenu>
				</div>

				<div
					class="tw-flex tw-flex-row tw-items-center tw-gap-1.5 md:tw-gap-2 tw-w-full tw-pt-6 md:tw-pt-0"
				>
					<div class="tw-relative tw-shrink-0">
						<KvProgressCircle
							class="featured-goal-card__progress-ring tw-z-docked"
							:stroke-width="20"
							:value="clampedPercentage"
							:max="goalTarget"
							:rotate="180"
							color="brand"
						/>
						<div class="tw-absolute tw-inset-0 tw-flex tw-flex-col tw-items-center tw-justify-center">
							<p
								class="featured-goal-card__progress-value tw-flex tw-items-baseline tw-justify-center"
								:class="progressValueWrapClass"
							>
								<span class="featured-goal-card__visible-progress">{{ visibleProgress }}</span>
								<span
									style="font-size: 1rem"
									class="tw-text-secondary"
								>
									/{{ goalTarget }}
								</span>
							</p>
							<p class="tw-text-small tw-text-secondary">
								Loans
							</p>
						</div>
					</div>

					<div
						class="tw-flex tw-flex-col tw-gap-1.5 md:tw-flex-row md:tw-items-center md:tw-gap-3 tw-flex-1"
					>
						<div class="featured-goal-card__active-body tw-flex tw-flex-col tw-gap-0.5 tw-flex-1">
							<div class="tw-items-baseline tw-gap-0.5 tw-pb-2 tw-hidden md:tw-flex">
								<KvIcon
									class="tw-w-2 tw-h-2 tw-text-gray-400"
									name="annual-goal-flag"
								/>
								<h5 class="tw-text-label tw-text-secondary">
									Your {{ GOALS_CURRENT_YEAR }} goal to support {{ categoryName }}
								</h5>
							</div>
							<h3 class="tw-text-title">
								{{ activeGoalTitle }}
							</h3>
							<p class="tw-text-small md:tw-text-base">
								{{ activeGoalDescription }}
							</p>
						</div>

						<KvButton
							class="featured-goal-card__cta featured-goal-card__cta--active-goal tw-w-full"
							variant="primary"
							@click="handleActiveGoalCtaClick"
						>
							{{ activeGoalCta }}
						</KvButton>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import {
	computed, inject, ref, watch,
} from 'vue';
import {
	KvButton, KvLoadingPlaceholder, KvProgressCircle, KvUtilityMenu,
} from '@kiva/kv-components';
import KvIcon from '#src/components/Kv/KvIcon';
import goalCopy from '#src/util/goalCopy';
import { GOALS_CURRENT_YEAR } from '#src/composables/useGoalData';
import { showConfetti } from '#src/util/animation/confettiUtils';

const HALF_GOAL_THRESHOLD = 50;
const COMPLETED_GOAL_THRESHOLD = 100;

const STATE_NO_GOAL = 'no-goal';
const STATE_ACTIVE_GOAL = 'active-goal';
const VALID_STATES = [STATE_NO_GOAL, STATE_ACTIVE_GOAL];

const props = defineProps({
	state: {
		type: String,
		default: 'no-goal',
		validator: value => ['no-goal', 'active-goal'].includes(value),
	},
	loading: {
		type: Boolean,
		default: false,
	},
	goalTarget: {
		type: Number,
		default: 0,
	},
	goalProgress: {
		type: Number,
		default: 0,
	},
	goalProgressPercentage: {
		type: Number,
		default: 0,
	},
	categoryName: {
		type: String,
		default: '',
	},
	userName: {
		type: String,
		default: '',
	},
	suppressCompletionConfetti: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['set-goal-click', 'cta-click', 'edit-click']);

const menuActions = [
	{ label: 'Edit', value: 'edit-goal' },
];

const resolvedState = computed(() => (
	VALID_STATES.includes(props.state) ? props.state : STATE_NO_GOAL
));

const noGoalTitle = goalCopy.titleNoGoalYetWomensDefault();
const noGoalSubtitle = goalCopy.subtitleNoGoalYetEntrypoint();

const visibleProgress = computed(() => Math.min(props.goalProgress, props.goalTarget));

const clampedPercentage = computed(() => Math.min(
	Math.max(props.goalProgressPercentage, 0),
	COMPLETED_GOAL_THRESHOLD,
));

const goalCompleted = computed(() => (
	visibleProgress.value >= props.goalTarget && props.goalTarget > 0
));

const hasManyDigits = computed(() => (
	visibleProgress.value > 999 || props.goalTarget > 999
));

const progressValueWrapClass = computed(() => (
	hasManyDigits.value ? 'tw-flex-col tw-items-center' : null
));

const activeGoalTitle = computed(() => {
	if (clampedPercentage.value === 0) return 'Start with your first loan';
	if (clampedPercentage.value < HALF_GOAL_THRESHOLD) return 'You\'ve started something powerful.';
	if (clampedPercentage.value === HALF_GOAL_THRESHOLD) return 'You\'re half way there!';
	if (clampedPercentage.value < COMPLETED_GOAL_THRESHOLD) return 'You\'re close to the impact you imagined';
	return `You did it, ${props.userName}! You made it happen`;
});

const activeGoalDescription = computed(() => {
	const pct = clampedPercentage.value;
	if (pct === 0) return 'Turn your intention into consistent impact.';
	if (pct < HALF_GOAL_THRESHOLD) return 'Let\'s keep it growing together.';
	if (pct === HALF_GOAL_THRESHOLD) {
		return 'You\'ve made real progress and real impact. Keep it going.';
	}
	if (pct < COMPLETED_GOAL_THRESHOLD) {
		return 'Continue creating opportunity for others. Finish strong!';
	}
	return `Achieving your goal means you've changed ${props.goalTarget} lives this year.`;
});

const activeGoalCta = computed(() => {
	if (goalCompleted.value) return 'View your achievements';
	return 'Work toward your goal';
});

const $kvTrackEvent = inject('$kvTrackEvent');

const handleActiveGoalCtaClick = () => {
	// Fire a distinct label when the user reaches the completed celebration so
	// analytics can separate "still working on it" from "viewing achievements."
	$kvTrackEvent?.(
		'portfolio',
		'click',
		goalCompleted.value ? 'goal-complete-view-achievements' : 'continue-towards-goal',
	);
	emit('cta-click');
};

const onSelect = action => {
	if (action.value === 'edit-goal') {
		$kvTrackEvent?.('portfolio', 'click', 'edit-goal');
		emit('edit-click');
	}
};

const hasFiredCompletionConfetti = ref(false);

const fireCompletionConfettiIfReady = () => {
	if (
		hasFiredCompletionConfetti.value
		|| props.loading
		|| props.suppressCompletionConfetti
		|| clampedPercentage.value !== COMPLETED_GOAL_THRESHOLD
	) {
		return;
	}
	hasFiredCompletionConfetti.value = true;
	showConfetti();
};

watch(
	() => [props.loading, props.suppressCompletionConfetti, clampedPercentage.value],
	fireCompletionConfettiIfReady,
	{ immediate: true }
);
</script>

<style lang="postcss" scoped>

.tw-text-title {
	font-size: 1rem;

	@screen md {
		font-size: 1.25rem;
	}
}

.tw-text-label {
	font-size: 0.875rem;

	@screen md {
		font-size: 1rem;
	}
}

.featured-goal-card__visible-progress {
	@apply tw-font-medium tw-text-h3;

	font-size: 1.25rem;

	@screen md {
		font-size: 1.625rem;
	}
}

.featured-goal-card {
	@apply tw-bg-gray-50;
}

.featured-goal-card__loading {
	height: 196px;
}

.featured-goal-card__content--no-goal {
	width: 175px;
}

@screen md {
	.featured-goal-card__content--no-goal {
		@apply tw-w-full;
	}
}

.featured-goal-card__active-body {
	max-width: 399px;
}

.featured-goal-card__progress-ring {
	@apply tw-w-12.5 tw-h-12.5;
}

.featured-goal-card__progress-ring :deep(circle.tw-text-primary-inverse) {
	@apply tw-text-gray-200;
}

.featured-goal-card__progress-value {
	letter-spacing: -0.05rem;
}

.featured-goal-card__cta:active {
	transform: translateY(1px);
}

@screen md {
	.featured-goal-card__progress-ring {
		width: 140px;
		height: 140px;
	}

	.featured-goal-card__cta--set-goal {
		width: 304px;
	}

	.featured-goal-card__cta--active-goal {
		width: 220px;
	}
}

@screen lg {
	.featured-goal-card__cta--active-goal {
		width: 286px;
	}
}

.featured-goal-card__cta :deep(span > span) {
	@apply !tw-px-0;
}

/* State-conditional background images */
.featured-goal-card--no-goal {
	background-image: url('/src/assets/images/my-kiva/featured-goal-card/mobile-no-goal-state.png');
}

.featured-goal-card--active-goal {
	background-image: url('/src/assets/images/my-kiva/featured-goal-card/mobile-in-progress-state.png');
}

@screen md {
	.featured-goal-card--no-goal {
		background-image: url('/src/assets/images/my-kiva/featured-goal-card/no-goal-state.png');
	}

	.featured-goal-card--active-goal {
		background-image: url('/src/assets/images/my-kiva/featured-goal-card/in-progress-state.png');
	}
}
</style>
