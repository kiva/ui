<template>
	<KvLightbox
		class="goal-setting-lightbox"
		:visible="show"
		:title="lightboxTitle"
		@lightbox-closed="closeLightbox"
	>
		<h2 v-html="isMobile ? title : ''" class="tw-mb-3 tw-text-center"></h2>
		<component
			:is="contentComponent"
			:categories="categories"
			:pre-selected-category="selectedCategory.id"
			@category-selected="handleCategorySelected"
		/>
		<template #controls>
			<div class="tw-text-right">
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
import womenImg from '#src/assets/images/my-kiva/goal-setting/women.svg?url';
import refugeesImg from '#src/assets/images/my-kiva/goal-setting/refugees.svg?url';
import climateActionImg from '#src/assets/images/my-kiva/goal-setting/climate-action.svg?url';
import usEntrepreneursImg from '#src/assets/images/my-kiva/goal-setting/us-entrepreneurs.svg?url';
import basicNeedsImg from '#src/assets/images/my-kiva/goal-setting/basic-needs.svg?url';
import supportAllImg from '#src/assets/images/my-kiva/goal-setting/support-all.svg?url';

defineProps({
	show: {
		type: Boolean,
		default: false,
	},
});

const formStep = ref(1);
const categories = [
	{
		id: '1',
		name: 'Women',
		description: 'Open doors for women around the world',
		eventProp: 'women',
		customImage: womenImg,
	},
	{
		id: '2',
		name: 'Refugees',
		description: 'Transform the future for refugees',
		eventProp: 'refugees',
		customImage: refugeesImg,
	},
	{
		id: '3',
		name: 'Climate Action',
		description: 'Support the front lines of the climate crisis',
		eventProp: 'climate',
		customImage: climateActionImg,
	},
	{
		id: '4',
		name: 'U.S. Entrepreneurs',
		description: 'Support small businesses in the U.S.',
		eventProp: 'us-entrepreneur',
		customImage: usEntrepreneursImg,
	},
	{
		id: '5',
		name: 'Basic Needs',
		description: 'Clean water, healthcare, and sanitation',
		eventProp: 'basic-needs',
		customImage: basicNeedsImg,
	},
	{
		id: '6',
		name: 'Support All',
		description: 'Every loan makes real change',
		eventProp: 'help-everyone',
		customImage: supportAllImg,
	}
];

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);

const $kvTrackEvent = inject('$kvTrackEvent');
const emit = defineEmits(['goal-modal-closed']);
const selectedCategory = ref(categories[0]);

const CategoryForm = defineAsyncComponent(() => import('#src/components/MyKiva/GoalSetting/CategoryForm'));

const contentComponent = computed(() => {
	switch (formStep.value) {
		case 1: return CategoryForm;
		case 2: default: return undefined;
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

const title = computed(() => {
	return formStep.value === 1
		? 'Choose one of Kiva’s key impact areas'
		: 'You’ve helped 3 women this year. <u>How many more</u> will you support? ';
});

const lightboxTitle = computed(() => {
	return isMobile.value ? '' : title.value;
});

const handleClick = () => {
	if (formStep.value === 1) {
		$kvTrackEvent('portfolio', 'click', 'goal-setting-continue');
	}
};

const closeLightbox = () => {
	emit('goal-modal-closed');
};
</script>

<style lang="postcss" scoped>
  .goal-setting-lightbox :deep(h2) {
    @apply tw-text-h2;
  }
</style>
