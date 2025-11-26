<template>
	<div class="card-container tw-h-full goal-card-bg">
		<div class="card-header tw-py-0">
			<slot name="header"></slot>
		</div>
		<div class="card-body tw-text-center tw-text-base tw-pt-4 tw-pb-2">
			<h2 class="tw-pb-2">
				Thank you!
			</h2>
			<slot name="content"></slot>
		</div>
		<div class="card-footer tw-py-0 tw-text-center tw-mx-auto tw-mb-2">
			<ThumbUp
				class="tw-w-12 tw-h-12" viewBox="25 20 175 175"
			/>
		</div>
	</div>
</template>

<script setup>
import ThumbUp from '#src/assets/images/thanks-page/thumbs-up.svg';
</script>

<style lang="postcss" scoped>
.card-container {
	z-index: 1;

	@apply tw-w-full tw-relative tw-rounded tw-shadow tw-p-1 md:tw-p-2 tw-flex tw-flex-col
		tw-overflow-hidden tw-bg-white tw-shrink-0;
}

.goal-card-bg::before {
	content: '';
	width: 400px;
    height: 598px;
    background: url('/src/assets/images/my-kiva/goal-card-bg.png'), lightgray;
    transform: rotate(31deg);
    left: 62%;
    top: -40%;
    right: 0;
    z-index: -1;
    opacity: 0.5;

	@apply tw-absolute tw-bg-cover tw-bg-center tw-bg-no-repeat tw-right-0 tw-bg-blend-overlay;
}
</style>
