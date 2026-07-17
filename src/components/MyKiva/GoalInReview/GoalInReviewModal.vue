<template>
	<KvLightbox
		class="goal-in-review-modal"
		:visible="show"
		title=""
		@lightbox-closed="handleClose"
	>
		<template #header>
			<h2 class="tw-sr-only">
				{{ data?.year }} goal in review
			</h2>
		</template>
		<div class="goal-in-review-modal__body">
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
import { KvLightbox } from '@kiva/kv-components';

import GoalInReviewSlide1 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide1';
import GoalInReviewSlide2 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide2';
import GoalInReviewSlide3 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide3';
import GoalInReviewSlide4 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide4';
import GoalInReviewSlide5 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide5';
import GoalInReviewSlide6 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide6';
import GoalInReviewSlide7 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide7';

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

const handleClose = () => {
	emit('close');
};
</script>

<style lang="postcss">
.goal-in-review-modal {
	padding: 6.875rem;

	[data-test=kv-lightbox] {
		width: min(calc(100vw - 13.75rem), 817px) !important;
		max-height: calc(100vh - 13.75rem) !important;
		margin: auto !important;
		border-radius: 0.5rem !important;
		overflow: hidden;
		position: relative;
	}

	[data-test=kv-lightbox] > div:first-child {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		z-index: 1;
		padding: 0 !important;
		color: white;
	}

	#kvLightboxBody {
		padding: 0 !important;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	#kvLightboxBody::-webkit-scrollbar {
		display: none;
	}

	.goal-in-review-modal__body {
		@apply tw-bg-secondary;
	}
}

@media (width < 768px) {
	.goal-in-review-modal {
		display: flex;
		align-items: flex-end;
		overflow-y: hidden;
		padding: 0;
	}

	.goal-in-review-modal [data-test=kv-lightbox] {
		width: 100vw !important;
		max-height: 90vh !important;
		margin-top: auto !important;
		margin-bottom: 0 !important;
		border-radius: 0.5rem 0.5rem 0 0 !important;
		border-bottom-right-radius: 0 !important;
		border-bottom-left-radius: 0 !important;
		overflow: hidden;
	}

	.goal-in-review-modal #kvLightboxBody {
		max-height: calc(90vh - 3.5rem);
		overflow-y: auto;
	}
}
</style>
