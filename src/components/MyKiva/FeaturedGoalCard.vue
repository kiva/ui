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
		>
			<div class="md:tw-hidden tw-pb-1 featured-goal-card__heading-row">
				<div class="featured-goal-card__tag">
					<KvIcon
						class="featured-goal-card__tag-icon tw-text-gray-400"
						name="annual-goal-flag"
					/>
					<h5 class="tw-text-secondary">
						Your {{ currentYear }} goal to support {{ categoryName }}
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
			<div class="featured-goal-card__content featured-goal-card__content--active">
				<div class="featured-goal-card__ring tw-relative tw-z-docked">
					<KvProgressCircle
						class="progress-circle"
						:stroke-width="20"
						:value="clampedPercentage"
						:max="goalTarget"
						:rotate="180"
						color="brand"
					/>
					<div class="progress-circle-content tw-hidden">
						<h5
							class="progress-value tw-text-center tw-flex tw-items-baseline"
							:class="progressValueClass"
							style="letter-spacing: -0.05rem;"
						>
							<h3>{{ activeCurrentProgress }}</h3>
							<span :class="shouldWrapProgressValues ? '' : 'tw-inline'">
								{{ shouldWrapProgressValues ? `/${goalTarget}` : ` / ${goalTarget}` }}
							</span>
						</h5>
						<p class="tw-font-book tw-text-secondary">
							Loans
						</p>
					</div>
				</div>
				<div class="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-center tw-gap-1.5 md:tw-gap-5">
					<div>
						<div class="featured-goal-card__heading-row tw-hidden md:tw-block">
							<div class="featured-goal-card__tag tw-pb-2">
								<KvIcon
									class="featured-goal-card__tag-icon tw-text-gray-400"
									name="annual-goal-flag"
								/>
								<h5 class="tw-text-secondary">
									Your {{ currentYear }} goal to support {{ categoryName }}
								</h5>
							</div>
						</div>
						<p class="featured-goal-card__title">
							{{ activeGoalTitle }}
						</p>
						<p class="featured-goal-card__description">
							{{ activeGoalDescription }}
						</p>
					</div>
					<KvButton
						class="feature-goal-card__cta--active-goal featured-goal-card__cta"
						variant="primary"
						v-kv-track-event="['portfolio', 'click', 'featured-continue-towards-goal']"
						@click="$emit('cta-click')"
					>
						{{ activeGoalCta }}
					</KvButton>
				</div>
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
	userName: {
		type: String,
		default: '',
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
	if (clampedPercentage.value === 0) {
		return 'Start with your first loan';
	}
	if (clampedPercentage.value < HALF_GOAL_THRESHOLD) {
		return 'You\'ve started something powerful.';
	}
	if (clampedPercentage.value === HALF_GOAL_THRESHOLD) {
		return 'You\'re half way there!';
	}
	if (clampedPercentage.value < COMPLETED_GOAL_THRESHOLD) {
		return 'You\'re close to the impact you imagined';
	}
	return `You did it, ${props.userName}! You made it happen`;
});

const activeGoalDescription = computed(() => {
	if (clampedPercentage.value === 0) {
		return 'Turn your intention into consistent impact.';
	}
	if (clampedPercentage.value < HALF_GOAL_THRESHOLD) {
		return 'Let\'s keep it growing together.';
	}
	if (clampedPercentage.value === HALF_GOAL_THRESHOLD) {
		return 'You\'ve made real progress and real impact. Keep it going.';
	}
	if (clampedPercentage.value < COMPLETED_GOAL_THRESHOLD) {
		return 'Continue creating opportunity for others. Finish strong!';
	}
	return `Achieving your goal means you've changed ${props.goalTarget} lives this year;`;
});

const activeGoalCta = computed(() => {
	if (goalCompleted.value) return 'See details';
	if (visibleProgress.value <= 0) return 'Get started';
	return 'Continue';
});

</script>

<style lang="postcss" scoped>
.featured-goal-card {
	@apply tw-relative tw-rounded-lg tw-shadow tw-bg-white tw-overflow-hidden;
	@apply tw-transition-shadow tw-duration-200 tw-w-full tw-px-1.5 tw-py-2.5 lg:tw-px-2 lg:tw-py-4;
	background-repeat: no-repeat;
	background-size: cover;
	background-position: right;
}

.featured-goal-card--no-goal {
	background-color: #F3F1EF;
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
	@apply tw-flex tw-items-center tw-justify-between tw-gap-1;
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
	@apply tw-z-docked;

	width: 100px;
	height: 100px;

	@screen md {
		width: 140px;
		height: 140px;
	}
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

.feature-goal-card__cta--active-goal {
	width: 100%;

	@screen md {
		width: 182px;
	}
}

.feature-goal-card__cta--active-goal :deep(span) {
	min-height: auto;
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
