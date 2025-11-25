<template>
	<div class="tw-min-h-screen lg:tw-min-h-full tw-mt-5">
		<button
			class="tw-flex tw-gap-1 tw-items-center tw-font-medium tw-mt-3 tw-mb-4"
		>
			<KvMaterialIcon
				:icon="mdiChevronLeft"
				class="tw-ml-0.5"
			/>
			To dashboard
		</button>
		<KvLoadingPlaceholder
			v-if="loading"
			class="!tw-rounded tw-mx-auto"
			style="max-width: 644px; min-height: 495px;"
		/>
		<div
			v-else
			class="tw-mx-auto"
			style="max-width: 644px;"
		>
			<GoalSelector
				class="goal-selector"
				v-if="!showCategories"
				:is-goal-set="isGoalSet"
				:categories-loan-count="categoriesLoanCount"
				:go-to-url="ctaHref"
				@set-goal-target="setTarget($event)"
				@set-goal="setGoal($event)"
				@edit-goal="editGoal"
			/>
			<div
				v-else
			>
				<h2 v-html="title" class="tw-mb-3 tw-text-center"></h2>
				<CategoryForm
					:categories="categories"
					:pre-selected-category="selectedCategory.id"
					@category-selected="handleCategorySelected"
				/>
				<div
					class="buttons tw-fixed lg:tw-static tw-bottom-0 tw-left-0 tw-flex tw-flex-col tw-justify-center
                        tw-w-full lg:tw-w-auto tw-z-sticky tw-gap-2 tw-mt-4 tw-bg-primary tw-p-2.5 lg:tw-p-0"
				>
					<KvButton
						class="tw-flex-none tw-mx-auto tw-w-full lg:tw-w-auto"
						style="min-width: 324px;"
						@click="handleClick"
					>
						Set 2026 goal
					</KvButton>
					<KvButton
						variant="ghost"
						class="edit-goal-button tw-flex-none tw-mx-auto tw-w-full lg:tw-w-auto"
						style="min-width: 324px;"
						@click="editGoalNumber"
					>
						Edit goal number
						<KvMaterialIcon
							:icon="mdiPencilOutline"
							class="tw-ml-0.5"
						/>
					</KvButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	ref,
	inject,
	onMounted,
	computed
} from 'vue';
import { useRouter } from 'vue-router';
import { mdiChevronLeft, mdiPencilOutline } from '@mdi/js';
import { KvLoadingPlaceholder, KvMaterialIcon, KvButton } from '@kiva/kv-components';
import GoalSelector from '#src/components/MyKiva/GoalSetting/GoalSelector';
import CategoryForm from '#src/components/MyKiva/GoalSetting/CategoryForm';
import useGoalData from '#src/composables/useGoalData';
import useBadgeData,
{
	ID_BASIC_NEEDS,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_US_ECONOMIC_EQUALITY,
	ID_WOMENS_EQUALITY,
	ID_SUPPORT_ALL,
} from '#src/composables/useBadgeData';
import womenImg from '#src/assets/images/my-kiva/goal-setting/women.svg?url';
import refugeesImg from '#src/assets/images/my-kiva/goal-setting/refugees.svg?url';
import climateActionImg from '#src/assets/images/my-kiva/goal-setting/climate-action.svg?url';
import usEntrepreneursImg from '#src/assets/images/my-kiva/goal-setting/us-entrepreneurs.svg?url';
import basicNeedsImg from '#src/assets/images/my-kiva/goal-setting/basic-needs.svg?url';
import supportAllImg from '#src/assets/images/my-kiva/goal-setting/support-all.svg?url';

const apollo = inject('apollo');
const router = useRouter();

const { getLoanFindingUrl } = useBadgeData();

const {
	userGoal,
	loadGoalData,
	storeGoalPreferences,
	loading,
	getGoalDisplayName,
} = useGoalData({ apollo });

const props = defineProps({
	totalLoans: {
		type: Number,
		default: 0,
	},
	categoriesLoanCount: {
		type: Object,
		default: () => ({}),
	},
});

const isGoalSet = ref(false);
const loanTarget = ref(0);
const showCategories = ref(false);

