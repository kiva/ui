<template>
	<KvLightbox
		class="goal-setting-lightbox"
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
			:selected-category-loan-count="selectedCategoryLoanCount"
			@category-selected="handleCategorySelected"
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
	ID_WOMENS_EQUALITY
} from '#src/composables/useBadgeData';
import womenImg from '#src/assets/images/my-kiva/goal-setting/women.svg?url';
import refugeesImg from '#src/assets/images/my-kiva/goal-setting/refugees.svg?url';
import climateActionImg from '#src/assets/images/my-kiva/goal-setting/climate-action.svg?url';
import usEntrepreneursImg from '#src/assets/images/my-kiva/goal-setting/us-entrepreneurs.svg?url';
import basicNeedsImg from '#src/assets/images/my-kiva/goal-setting/basic-needs.svg?url';
import supportAllImg from '#src/assets/images/my-kiva/goal-setting/support-all.svg?url';

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
		title: props.categoriesLoanCount?.[ID_WOMENS_EQUALITY] > 1 ? 'women' : 'woman',
	},
	{
		id: '2',
		name: 'Refugees',
		description: 'Transform the future for refugees',
		eventProp: 'refugees',
		customImage: refugeesImg,
		loanCount: props.categoriesLoanCount?.[ID_REFUGEE_EQUALITY],
		title: `refugee${props.categoriesLoanCount?.[ID_REFUGEE_EQUALITY] > 1 ? 's' : ''}`,
	},
	{
		id: '3',
		name: 'Climate Action',
		description: 'Support the front lines of the climate crisis',
		eventProp: 'climate',
		customImage: climateActionImg,
		loanCount: props.categoriesLoanCount?.[ID_CLIMATE_ACTION],
		title: props.categoriesLoanCount?.[ID_CLIMATE_ACTION] > 1 ? 'people' : 'person',
	},
	{
		id: '4',
		name: 'U.S. Entrepreneurs',
		description: 'Support small businesses in the U.S.',
		eventProp: 'us-entrepreneur',
		customImage: usEntrepreneursImg,
		loanCount: props.categoriesLoanCount?.[ID_US_ECONOMIC_EQUALITY],
		title: props.categoriesLoanCount?.[ID_CLIMATE_ACTION] > 1 ? 'people' : 'person',
	},
	{
		id: '5',
		name: 'Basic Needs',
		description: 'Clean water, healthcare, and sanitation',
		eventProp: 'basic-needs',
		customImage: basicNeedsImg,
		loanCount: props.categoriesLoanCount?.[ID_BASIC_NEEDS],
		title: props.categoriesLoanCount?.[ID_BASIC_NEEDS] > 1 ? 'people' : 'person',
	},
	{
		id: '6',
		name: 'Support All',
		description: 'Every loan makes real change',
		eventProp: 'help-everyone',
		customImage: supportAllImg,
		loanCount: props.totalLoans,
		title: props.totalLoans > 1 ? 'people' : 'person',
	}
];

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);

const $kvTrackEvent = inject('$kvTrackEvent');
const emit = defineEmits(['close-goal-modal', 'set-goal']);
const selectedCategory = ref(categories[0]);

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
};

const ctaCopy = computed(() => {
	return formStep.value === 1 ? 'Continue' : 'Set my goal';
});

const handleClick = goalNumber => {
	if (formStep.value === 1) {
		formStep.value += 1;
		$kvTrackEvent('portfolio', 'click', 'goal-setting-continue');
	} else {
		$kvTrackEvent('portfolio', 'click', 'set-goal-amount', goalNumber);
	}
};

const selectedCategoryLoanCount = computed(() => {
	return selectedCategory.value?.loanCount || 0;
});

const title = computed(() => {
	return formStep.value === 1
		? 'Choose one of Kiva’s key impact areas'
		// eslint-disable-next-line max-len
		: `You’ve helped ${selectedCategoryLoanCount.value} ${selectedCategory.value?.title} this year. <u>How many more</u> will you support? `;
});

const closeLightbox = () => {
	emit('close-goal-modal');
};
</script>

<style lang="postcss" scoped>
  .goal-setting-lightbox :deep(h2) {
    @apply tw-text-h2;
  }
</style>
