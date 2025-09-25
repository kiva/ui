<template>
	<KvLightbox
		class="goal-setting-lightbox"
		title=""
		:visible="show"
		@lightbox-closed="closeLightbox"
	>
		<template #header>
			<h2 v-if="!isMobile" v-html="title" class="tw-mb-3 tw-text-center"></h2>
		</template>
		<h2 v-if="isMobile" v-html="title" class="tw-mb-3 tw-text-center"></h2>
		<component
			:is="contentComponent"
			:categories="categories"
			:pre-selected-category="selectedCategory.id"
			:selected-category="selectedCategory"
			:selected-goal-number="selectedGoalNumber"
			@category-selected="handleCategorySelected"
			@number-changed="handleNumberChanged"
		/>
		<template #controls>
			<div class="tw-flex tw-justify-end tw-gap-2">
				<KvButton v-if="formStep === 2" variant="secondary" @click="formStep -= 1">
					Back
				</KvButton>
				<KvButton @click="handleClick">
					{{ ctaCopy }}
				</KvButton>
			</div>
		</template>
	</KvLightbox>
</template>

<script setup>
import { KvLightbox, KvButton } from '@kiva/kv-components';
import {
	ref,
	defineProps,
	defineAsyncComponent,
	computed,
	inject,
} from 'vue';
import { MOBILE_BREAKPOINT } from '#src/composables/useBadgeModal';
import useIsMobile from '#src/composables/useIsMobile';
import {
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

const MAX_GOAL_LOANS = 50;

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
	totalLoans: {
		type: Number,
		default: 0,
	},
	categoriesLoanCount: {
		type: Object,
		default: () => ({}),
	}
});

const formStep = ref(1);
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
		name: 'Support All',
		description: 'Every loan makes real change',
		eventProp: 'help-everyone',
		customImage: supportAllImg,
		loanCount: props.totalLoans,
		title: null,
		badgeId: ID_SUPPORT_ALL,
	}
];

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);

const $kvTrackEvent = inject('$kvTrackEvent');
const emit = defineEmits(['close-goal-modal', 'set-goal']);
const selectedCategory = ref(categories[0]);
const selectedGoalNumber = ref(categories[0].loanCount > MAX_GOAL_LOANS ? MAX_GOAL_LOANS : categories[0].loanCount);

const CategoryForm = defineAsyncComponent(() => import('#src/components/MyKiva/GoalSetting/CategoryForm'));
const NumberChoice = defineAsyncComponent(() => import('#src/components/MyKiva/GoalSetting/NumberChoice'));

const contentComponent = computed(() => {
	switch (formStep.value) {
		case 2: return NumberChoice;
		case 1: default: return CategoryForm;
	}
});

const handleCategorySelected = categoryId => {
	const categoryIdx = categoryId - 1;
	$kvTrackEvent('portfolio', 'select', 'choose-goal-category', categories[categoryIdx]?.eventProp);
	selectedCategory.value = categories[categoryIdx];
	selectedGoalNumber.value = categories[categoryIdx]?.loanCount > MAX_GOAL_LOANS
		? MAX_GOAL_LOANS
		: categories[categoryIdx]?.loanCount;
};

const handleNumberChanged = number => {
	selectedGoalNumber.value = number;
};

const ctaCopy = computed(() => {
	return formStep.value === 1 ? 'Continue' : 'Set my goal';
});

const handleClick = () => {
	if (formStep.value === 1) {
		formStep.value += 1;
		$kvTrackEvent('portfolio', 'click', 'goal-setting-continue');
	} else {
		$kvTrackEvent('portfolio', 'click', 'set-goal-amount', selectedGoalNumber.value);
		const currentYear = new Date().getFullYear();
		const categorySelected = selectedCategory.value?.badgeId;
		const goalName = `goal-${categorySelected}-${currentYear}`;
		const target = selectedGoalNumber.value;
		const dateStarted = new Date().toISOString();
		const status = 'in-progress';
		const loanTotalAtStart = selectedCategory.value?.loanCount || 0;
		emit('set-goal', {
			goalName,
			category: categorySelected,
			target,
			dateStarted,
			status,
			loanTotalAtStart,
		});
	}
};

const title = computed(() => {
	if (formStep.value === 1) {
		return 'Choose one of Kiva’s key impact areas';
	}
	if (selectedCategory.value?.title) {
		return `How many more loans to ${selectedCategory.value?.title} will you support this year?`;
	}
	return 'How many more people will you support this year?';
});

const resetForm = () => {
	formStep.value = 1;
	selectedCategory.value = { ...categories[0] };
};

const closeLightbox = () => {
	emit('close-goal-modal');
	// Avoid showing category choice step when closing the modal
	setTimeout(() => {
		resetForm();
	}, 300);
};
</script>

<style lang="postcss" scoped>
  .goal-setting-lightbox :deep(h2) {
    @apply tw-text-h2;
  }
</style>