const categories = [
	{
		id: '1',
		name: 'Women',
		description: 'Open doors for women around the world',
		eventProp: 'women',
		customImage: womenImg,
		loanCount: props.categoriesLoanCount?.[ID_WOMENS_EQUALITY],
		title: 'women',
		badgeId: ID_WOMENS_EQUALITY,
	},
	{
		id: '2',
		name: 'Refugees',
		description: 'Transform the future for refugees',
		eventProp: 'refugees',
		customImage: refugeesImg,
		loanCount: props.categoriesLoanCount?.[ID_REFUGEE_EQUALITY],
		title: 'refugees',
		badgeId: ID_REFUGEE_EQUALITY,
	},
	{
		id: '3',
		name: 'Climate Action',
		description: 'Support the front lines of the climate crisis',
		eventProp: 'climate',
		customImage: climateActionImg,
		loanCount: props.categoriesLoanCount?.[ID_CLIMATE_ACTION],
		title: 'climate action',
		badgeId: ID_CLIMATE_ACTION,
	},
	{
		id: '4',
		name: 'U.S. Entrepreneurs',
		description: 'Support small businesses in the U.S.',
		eventProp: 'us-entrepreneur',
		customImage: usEntrepreneursImg,
		loanCount: props.categoriesLoanCount?.[ID_US_ECONOMIC_EQUALITY],
		title: 'US entrepreneurs',
		badgeId: ID_US_ECONOMIC_EQUALITY,
	},
	{
		id: '5',
		name: 'Basic Needs',
		description: 'Clean water, healthcare, and sanitation',
		eventProp: 'basic-needs',
		customImage: basicNeedsImg,
		loanCount: props.categoriesLoanCount?.[ID_BASIC_NEEDS],
		title: 'basic needs',
		badgeId: ID_BASIC_NEEDS,
	},
	{
		id: '6',
		name: 'Choose as I go',
		description: 'Support a variety of borrowers',
		eventProp: 'help-everyone',
		customImage: supportAllImg,
		loanCount: props.totalLoans,
		title: null,
		badgeId: ID_SUPPORT_ALL,
	}
];

const selectedCategory = ref(categories[0]);

const title = computed(() => {
	return `Make <span class="tw-text-eco-green-3">${loanTarget.value} loans</span> to...`;
});

const ctaHref = computed(() => {
	const categoryHeader = getGoalDisplayName(loanTarget.value, selectedCategory.value?.badgeId);
	const string = `Your goal: Support ${loanTarget.value} ${categoryHeader}`;
	const encodedHeader = encodeURIComponent(string);
	const loanFindingUrl = getLoanFindingUrl(selectedCategory.value?.badgeId, router.currentRoute.value);
	return `${loanFindingUrl}?header=${encodedHeader}`;
});

const editGoal = () => {
	showCategories.value = true;
};

const setTarget = target => {
	loanTarget.value = target;
};

const setGoal = async preferences => {
	await storeGoalPreferences(preferences);
	isGoalSet.value = true;
	showCategories.value = false;
};

const handleCategorySelected = categoryId => {
	const categoryIdx = categoryId - 1;
	selectedCategory.value = categories[categoryIdx];
};

const editGoalNumber = () => {
	showCategories.value = false;
	window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	// eslint-disable-next-line prefer-destructuring
	selectedCategory.value = categories[0];
};

const handleClick = () => {
	const categorySelected = selectedCategory.value?.badgeId;

	const currentYear = new Date().getFullYear();
	const goalName = `goal-${categorySelected}-${currentYear}`;
	const target = loanTarget.value;
	const dateStarted = new Date().toISOString();
	const status = 'in-progress';
	const loanTotalAtStart = selectedCategory.value?.loanCount || 0;

	const preferences = {
		goalName,
		category: ID_WOMENS_EQUALITY,
		target,
		dateStarted,
		status,
		loanTotalAtStart,
	};

	setGoal(preferences);
};

onMounted(async () => {
	await loadGoalData();
	const isEmptyGoal = Object.keys(userGoal.value || {}).length === 0;
	if (!isEmptyGoal) {
		isGoalSet.value = true;
	}
});
</script>

<style lang="postcss" scoped>
.edit-goal-button :deep(span) {
	@apply tw-flex;
}

.buttons {
    box-shadow: 0 0 12px 0 rgb(0, 0, 0, 8%);
    @screen lg {
        box-shadow: none;
    }
}

.goal-selector :deep(.buttons) {
    @apply tw-fixed lg:tw-static tw-bottom-0 tw-left-0 tw-z-sticky tw-bg-primary tw-p-2.5 lg:tw-p-0;

    box-shadow: 0 0 12px 0 rgb(0, 0, 0, 8%);
    @screen lg {
        box-shadow: none;
    }
}

.goal-selector :deep(button) {
    @apply tw-flex-none tw-mx-auto tw-w-auto;
    min-width: 324px;
}
</style>
