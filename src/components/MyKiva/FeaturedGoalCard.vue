<template>
	<section
		class="featured-goal-card"
		:class="[
			`featured-goal-card--${resolvedState}`,
			{ 'featured-goal-card--loading': loading },
		]"
		:aria-busy="loading ? 'true' : 'false'"
	>
		<!-- Loading -->
		<div v-if="loading" class="featured-goal-card__loading">
			<KvLoadingPlaceholder class="tw-mb-2" style="height: 12px; width: 33%;" />
			<KvLoadingPlaceholder class="tw-mb-1.5" style="height: 20px; width: 66%;" />
			<KvLoadingPlaceholder class="tw-mb-3" style="height: 12px; width: 100%;" />
			<KvLoadingPlaceholder style="height: 24px; width: 160px;" />
		</div>

		<!-- No goal -->
		<div
			v-else-if="resolvedState === 'no-goal'"
			class="featured-goal-card__content"
		>
			<div class="featured-goal-card__text">
				<h3 class="featured-goal-card__title" v-html="goalCopy.titleNoHistoryWomensDefault()">
				</h3>
				<p class="featured-goal-card__description">
					{{ goalCopy.TITLE_HOW_MANY_LOANS_GENERIC }}
				</p>
				<KvButton
					class="feature-goal-card__cta--set-goal featured-goal-card__cta"
					variant="primary"
					v-kv-track-event="['portfolio', 'click', 'featured-set-a-goal']"
					@click="$emit('set-goal-click')"
				>
					Set {{ currentYear }} goal
				</KvButton>
			</div>
		</div>

		<!-- Active goal -->
		<div
			v-else-if="resolvedState === 'active-goal'"
			class="featured-goal-card__content featured-goal-card__content--active"
		>
			<div class="featured-goal-card__ring tw-relative tw-z-docked">
				<KvProgressCircle
					class="progress-circle"
					:stroke-width="20"
					:value="clampedPercentage"
					:max="goalTarget"
					:rotate="180"
					color="brand"
				/>
				<div class="progress-circle-content">
					<h5
						class="progress-value tw-text-center"
						:class="progressValueClass"
						style="letter-spacing: -0.05rem;"
					>
						<span>{{ activeCurrentProgress }}</span>
						<span :class="shouldWrapProgressValues ? '' : 'tw-inline'">
							{{ shouldWrapProgressValues ? `/${goalTarget}` : ` / ${goalTarget}` }}
						</span>
					</h5>
				</div>
			</div>
			<div class="featured-goal-card__text">
				<div class="featured-goal-card__heading-row">
					<div class="featured-goal-card__tag">
						<KvIcon
							class="featured-goal-card__tag-icon tw-text-gray-400"
							name="annual-goal-flag"
						/>
						<h5 class="tw-text-secondary">
							{{ currentYear }} annual goal
						</h5>
					</div>
					<button
						type="button"
						class="featured-goal-card__edit"
						aria-label="Edit goal"
						@click="$emit('edit-click')"
					>
						Edit
					</button>
				</div>
				<p class="featured-goal-card__title">
					{{ activeGoalTitle }}
				</p>
				<p class="featured-goal-card__description">
					{{ activeGoalDescription }}
				</p>
				<KvButton
					class="featured-goal-card__cta"
					variant="primary"
					v-kv-track-event="['portfolio', 'click', 'featured-continue-towards-goal']"
					@click="$emit('cta-click')"
				>
					{{ activeGoalCta }}
				</KvButton>
			</div>
		</div>

		<!-- Completed goal -->
		<div
			v-else
			class="featured-goal-card__content"
		>
			<div class="featured-goal-card__text">
				<p class="featured-goal-card__eyebrow featured-goal-card__eyebrow--celebrate">
					{{ currentYear }} annual goal · Complete
				</p>
				<h2 class="featured-goal-card__title">
					{{ completedTitle }}
				</h2>
				<p class="featured-goal-card__description">
					{{ completedDescription }}
				</p>
				<KvButton
					class="featured-goal-card__cta"
					variant="primary"
					v-kv-track-event="['portfolio', 'click', 'featured-view-impact']"
					@click="$emit('cta-click')"
				>
					View your impact
				</KvButton>
			</div>
		</div>
	</section>
</template>

<script setup>
import { computed } from 'vue';
import { KvButton, KvLoadingPlaceholder, KvProgressCircle } from '@kiva/kv-components';
import KvIcon from '#src/components/Kv/KvIcon';
import goalCopy from '#src/util/goalCopy';

const HALF_GOAL_THRESHOLD = 50;
const COMPLETED_GOAL_THRESHOLD = 100;

