<template>
	<div class="tw-min-h-screen lg:tw-min-h-full md:tw-mt-5 tw-mt-2">
		<button
			class="tw-flex tw-gap-1 tw-items-center tw-font-medium tw-mb-4"
			@click="goToDashboard"
		>
			<KvMaterialIcon
				:icon="mdiChevronLeft"
				class="tw-ml-0.5"
			/>
			To dashboard
		</button>
		<KvLoadingPlaceholder
			v-if="loading || emailLoading"
			class="!tw-rounded tw-mx-auto"
			style="max-width: 644px; min-height: 495px;"
		/>
		<template v-else>
			<template v-if="isEmailFlow">
				<div
					class="tw-mx-auto tw-flex tw-flex-col tw-items-center"
					style="max-width: 644px;"
				>
					<GoalProgressRing
						v-if="hasActiveGoal"
						variant="modal"
						:goal-loans="userGoal.target"
						:goal-progress="goalProgress"
						:goal-progress-percentage="goalProgressPercentage"
						:is-existing-goal="!isNewGoal"
						:category-id="userGoal.category"
						:category-name="userGoal.category"
						:go-to-url="ctaHref"
						@button-click="handleEmailGoalContinue"
					/>
					<p
						v-else
						class="tw-text-center tw-text-secondary tw-mt-4"
					>
						No active goal found.
					</p>
					<KvButton
						v-if="hasActiveGoal"
						variant="ghost"
						class="edit-goal-button tw-w-full tw-mt-1.5"
						style="max-width: 324px;"
						href="#"
					>
						Edit goal
						<KvMaterialIcon
							:icon="mdiPencilOutline"
							class="tw-ml-0.5"
						/>
					</KvButton>
				</div>
			</template>

			<div
				v-else
				class="tw-mx-auto"
				style="max-width: 644px;"
			>
				<GoalSelector
					class="goal-selector"
					v-show="!showCategories"
					:is-goal-set="isGoalSet"
					:categories-loan-count="categoriesLoanCount"
					:tiered-achievements="tieredAchievements"
					:go-to-url="ctaHref"
					:is-editing="isEditing"
					:selected-category-id="selectedCategory.badgeId"
					:selected-category-name="selectedCategory.name"
					:goal-loans="loanTarget"
					tracking-category="event-tracking"
					@set-goal-target="setTarget($event)"
					@set-goal="setGoal($event)"
					@edit-goal="editGoalCategory"
				/>
				<div
					v-show="showCategories"
				>
					<h2
						class="tw-mb-3 tw-text-left lg:tw-text-center"
					>
						Choose an impact area
					</h2>
					<component
						v-show="showCategories"
						:is="contentComponent"
						:categories="categories"
						:pre-selected-category="selectedCategory.id"
						:selected-category="selectedCategory"
						:selected-goal-number="loanTarget"
						@category-selected="handleCategorySelected"
						@number-changed="handleNumberChanged"
					/>
					<div
						class="buttons tw-fixed lg:tw-static tw-bottom-0 tw-left-0 tw-flex tw-flex-col tw-justify-center
							tw-w-full lg:tw-w-auto tw-z-sticky lg:tw-z-auto tw-gap-1.5 tw-mt-4 tw-bg-primary
							tw-p-2.5 lg:tw-p-0"
					>
						<KvButton
							class="tw-flex-none tw-mx-auto tw-w-full lg:tw-w-auto"
							style="min-width: 324px;"
							@click="handleClick"
						>
							{{ ctaCopy }}
						</KvButton>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup>
import {
	ref,
	inject,
	onMounted,
	computed,
	defineAsyncComponent
} from 'vue';
import { useRouter } from 'vue-router';
import { mdiChevronLeft, mdiPencilOutline } from '@mdi/js';
import { KvLoadingPlaceholder, KvMaterialIcon, KvButton } from '@kiva/kv-components';
import GoalSelector from '#src/components/MyKiva/GoalSetting/GoalSelector';
import GoalProgressRing from '#src/components/MyKiva/GoalProgressRing';
import useGoalData, { GOAL_STATUS } from '#src/composables/useGoalData';
import { ID_SUPPORT_ALL } from '#src/composables/useBadgeData';

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();

const {
	userGoal,
	loadGoalData,
	storeGoalPreferences,
	loading,
	getCategories,
	getCtaHref,
	goalProgress,
	goalProgressPercentage,
	getLoanStatsByYear,
} = useGoalData({ apollo });

const props = defineProps({
	/**
	 * Target value passed via ?target= query param from an email link.
	 * When present, the component auto-creates a support-all goal and shows
	 * a confirmation state instead of the normal form flow.
	 */
	emailTarget: {
		type: String,
		default: null,
	},
	/**
	 * Total number of loans across all categories
	 */
	totalLoans: {
		type: Number,
		default: 0,
	},
	/**
	 * Object with loan counts per category
	 */
	categoriesLoanCount: {
		type: Object,
		default: () => ({}),
	},
	/**
	 * Tiered achievements data
	 */
	tieredAchievements: {
		type: Array,
		default: () => ([]),
	},
});

const isGoalSet = ref(false);
const loanTarget = ref(0);
const showCategories = ref(false);
const ctaHref = ref('');
const categoryFormKey = ref(0);
const isEditing = ref(false);
const formStep = ref(1);

// Email flow — always creates a support-all goal;
const emailLoading = ref(false);
const isNewGoal = ref(true);

function validateEmailTarget(param) {
	if (param == null || Array.isArray(param)) return null;
	const n = Number(param);
	if (!Number.isInteger(n) || n <= 0) return null;
	return n;
}

