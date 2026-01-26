<template>
	<div
		class="
			tw-rounded md:tw-rounded-xl tw-bg-white tw-shadow-lg
			tw-p-2.5 tw-py-2.5 md:tw-px-2.5 md:tw-py-4 tw-overflow-hidden"
	>
		<KvLoadingPlaceholder v-if="loading" class="!tw-h-9 !tw-rounded" />
		<div v-else>
			<!-- Goal in progress content -->
			<KvUserAvatar
				:lender-image-url="loanImageUrl"
				class="tw-mx-auto tw-w-6 tw-h-6 tw-mb-1"
			/>
			<h2 v-html="moduleTitle" class="tw-text-center tw-my-2" style="line-height: 1.25;"></h2>
			<img :src="HandsPlant" alt="plant inside of hands" class="img-dimensions tw-mx-auto tw-w-full tw-mb-1">
			<KvButton class="text-copy-centering tw-w-full tw-items-center tw-my-0.5" @click="handleSeeProgressClicked">
				See my progress
				<KvMaterialIcon :icon="mdiArrowRight" class="tw-ml-0.5" />
			</KvButton>
		</div>
	</div>
</template>

<script setup>
import { computed, inject } from 'vue';
import {
	KvLoadingPlaceholder,
	KvButton,
	KvMaterialIcon,
	KvUserAvatar,
} from '@kiva/kv-components';
import { mdiArrowRight } from '@mdi/js';
import HandsPlant from '#src/assets/images/thanks-page/hands-plant-v2.png';
import { ID_BASIC_NEEDS, ID_CLIMATE_ACTION, ID_SUPPORT_ALL } from '#src/composables/useBadgeData';
import useGoalData from '#src/composables/useGoalData';

const $kvTrackEvent = inject('$kvTrackEvent');

const { getGoalDisplayName } = useGoalData({});

const props = defineProps({
	loading: {
		type: Boolean,
		default: false,
	},
	isOptedIn: {
		type: Boolean,
		default: false,
	},
	loan: {
		type: Object,
		default: () => ({}),
	},
	currentGoal: {
		type: Object,
		default: null,
	},
	targetLoansAmount: {
		type: Number,
		default: 0,
	},
});

const loanImageUrl = computed(() => props.loan?.image?.url ?? '');

const goalDisplayName = computed(() => {
	const category = props.currentGoal?.category || '';
	return category ? getGoalDisplayName(props.targetLoansAmount, category) : '';
});

const moduleTitle = computed(() => {
	let title = '';
	if (props.isOptedIn) {
		title += 'Thank you!<br />';
	}

	if (props.targetLoansAmount > 0) {
		const category = props.currentGoal?.category;
		const count = props.targetLoansAmount;
		const name = goalDisplayName.value;
		if (category === ID_SUPPORT_ALL) {
			title += `You're making progress towards your goal of making ${count} loans this year`;
		} else if (category === ID_BASIC_NEEDS || category === ID_CLIMATE_ACTION) {
			title += `You're making progress towards your goal of making ${count} ${name} loans this year.`;
		} else {
			title += `You're making progress towards your goal of making ${count} loans to ${name} this year.`;
		}
		return title;
	}

	return title;
});

const handleSeeProgressClicked = () => {
	const CLICK_EVENT_ACTION = 'click';
	const EVENT_CATEGORY = 'post-checkout';
	$kvTrackEvent(
		EVENT_CATEGORY,
		CLICK_EVENT_ACTION,
		'continue-to-my-kiva',
		'signed-in',
		'see-my-progress'
	);
	window.location = '/mykiva';
};
</script>

<style lang="postcss" scoped>
.text-copy-centering :deep(span) {
	@apply tw-flex;
}

.img-dimensions {
	width: 198px;
	height: 191px;
}
</style>