const props = defineProps({
	state: {
		type: String,
		default: 'no-goal',
		validator: value => ['no-goal', 'active-goal', 'completed-goal'].includes(value),
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
	copyVariant: {
		type: String,
		default: 'default',
	},
});

defineEmits(['set-goal-click', 'cta-click', 'edit-click']);

const resolvedState = computed(() => (
	['no-goal', 'active-goal', 'completed-goal'].includes(props.state) ? props.state : 'no-goal'
));

const currentYear = new Date().getFullYear();

const visibleProgress = computed(() => Math.min(props.goalProgress, props.goalTarget));

const clampedPercentage = computed(() => Math.min(
	Math.max(props.goalProgressPercentage, 0),
	COMPLETED_GOAL_THRESHOLD,
));

const goalCompleted = computed(() => visibleProgress.value >= props.goalTarget && props.goalTarget > 0);

const goalRemainingLoans = computed(() => Math.max(props.goalTarget - visibleProgress.value, 0));

const hasMoreThanThreeDigits = value => Number(value) > 999;

const shouldWrapProgressValues = computed(() => (
	hasMoreThanThreeDigits(visibleProgress.value) || hasMoreThanThreeDigits(props.goalTarget)
));

const progressValueClass = computed(() => (
	shouldWrapProgressValues.value
		? 'tw-flex tw-flex-col tw-leading-tight'
		: 'tw-whitespace-nowrap'
));

const activeCurrentProgress = computed(() => (
	goalCompleted.value ? props.goalTarget : visibleProgress.value
));

const activeGoalTitle = computed(() => {
	if (props.copyVariant === 'momentum') {
		return "You're building something powerful — keep going!";
	}
	if (goalCompleted.value) {
		return 'You reached your goal!';
	}
	if (clampedPercentage.value === 0) {
		return 'Your goal is set. Make your first loan to get started!';
	}
	if (clampedPercentage.value < HALF_GOAL_THRESHOLD) {
		return "You're off to a great start!";
	}
	if (clampedPercentage.value < COMPLETED_GOAL_THRESHOLD) {
		return 'Halfway there — finish strong!';
	}
	return "You're so close to your goal!";
});

const activeGoalDescription = computed(() => {
	if (goalCompleted.value) return 'You’ve completed your goal!';
	if (goalRemainingLoans.value === 1) return '1 loan to complete your goal.';
	return `${goalRemainingLoans.value} loans to complete your goal.`;
});

const activeGoalCta = computed(() => {
	if (goalCompleted.value) return 'See details';
	if (visibleProgress.value <= 0) return 'Get started';
	return 'Continue';
});

const completedTitle = computed(() => {
	if (props.copyVariant === 'year-end') {
		return `You did it! A ${currentYear} to remember.`;
	}
	return 'You reached your goal!';
});

const completedDescription = computed(() => {
	if (props.copyVariant === 'year-end') {
		return `Look back on the lives you helped change in ${currentYear}.`;
	}
	return `Incredible work. Celebrate the impact you made in ${currentYear}.`;
});
</script>

<style lang="postcss" scoped>
.featured-goal-card {
	@apply tw-relative tw-rounded-lg tw-shadow tw-bg-white tw-overflow-hidden;
	@apply tw-transition-shadow tw-duration-200 tw-w-full tw-px-1.5 tw-py-2.5 lg:tw-px-2 lg:tw-py-4;
	background-repeat: no-repeat;
	background-size: cover;
	background-color: #F3F1EF;
	background-position: bottom;
}

.featured-goal-card:hover {
	@apply tw-shadow;
}

.featured-goal-card:focus-within {
	@apply tw-shadow;
}

.featured-goal-card__loading {
	@apply tw-p-2 md:tw-p-3;
	min-height: 180px;
}

.featured-goal-card__content {
	width: 185px;
	@apply tw-flex tw-flex-col;

	@screen md {
		width: 100%;
	}
}

.featured-goal-card__text {
	@apply tw-flex tw-flex-col md:tw-w-full md:tw-gap-0.5 lg:tw-gap-1;
}

.featured-goal-card__heading-row {
	@apply tw-flex tw-items-start tw-justify-between tw-gap-1;
}

.featured-goal-card__eyebrow {
	@apply tw-text-small tw-font-medium tw-text-secondary tw-uppercase;
}

.featured-goal-card__eyebrow--celebrate {
	@apply tw-text-marigold;
}

.featured-goal-card__title {
	@apply tw-font-medium tw-text-primary;
}

.featured-goal-card__description {
	@apply tw-text-small md:tw-text-base;
}

.featured-goal-card__edit {
	@apply tw-text-small tw-text-action tw-font-medium tw-pt-0.5 tw-rounded;
}

.featured-goal-card__edit:hover {
	@apply tw-underline;
}

.featured-goal-card__edit:focus-visible {
	@apply tw-outline tw-outline-2 tw-outline-offset-2;
}

.featured-goal-card__content--active {
	@apply tw-flex tw-flex-row tw-items-center tw-gap-2;
	width: 100%;
}

.featured-goal-card__ring {
	flex-shrink: 0;
}

.progress-circle,
.progress-circle-content {
	width: 72px;
	height: 72px;
}

.progress-circle-content {
	@apply tw-absolute tw-flex tw-flex-col tw-items-center tw-justify-center tw-inset-0;
}

.progress-value {
	max-width: 55px;
}

.featured-goal-card__tag {
	@apply tw-flex tw-items-center tw-gap-0.5;
}

.featured-goal-card__tag-icon {
	height: 16px;
	width: 16px;
}

.featured-goal-card__cta {
	@apply tw-mt-1 md:tw-self-start;
	width: 100%;
}

@screen md {
	.featured-goal-card__cta {
		width: auto;
	}
}

.featured-goal-card__cta:active {
	transform: translateY(1px);
}

.feature-goal-card__cta--set-goal {
	width: 100%;

	@screen md {
		width: 304px;
	}
}

.featured-goal-card--no-goal:not(.featured-goal-card--loading) {
	background-image: url('src/assets/images/my-kiva/featured-goal-card/mobile-no-goal-state.svg');
}

.featured-goal-card--active-goal:not(.featured-goal-card--loading) {
	background-image: url('src/assets/images/my-kiva/featured-goal-card/mobile-in-progress-state.svg');
}

@screen md {
	.featured-goal-card--no-goal:not(.featured-goal-card--loading) {
		background-image: url('src/assets/images/my-kiva/featured-goal-card/no-goal-state.svg');
	}

	.featured-goal-card--active-goal:not(.featured-goal-card--loading) {
		background-image: url('src/assets/images/my-kiva/featured-goal-card/in-progress-state.svg');
	}
}

.featured-goal-card--completed-goal {
	background:
		linear-gradient(135deg, rgba(244, 181, 57, 0.16) 0%, rgba(255, 255, 255, 1) 60%),
		theme('colors.white');
}
</style>
