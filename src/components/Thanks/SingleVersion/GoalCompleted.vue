<template>
	<div
		class="tw-rounded md:tw-rounded-xl tw-bg-white
			tw-shadow-lg tw-px-3 md:tw-px-8
			tw-py-4 tw-flex tw-flex-col
			tw-gap-2 print:tw-hidden tw-items-center
			tw-text-center tw-overflow-hidden tw-relative"
	>
		<KvLoadingPlaceholder v-if="isLoading" class="!tw-h-9 !tw-rounded" />
		<template v-else>
			<div style="padding-bottom:350px">
				<h3>You completed your goal!</h3>
				<h3>By supporting {{ goalTarget }} {{ goalString }} you're making real change.</h3>
			</div>
			<div class="tw-font-medium">
				See progress towards all your impact goals
			</div>
			<KvButton class="continue-button tw-w-full tw-my-0.5" @click="handleContinue">
				Continue
				<KvMaterialIcon :icon="mdiArrowRight" class="tw-ml-0.5" />
			</KvButton>
		</template>
	</div>
</template>
<script setup>
import {
	computed,
	inject,
} from 'vue';
import { mdiArrowRight } from '@mdi/js';
import {
	KvMaterialIcon,
	KvButton,
	KvLoadingPlaceholder
} from '@kiva/kv-components';
import { useRouter } from 'vue-router';

import {
	ID_WOMENS_EQUALITY,
	ID_US_ECONOMIC_EQUALITY,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_BASIC_NEEDS,
	ID_EQUITY,
} from '#src/composables/useBadgeData';

const $kvTrackEvent = inject('$kvTrackEvent');

const props = defineProps({
	goalCategory: {
		type: String,
		default: '',
	},
	goalTarget: {
		type: Number,
		default: 0,
	},
});

const router = useRouter();

const goalString = computed(() => {
	const goalMap = {
		[ID_BASIC_NEEDS]: 'basic needs loans',
		[ID_CLIMATE_ACTION]: 'eco-friendly loans',
		[ID_EQUITY]: 'equity loans',
		[ID_REFUGEE_EQUALITY]: 'refugees',
		[ID_US_ECONOMIC_EQUALITY]: 'U.S. entrepreneurs',
		[ID_WOMENS_EQUALITY]: 'women',
	};
	return goalMap[props.goalCategory] || 'loans';
});

const handleContinue = () => {
	const CLICK_EVENT_ACTION = 'click';
	const EVENT_CATEGORY = 'post-checkout';
	$kvTrackEvent(
		EVENT_CATEGORY,
		CLICK_EVENT_ACTION,
		'continue-to-my-kiva',
		'signed-in',
	);
	router?.push('/mykiva#my-achievements');
};

</script>

<style lang="postcss" scoped>
.continue-button :deep(span) {
	@apply tw-flex;
}

</style>
