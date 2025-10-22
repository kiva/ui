<template>
	<div
		class="
			tw-rounded md:tw-rounded-xl tw-bg-white
			tw-shadow-lg tw-px-3 md:tw-px-8 tw-py-4
			tw-flex tw-flex-col tw-gap-2 print:tw-hidden
			tw-items-center tw-text-center tw-overflow-hidden tw-relative"
	>
		<KvLoadingPlaceholder v-if="loading" class="!tw-h-9 !tw-rounded" />
		<template v-else>
			<div
				class="tw-space-y-12"
			>
				<div>
					<h3>You completed your goal!</h3>
					<h3>
						By supporting {{ currentGoal.target }} {{ goalDisplayName }} you're making real change.
					</h3>
				</div>
				<div class="tw-relative">
					<BgRays style="top: -50px;" />
					<BadgeContainer :show-shine="true">
						<HighFive alt="Hi five icon" style="width: 250px; height: 250px;" />
					</BadgeContainer>
				</div>
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
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import { mdiArrowRight } from '@mdi/js';
import {
	KvMaterialIcon,
	KvButton,
	KvLoadingPlaceholder,
} from '@kiva/kv-components';

import HighFive from '#src/assets/images/thanks-page/hi-five.svg';
import BadgeContainer from '#src/components/MyKiva/BadgeContainer';
import BgRays from '#src/components/Thanks/BgRays';

const $kvTrackEvent = inject('$kvTrackEvent');

const props = defineProps({
	currentGoal: {
		type: Object,
		default: null,
	},
	getGoalDisplayName: {
		type: Function,
		required: true,
	},
	loading: {
		type: Boolean,
		default: false,
	},
});

const router = useRouter();

const goalDisplayName = computed(() => {
	const category = props.currentGoal?.category || '';
	return category ? props.getGoalDisplayName(category) : 'loans';
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