const validEmailTarget = computed(() => validateEmailTarget(props.emailTarget));
const isEmailFlow = computed(() => props.emailTarget != null);
const hasActiveGoal = computed(() => Object.keys(userGoal.value || {}).length > 0);

const CategoryForm = defineAsyncComponent(() => import('#src/components/MyKiva/GoalSetting/CategoryForm'));
const NumberChoice = defineAsyncComponent(() => import('#src/components/MyKiva/GoalSetting/NumberChoice'));

const categories = getCategories(props.categoriesLoanCount, props.totalLoans);

const selectedCategory = ref(categories[0]);

const contentComponent = computed(() => {
	switch (formStep.value) {
		case 2: return NumberChoice;
		case 1: default: return CategoryForm;
	}
});

const editGoalCategory = () => {
	// Force CategoryForm to re-render so it reverts to the default selected category
	categoryFormKey.value += 1;
	showCategories.value = true;
	isEditing.value = true;
	window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
};

const setTarget = target => {
	loanTarget.value = target;
};

const setGoal = async preferences => {
	await storeGoalPreferences(preferences);
	// For ID_SUPPORT_ALL, load yearly loan count to calculate correct progress
	let currentProgress = goalProgress.value;
	if (selectedCategory.value?.badgeId === ID_SUPPORT_ALL) {
		const stats = await getLoanStatsByYear(new Date().getFullYear(), 'network-only');
		currentProgress = stats?.count || 0;
	}
	// Use goalProgress to calculate remaining loans needed based on current year progress
	ctaHref.value = getCtaHref(
		loanTarget.value,
		selectedCategory.value?.badgeId,
		router,
		currentProgress
	);
	isGoalSet.value = true;
	showCategories.value = false;
};

const handleCategorySelected = categoryId => {
	const categoryIdx = categoryId - 1;
	selectedCategory.value = categories[categoryIdx];
	if (showCategories.value) {
		$kvTrackEvent(
			'event-tracking',
			'click',
			'choose-goal-category',
			selectedCategory.value?.eventProp
		);
	}
};

const handleClick = () => {
	if (isEditing.value) {
		isEditing.value = false;
		showCategories.value = false;
		formStep.value = 1;

		return;
	}
	const categorySelected = selectedCategory.value?.badgeId;

	const currentYear = new Date().getFullYear();
	const goalName = `goal-${categorySelected}-${currentYear}`;
	const target = loanTarget.value;
	const dateStarted = new Date().toISOString();
	const status = 'in-progress';

	const preferences = {
		goalName,
		category: categorySelected,
		target,
		dateStarted,
		status,
	};

	setGoal(preferences);

	$kvTrackEvent(
		'event-tracking',
		'click',
		'set-annual-goal',
		categorySelected,
		loanTarget.value
	);
};

const goToDashboard = () => {
	$kvTrackEvent('event-tracking', 'click', 'back-to-dashboard');
	router.push('/mykiva');
};

const handleEmailGoalContinue = () => {
	$kvTrackEvent('event-tracking', 'click', 'email-goal-continue');
	window.location.href = ctaHref.value;
};

const handleNumberChanged = () => {};

const yearToDate = new Date().getFullYear();

const ctaCopy = computed(() => {
	if (isEditing.value) {
		return 'Continue';
	}
	return `Set ${yearToDate} goal`;
});

onMounted(async () => {
	if (isEmailFlow.value) {
		emailLoading.value = true;
	}

	await loadGoalData({ yearlyProgress: true });

	if (isEmailFlow.value) {
		const isEmptyGoal = Object.keys(userGoal.value || {}).length === 0;

		if (isEmptyGoal && validEmailTarget.value) {
			const currentYear = new Date().getFullYear();
			await storeGoalPreferences({
				goalName: `goal-${ID_SUPPORT_ALL}-${currentYear}`,
				category: ID_SUPPORT_ALL,
				target: validEmailTarget.value,
				dateStarted: new Date().toISOString(),
				status: GOAL_STATUS.IN_PROGRESS,
			});
			isNewGoal.value = true;
		} else if (!isEmptyGoal) {
			isNewGoal.value = false;
		}

		if (userGoal.value?.target) {
			ctaHref.value = getCtaHref(
				userGoal.value.target,
				ID_SUPPORT_ALL,
				router,
				goalProgress.value
			);
		}

		emailLoading.value = false;
		$kvTrackEvent('event-tracking', 'view', 'goals-page-email');
		return;
	}

	const isEmptyGoal = Object.keys(userGoal.value || {}).length === 0;
	if (!isEmptyGoal) {
		const { target, category } = userGoal.value;
		loanTarget.value = target;
		const storedCategory = categories.find(c => c.badgeId === category);
		if (storedCategory) {
			selectedCategory.value = storedCategory;
		}
		ctaHref.value = getCtaHref(target, category, router, goalProgress.value);
		isGoalSet.value = true;
	}
	$kvTrackEvent('event-tracking', 'view', 'goals-page');
});
</script>

<style lang="postcss" scoped>
.buttons {
    box-shadow: 0 0 12px 0 rgb(0 0 0 / 8%);
    @screen lg {
        box-shadow: none;
    }
}

.goal-selector :deep(.buttons) {
    @apply tw-fixed lg:tw-static tw-bottom-0 tw-left-0 tw-z-sticky lg:tw-z-auto tw-bg-primary tw-p-2.5 lg:tw-p-0;

    box-shadow: 0 0 12px 0 rgb(0 0 0 / 8%);
    @screen lg {
        box-shadow: none;
    }
}

.edit-goal-button :deep(span) {
    @apply tw-flex;
}

.goal-selector :deep(button) {
    @apply tw-flex-none tw-mx-auto tw-w-full lg:tw-w-auto;

	min-width: 324px;
}
</style>
