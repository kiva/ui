<template>
	<KvLightbox
		class="goal-in-review-modal tw-p-14 max-md:tw-flex max-md:tw-items-end
			max-md:tw-overflow-y-hidden max-md:tw-p-0
			[&_#kvLightboxBody]:!tw-p-0 [&_#kvLightboxBody]:tw-max-h-[calc(90vh-3.5rem)]
			[&_#kvLightboxBody]:tw-overflow-y-auto [&_#kvLightboxBody]:tw-[scrollbar-width:none]
			[&_#kvLightboxBody]:tw-[-ms-overflow-style:none]
			[&_#kvLightboxBody::-webkit-scrollbar]:tw-hidden
			md:[&_#kvLightboxBody]:tw-max-h-[calc(100vh-14rem)]"
		:visible="show"
		title=""
		@lightbox-closed="handleClose"
	>
		<template #header>
			<h2 class="tw-sr-only">
				{{ data?.year }} goal in review
			</h2>
		</template>
		<div class="tw-bg-secondary">
			<GoalInReviewSlide1 :goal-summary="data?.goalSummary" />
			<GoalInReviewSlide2 :loan-stats="data?.loanStats" />
			<GoalInReviewSlide3 :borrower-list="data?.borrowerList" />
			<GoalInReviewSlide4 :geography="data?.geography" />
			<GoalInReviewSlide5 :sectors="data?.sectors" />
			<GoalInReviewSlide6 :goal-insights="data?.goalInsights" />
			<GoalInReviewSlide7 :wrap-up="data?.wrapUp" />
		</div>
	</KvLightbox>
</template>

<script setup>
import {
	defineAsyncComponent,
	inject,
} from 'vue';
import { KvLightbox } from '@kiva/kv-components';

const GoalInReviewSlide1 = defineAsyncComponent(() => import('#src/components/MyKiva/GoalInReview/GoalInReviewSlide1'));
const GoalInReviewSlide2 = defineAsyncComponent(() => import('#src/components/MyKiva/GoalInReview/GoalInReviewSlide2'));
const GoalInReviewSlide3 = defineAsyncComponent(() => import('#src/components/MyKiva/GoalInReview/GoalInReviewSlide3'));
const GoalInReviewSlide4 = defineAsyncComponent(() => import('#src/components/MyKiva/GoalInReview/GoalInReviewSlide4'));
const GoalInReviewSlide5 = defineAsyncComponent(() => import('#src/components/MyKiva/GoalInReview/GoalInReviewSlide5'));
const GoalInReviewSlide6 = defineAsyncComponent(() => import('#src/components/MyKiva/GoalInReview/GoalInReviewSlide6'));
const GoalInReviewSlide7 = defineAsyncComponent(() => import('#src/components/MyKiva/GoalInReview/GoalInReviewSlide7'));

defineProps({
	show: {
		type: Boolean,
		default: false,
	},
	data: {
		type: Object,
		default: null,
	},
});

const emit = defineEmits(['close']);
const $kvTrackEvent = inject('$kvTrackEvent', () => {});

const handleClose = () => {
	$kvTrackEvent('portfolio', 'click', 'goal-in-review-close');
	emit('close');
};
</script>

<style lang="postcss">
.goal-in-review-modal {
	[data-test=kv-lightbox] {
		max-height: 90vh !important;

		@apply !tw-w-screen !tw-mt-auto !tw-mb-0 !tw-rounded-t !tw-rounded-b-none
			tw-bg-eco-green-4 tw-overflow-hidden tw-relative;
	}

	[data-test=kv-lightbox] > div:first-child {
		@apply tw-absolute tw-top-1.5 tw-right-1.5 tw-z-1 !tw-p-0 tw-text-white;
	}

	[data-test=kv-lightbox] > div:first-child button,
	[data-test=kv-lightbox] > div:first-child button:hover,
	[data-test=kv-lightbox] > div:first-child button:focus-visible {
		opacity: 1 !important;
		filter: drop-shadow(0 1px 2px rgb(0 0 0 / 80%));

		@apply !tw-bg-transparent !tw-text-white;
	}

	[data-test=kv-lightbox] > div:first-child button svg,
	[data-test=kv-lightbox] > div:first-child button svg * {
		fill: currentcolor !important;
		opacity: 1 !important;
		stroke: currentcolor !important;
	}

}

@screen md {
	.goal-in-review-modal [data-test=kv-lightbox] {
		width: min(calc(100vw - 14rem), 817px) !important;
		max-height: calc(100vh - 14rem) !important;

		@apply !tw-m-auto !tw-rounded;
	}
}
</style>
