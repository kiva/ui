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
			<h2 v-html="moduleTitle" class="tw-text-center tw-mb-1" style="line-height: 1.25;"></h2>
			<PlaceholderGoalInProgress class="tw-mx-auto tw-w-full tw-mb-1" />
			<KvButton class="see-progress-button tw-w-full tw-items-center tw-my-0.5" @click="handleSeeProgressClicked">
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
import PlaceholderGoalInProgress from '#src/assets/images/thanks-page/placeholder-goal-inprogress.svg';

const $kvTrackEvent = inject('$kvTrackEvent');

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
	getGoalDisplayName: {
		type: Function,
		required: true,
	},
	targetLoansAmount: {
		type: Number,
		default: 0,
	},
	remainingTargetLoansAmount: {
		type: Number,
		default: 0,
	},
});

const loanImageUrl = computed(() => props.loan?.image?.url ?? '');

const goalDisplayName = computed(() => {
	const category = props.currentGoal?.category || '';
	return category ? props.getGoalDisplayName(props.targetLoansAmount, category) : '';
});

const moduleTitle = computed(() => {
	let title = '';
	if (props.isOptedIn) {
		title += 'Thank you!<br />';
	}

	if (props.targetLoansAmount > 0) {
		// eslint-disable-next-line max-len
		title += `You’re making progress towards your goal of making ${props.targetLoansAmount} loans to ${goalDisplayName.value} this year. Just ${props.remainingTargetLoansAmount} more to go!`;
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
.see-progress-button :deep(span) {
	@apply tw-flex;
}
</style>
